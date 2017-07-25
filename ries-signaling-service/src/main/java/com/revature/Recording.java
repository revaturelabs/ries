package com.revature;

import java.io.File;

/**
 * Created by User on 7/12/2017.
 */
public class Recording {
    private String name;
    private String fileDirectory;
    private String accessKeyId;
    private String secretKey;
    private File file;

    public Recording() {
    }

    public File getFile() {
        return file;
    }

    public void setFile(File file) {
        this.file = file;
    }

    public String getAccessKeyId() {
        return accessKeyId;
    }

    public void setAccessKeyId(String accessKeyId) {
        this.accessKeyId = accessKeyId;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFileDirectory() {
        return fileDirectory;
    }

    public void setFileDirectory(String fileDirectory) {
        this.fileDirectory = fileDirectory;
    }
    @Override
    public String toString() {
        return "Recording{" +
                "name='" + name + '\'' +
                ", file=" + fileDirectory +
                ", accessKeyId='" + accessKeyId + '\'' +
                ", secretKey='" + secretKey + '\'' +
                '}';
    }
}
