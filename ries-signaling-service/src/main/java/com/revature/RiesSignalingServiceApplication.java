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
	 * Revature
	 * RIES
	 * ries-signaling-service
	 * July 25, 2017
	 *
	 * ries-signaling-service takes a string entered by the host, and the recording file and stores it to amazon s3
	 * that is set up to store the recordings
	 *
	 * To run this service in the RIES application, the AngularJS controller downloads the blob object made in after
	 * recording the interview. The service uses a directory that points to the downloaded file. After uploading the
	 * file to the amazon client, the file is deleted from the directory. The service is set up such that one needs to be
	 * running on windows and save files to the default download directory when downloading files.
	 *
	 *
	 * Bucket name and region are hard coded into service. One will need to change it inside the service, or make it an input parameter
	 *
	 * JUnit testing covers test cases where fields are null. For test case where s3client fails to instance, such as incorrect
	 * keys, wrap client builder in try catch block
	 *
	 * @param record - Recording object that holds string name as the input from host and file that is the recording blob
	 *	               also includes secretKey and accessKeyId that host inputs
	 *	 record fields:
	 *	 String name - name field is a string that the host enters into a form after recording the video;
	 *	    					name is used for key name in bucket as well as the file name
	 *
	 *	 String accessKeyId and String secretKey - keys to get amazsonS3 client, both are entered by host in form;
	 *	         								 keys are set as system properties, but could be replaced with
	 *	         								 enviroment variables in jenkins, docker, etc.
	 *
	 *	 String file directory - directory to downloaded file, the directory is set by the service and points to the file
	 *	             			in the default download location on windows
	 *
	 *	 File file - file object that represents the file. Not used in the main application. file is used the JUnit tests
	 *
	 * @return Respone Entity<String> that tells user that the file has been saved or if there was an error, including
	 * 			the http status for the promise in AngularJS
	 */
	@RequestMapping(value="/signaling", method= RequestMethod.POST, produces= MediaType.TEXT_PLAIN_VALUE)
	public ResponseEntity<String> saveRecording(@RequestBody Recording record){

//		System.out.println("Inside Signaling Service");
//		System.out.println(record);

		//exception handling for null/empty form fields; returns message to user describing type of error
		if(record.getName() == null || record.getName().isEmpty()){
			return new ResponseEntity<>("Error: Invalid name or file", HttpStatus.BAD_REQUEST);
		}

		if(record.getSecretKey() == null || record.getSecretKey().isEmpty() ||
				record.getAccessKeyId() == null || record.getAccessKeyId().isEmpty()){
			return new ResponseEntity<>("Error: missing keys for AmazonS3", HttpStatus.BAD_REQUEST);
		}

		//the directory to the file points to the default download directory for windows
		record.setFileDirectory("\\Users\\" + System.getProperty("user.name") + "\\Downloads\\" + record.getName() + ".mp4");

// System.out.println(record.getFileDirectory());

		//create file object from file directory
		File uploadFile = new File(record.getFileDirectory());

		//bucket that stores recordings; service makes a new bucket if it doesn't exist
		String bucketName = "test-ries-recording";

		//propertiy key and values that defaultclient needs to make s3clinet
		String accesskeyID = "aws.accessKeyId";
		String secretkey = "aws.secretKey";

		//values of the keys which are sent as part of a form from the user
		String accessIdValue = record.getAccessKeyId();
		String secretValue = record.getSecretKey();

		//set system properties for the s3client to build
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
		PutObjectResult resp = s3client.putObject(bucketName,record.getName(),uploadFile);


		//deletes the downloaded file after its uploaded to bucket
		uploadFile.delete();

		//return message for UX
		return new ResponseEntity<>(record.getName() + " has been saved", HttpStatus.OK);

	}
}
