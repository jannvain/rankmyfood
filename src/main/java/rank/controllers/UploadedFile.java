package rank.controllers;

import org.springframework.web.multipart.*;


public class UploadedFile {

    private MultipartFile file;

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        System.out.println("setFile");
        this.file = file;
    }
}


