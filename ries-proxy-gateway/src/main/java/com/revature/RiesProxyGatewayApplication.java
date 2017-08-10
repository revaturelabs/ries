package com.revature;

import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingClass;
import org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.GsonHttpMessageConverter;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@SpringBootApplication
@EnableAutoConfiguration(exclude = { JacksonAutoConfiguration.class })
@EnableZuulProxy
@EnableDiscoveryClient
public class RiesProxyGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(RiesProxyGatewayApplication.class, args);
	}

	@Configuration
	@ConditionalOnClass(Gson.class)
	@ConditionalOnMissingClass("com.fasterxml.jackson.core.JsonGenerator")
	@ConditionalOnBean(Gson.class)
	protected static class GsonHttpMessageConverterConfiguration {

		@Bean
		@ConditionalOnMissingBean
		public GsonHttpMessageConverter gsonHttpMessageConverter(Gson gson) {
			GsonHttpMessageConverter converter = new GsonHttpMessageConverter();
			converter.setGson(gson);
			return converter;
		}
	}

	@Bean
	public OAuth2RestTemplate oAuth2RestTemplate(
			OAuth2ProtectedResourceDetails resourceDetails, OAuth2ClientContext clientContext) {
		return new OAuth2RestTemplate(resourceDetails, clientContext);
	}

	/**
	 * This Cross Origin Resource Sharing (CORS) filter is required
	 * to specify which requests are allowed from other domains.
	 * The client side webapp is hosted on a separate EC2 so this
	 * CorsFilter needs to be configured to allow the webapp's
	 * domain name. The configuration variables have been moved to
	 * the application.yml file. The variables are comma separated
	 * and should contain no spaces around the comma.
	 * @param origins A list of allowed origins. Default: *
	 * @param methods A list of allowed methods. Default: *
	 * @param headers A List of allowed headers: Default: *
	 * @return Configured CorsFilter
	 */
	@Bean
	public CorsFilter corsFilter(
			@Value("#{'${security.access-control.allow.origin:*}'.split(',')}") List<String> origins,
			@Value("#{'${security.access-control.allow.methods:*}'.split(',')}") List<String> methods,
			@Value("#{'${security.access-control.allow.headers:*}'.split(',')}") List<String> headers) {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowCredentials(true);
		config.setAllowedOrigins(origins);
		config.setAllowedMethods(methods);
		config.setAllowedHeaders(headers);
		source.registerCorsConfiguration("/**", config);
		return new CorsFilter(source);
	}
}
