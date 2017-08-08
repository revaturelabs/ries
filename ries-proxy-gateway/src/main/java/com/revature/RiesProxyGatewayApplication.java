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
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.converter.json.GsonHttpMessageConverter;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;
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

	@Bean
	public CorsFilter corsFilter(
			@Value("#{'${security.access-control.allow.origin}'.split(',')}") List<String> origins,
			@Value("#{'${security.access-control.allow.methods}'.split(',')}") List<String> methods,
			@Value("#{'${security.access-control.allow.headers}'.split(',')}") List<String> headers) {
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
