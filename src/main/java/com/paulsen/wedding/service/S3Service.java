package com.paulsen.wedding.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.util.Date;

@Service public class S3Service {

    private static final String BUCKET_NAME = "paulsen-wedding-photo-gallery";
    private final AmazonS3 s3Client;

    public S3Service() {
        this.s3Client = AmazonS3ClientBuilder.standard().withRegion("us-west-2").build();
    }

    public URL generatePreSignedUrl(String key, HttpMethod httpMethod, Date expiration) {
        GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(BUCKET_NAME,
                                                                                                  key).withMethod(
                httpMethod).withExpiration(expiration);
        return s3Client.generatePresignedUrl(generatePresignedUrlRequest);
    }

    public void deleteFile(String key) {
        s3Client.deleteObject(BUCKET_NAME, key);
    }
}

