package com.revature;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
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
	 * @param record - Recording object that holds string name as the input from host and file that is the recording blob
	 *
	 * @return String that tells user that the file has been saved
	 */
	@RequestMapping(value="/signaling", method= RequestMethod.POST, produces= MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> saveRecording(@RequestBody Recording record){

		if(!record.getFile().exists() || record.getName().isEmpty() || record.getName() == null){
			return new ResponseEntity<>("Error Saving Recording", HttpStatus.BAD_REQUEST);
		}

		//bucket that stores recordings; service makes a new bucket if it doesn't exist
		String bucketName = "ries-recordings";
		//propertiy key and values that defaultclient needs to make s3clinet
		String accesskeyID = "aws.accessKeyId";
		String secretkey = "aws.secretKey";
		//values of the keys
		String accessIdValue = "AKIAJXZ564AKLLLEW4LQ";
		String secretValue = "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";

		System.setProperty(accesskeyID,accessIdValue);
		System.setProperty(secretkey,secretValue);

		// create a client connection based on credentials
//		AmazonS3 s3client = new AmazonS3Client(credentials);
		AmazonS3 s3client = AmazonS3ClientBuilder.defaultClient();

		//make bucket if it doesn't exist
		if(!s3client.doesBucketExist(bucketName)){
			s3client.createBucket(bucketName);
		}

		//stores recording to bucket
		s3client.putObject(bucketName,record.getName(),record.getFile());

		//return message
		return new ResponseEntity<>(record.getName() + " has been saved", HttpStatus.OK);
	}
}
