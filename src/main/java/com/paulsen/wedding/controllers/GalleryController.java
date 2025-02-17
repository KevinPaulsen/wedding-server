package com.paulsen.wedding.controllers;

import com.amazonaws.HttpMethod;
import com.paulsen.wedding.model.ChangeImageOrderDto;
import com.paulsen.wedding.model.ImageMetadata;
import com.paulsen.wedding.model.ImageMetadataDto;
import com.paulsen.wedding.service.GalleryMetadataService;
import com.paulsen.wedding.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URL;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController @RequestMapping("/gallery") public class GalleryController {

    private final S3Service s3Service;
    private final GalleryMetadataService metadataService;

    @Autowired public GalleryController(S3Service s3Service, GalleryMetadataService metadataService) {
        this.s3Service = s3Service;
        this.metadataService = metadataService;
    }

    @PostMapping("/generate-presigned-url")
    public ResponseEntity<Map<String, String>> generatePresignedUrl(@RequestBody Map<String, String> request) {
        String fileName = request.get("fileName");
        // You might want to do additional validations or add a UUID to fileName
        String key = "images/" + fileName;

        // Set expiration, e.g., URL valid for 10 minutes
        Date expiration = new Date(System.currentTimeMillis() + 10 * 60 * 1000);

        URL url = s3Service.generatePreSignedUrl(key, HttpMethod.PUT, expiration);
        Map<String, String> response = new HashMap<>();
        response.put("url", url.toString());
        response.put("key", key);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/metadata")
    public ResponseEntity<ImageMetadata> saveMetadata(@RequestBody ImageMetadataDto metadataDto) {
        // Extract metadata details from request body
        long uploadTimestamp = System.currentTimeMillis();

        ImageMetadata metadata = metadataService.saveImageMetadata(metadataDto.getImageId(),
                                                                   metadataDto.getImageUrl(),
                                                                   metadataDto.getWidth(),
                                                                   metadataDto.getHeight(),
                                                                   uploadTimestamp);
        return ResponseEntity.ok(metadata);
    }

    @GetMapping("/all") public ResponseEntity<List<ImageMetadata>> getAllRsvps() {
        return ResponseEntity.ok(metadataService.allMetadata());
    }

    @PostMapping("/change-image-order")
    public ResponseEntity<Void> changeImageOrder(@RequestBody ChangeImageOrderDto changeImageOrderDto) {
        metadataService.changeImageOrder(changeImageOrderDto.getMovingImageId(),
                                         changeImageOrderDto.getPreviousImageId(),
                                         changeImageOrderDto.getFollowingImageId());

        return ResponseEntity.ok().build();
    }
}
