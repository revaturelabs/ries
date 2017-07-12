package com.revature;

import java.io.File;

/**
 * Created by User on 7/12/2017.
 */
public class Recording {
    private String name;
    private File file;

    public Recording() {
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
}
