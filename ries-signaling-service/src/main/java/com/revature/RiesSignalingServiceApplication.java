package com.revature;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.client.RestTemplate;

import java.io.File;

@SpringBootApplication
public class RiesSignalingServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(RiesSignalingServiceApplication.class, args);
	}

	@Autowired
	RestTemplate restTemplate;


	@Bean
	protected RestTemplate restTemplate(){
		return new RestTemplate();
	}

	/**
	 * signaling service takes a string entered by the host, and the recording file and stores it to amazon s3
	 * that is set up to store the recodings
	 * @param recordingName - string that  host enters in for the name of the recording
	 * @param recordingFile - mp4 file that is the recording made during transcording
	 * @return String that tells user that the file has been saved
	 */
	@RequestMapping(value="/signaling", method= RequestMethod.POST, produces= MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> checkoutBook(@RequestBody String recordingName, @RequestBody File recordingFile){

		if(!recordingFile.exists() || recordingName.isEmpty()){
			return new ResponseEntity<>("Error Saving Recording", HttpStatus.BAD_REQUEST);
		}

		//bucket that stores recordings; service makes a new bucket if it doesn't exist
		String bucketName = "ries-recordings";

		//still need s3 access information
		AWSCredentials credentials = new BasicAWSCredentials(
				"YourAccessKeyID",
				"YourSecretAccessKey");

		// create a client connection based on credentials
		AmazonS3 s3client = new AmazonS3Client(credentials);

		//
		if(!s3client.doesBucketExist(bucketName)){
			s3client.createBucket(bucketName);
		}

		//stores recording to bucket
		s3client.putObject(bucketName,recordingName,recordingFile);

		//return message
		return new ResponseEntity<>(recordingName + " has been saved", HttpStatus.OK);
	}
}
