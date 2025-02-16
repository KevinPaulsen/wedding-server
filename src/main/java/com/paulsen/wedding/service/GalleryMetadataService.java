package com.paulsen.wedding.service;

import com.paulsen.wedding.model.ImageMetadata;
import com.paulsen.wedding.repositories.ImageMetadataRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service public class GalleryMetadataService {

    private final ImageMetadataRepository imageMetadataRepository;

    public GalleryMetadataService(ImageMetadataRepository imageMetadataRepository) {
        this.imageMetadataRepository = imageMetadataRepository;
    }

    public List<ImageMetadata> allMetadata() {
        List<ImageMetadata> allMetaData = new ArrayList<>();
        imageMetadataRepository.findAll().forEach(allMetaData::add);
        return allMetaData;
    }

    @Transactional public ImageMetadata saveImageMetadata(String imageId, String imageUrl, int width, int height,
            long uploadTimestamp) {
        ImageMetadata imageMetadata = new ImageMetadata();
        imageMetadata.setImageId(imageId);
        imageMetadata.setImageUrl(imageUrl);
        imageMetadata.setWidth(width);
        imageMetadata.setHeight(height);
        imageMetadata.setUploadTimestamp(uploadTimestamp);
        return imageMetadataRepository.save(imageMetadata);
    }
}

