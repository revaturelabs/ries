package com.revature;


import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.PutObjectResult;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.File;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.anyObject;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(SpringRunner.class)
@SpringBootTest
public class RiesSignalingServiceApplicationTests {

	@Test
	public void contextLoads() {
	}

	@Test
	public void saveRecordingTestPass(){

		Recording testRecording = new Recording();
		testRecording.setName("testName");
		testRecording.setFile(new File("testFile"));
		testRecording.setAccessKeyId("12345");
		testRecording.setSecretKey("it's a secret");

		ResponseEntity<String> expected = new ResponseEntity<>(testRecording.getName() + " has been saved", HttpStatus.OK);
		ResponseEntity<String> actual = testController(testRecording);

		assertEquals("responses don't match", expected,actual);
	}

	@Test
	public void saveRecordingTestNullName(){

		Recording testRecording = new Recording();

		testRecording.setFile(new File("testFile"));
		testRecording.setAccessKeyId("12345");
		testRecording.setSecretKey("it's a secret");

		ResponseEntity<String> expected =  new ResponseEntity<>("Error: Invalid name or file", HttpStatus.BAD_REQUEST);
		ResponseEntity<String> actual = testController(testRecording);

		assertEquals("responses don't match", expected,actual);
	}

	@Test
	public void saveRecordingTestNullFile(){

		Recording testRecording = new Recording();
		testRecording.setName("test");

		testRecording.setAccessKeyId("12345");
		testRecording.setSecretKey("it's a secret");

		ResponseEntity<String> expected =  new ResponseEntity<>("Error: Invalid name or file", HttpStatus.BAD_REQUEST);
		ResponseEntity<String> actual = testController(testRecording);

		assertEquals("responses don't match", expected,actual);
	}

	@Test
	public void saveRecordingTestNullSecretKey(){

		Recording testRecording = new Recording();
		testRecording.setName("test");

		testRecording.setAccessKeyId("12345");
		testRecording.setFile(new File("testFile"));

		ResponseEntity<String> expected =  new ResponseEntity<>("Error: missing keys for AmazonS3", HttpStatus.BAD_REQUEST);
		ResponseEntity<String> actual = testController(testRecording);

		assertEquals("responses don't match", expected,actual);
	}

	@Test
	public void saveRecordingTestNullAccessKey(){

		Recording testRecording = new Recording();

		testRecording.setName("test");
		testRecording.setFile(new File("testFile"));
		testRecording.setSecretKey("it's a secret");

		ResponseEntity<String> expected =  new ResponseEntity<>("Error: missing keys for AmazonS3", HttpStatus.BAD_REQUEST);
		ResponseEntity<String> actual = testController(testRecording);

		assertEquals("responses don't match", expected,actual);
	}



	//mockito test function
	public ResponseEntity<String> testController(Recording testRecording){
		ResponseEntity<String> actual = new ResponseEntity<>(testRecording.getName() + " has been saved", HttpStatus.OK);
		AmazonS3 s3client = Mockito.mock(AmazonS3.class);
		when(s3client.doesBucketExist(anyString())).thenReturn(false);
		when(s3client.putObject(anyString(),anyString(),(File)anyObject())).thenReturn(new PutObjectResult());

		if( testRecording.getName() == null || testRecording.getName().isEmpty() ||
				(testRecording.getFile() == null)){
			ResponseEntity<String> resp = new ResponseEntity<>("Error: Invalid name or file", HttpStatus.BAD_REQUEST);
			actual = resp;
			return actual;
		}

		if(testRecording.getSecretKey() == null || testRecording.getSecretKey().isEmpty() ||
				testRecording.getAccessKeyId() == null || testRecording.getAccessKeyId().isEmpty()){
			ResponseEntity<String> resp = new ResponseEntity<>("Error: missing keys for AmazonS3", HttpStatus.BAD_REQUEST);
			actual = resp;
			return actual;
		}

		//bucket that stores recordings; service makes a new bucket if it doesn't exist
		String bucketName = "ries-recordings";
		//propertiy key and values that defaultclient needs to make s3clinet
		String accesskeyID = "aws.accessKeyId";
		String secretkey = "aws.secretKey";
		//values of the keys
		String accessIdValue = testRecording.getAccessKeyId();
		String secretValue = testRecording.getSecretKey();

		System.setProperty(accesskeyID,accessIdValue);
		System.setProperty(secretkey,secretValue);

		//make bucket if it doesn't exist
		if(!s3client.doesBucketExist(bucketName)){
			s3client.createBucket(bucketName);
		}

		//stores recording to bucket
		PutObjectResult resp = s3client.putObject(bucketName,testRecording.getName(),testRecording.getFile());



		verify(s3client).doesBucketExist(anyString());
		verify(s3client).putObject(anyString(),anyString(),(File)anyObject());
		return actual;
	}
}
