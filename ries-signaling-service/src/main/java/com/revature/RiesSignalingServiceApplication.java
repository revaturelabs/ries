package com.revature;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.PutObjectResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.io.File;

@SpringBootApplication
@RestController
@EnableDiscoveryClient
public class RiesSignalingServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(RiesSignalingServiceApplication.class, args);
	}

	/**
	 * signaling service takes a string entered by the host, and the recording file and stores it to amazon s3
	 * that is set up to store the recordings
	 * @param record - Recording object that holds string name as the input from host and file that is the recording blob
	 *	               also includes secrectkey and accessidkey that host inputs
	 *
	 * @return Respone Entity<String></String> that tells user that the file has been saved or if there was an error
	 */
	@RequestMapping(value="/signaling", method= RequestMethod.POST, produces= MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> saveRecording(@RequestBody Recording record){

		System.out.println("Inside Signaling Service");
		
		if(record.getName() == null || record.getName().isEmpty() || (!record.getFile().exists()) ){
			return new ResponseEntity<>("Error: Invalid name or file", HttpStatus.BAD_REQUEST);
		}

		if(record.getSecretKey() == null || record.getSecretKey().isEmpty() ||
				record.getAccessKeyId() == null || record.getAccessKeyId().isEmpty()){
			return new ResponseEntity<>("Error: missing keys for AmazonS3", HttpStatus.BAD_REQUEST);
		}

		//bucket that stores recordings; service makes a new bucket if it doesn't exist
		String bucketName = "revature-ries-recording";


		//propertiy key and values that defaultclient needs to make s3clinet
		String accesskeyID = "aws.accessKeyId";
		String secretkey = "aws.secretKey";
		//values of the keys
		String accessIdValue = record.getAccessKeyId();
		String secretValue = record.getSecretKey();

		System.setProperty(accesskeyID,accessIdValue);
		System.setProperty(secretkey,secretValue);

		// create a client connection based on credentials
		AmazonS3 s3client = AmazonS3ClientBuilder.standard()
                .withRegion(Regions.US_EAST_2)
                .build();
		//make bucket if it doesn't exist
		if(!s3client.doesBucketExist(bucketName)){
			s3client.createBucket(bucketName);
		}

		//stores recording to bucket
		PutObjectResult resp = s3client.putObject(bucketName,record.getName(),record.getFile());
		return new ResponseEntity<>(record.getName() + " has been saved", HttpStatus.OK);

	}
}
