package com.revature;

import java.io.File;

/**
 * Created by User on 7/12/2017.
 */
public class Recording {
    private String name;
    private File file;
    private String accessKeyId;
    private String secretKey;

    public Recording() {
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

    public File getFile() {
        return file;
    }

    public void setFile(File file) {
        this.file = file;
    }

    @Override
    public String toString() {
        return "Recording{" +
                "name='" + name + '\'' +
                ", file=" + file +
                ", accessKeyId='" + accessKeyId + '\'' +
                ", secretKey='" + secretKey + '\'' +
                '}';
    }
}
