package com.paulsen.wedding.service;

import com.paulsen.wedding.model.ImageMetadata;
import com.paulsen.wedding.repositories.ImageMetadataRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service public class GalleryMetadataService {

    private static final long SEPARATION_VALUE = 2L << 20;

    private final ImageMetadataRepository imageMetadataRepository;

    public GalleryMetadataService(ImageMetadataRepository imageMetadataRepository) {
        this.imageMetadataRepository = imageMetadataRepository;
    }

    public List<ImageMetadata> allMetadata() {
        return imageMetadataRepository.findAllByPartitionOrderByOrderValueAsc(ImageMetadata.PARTITION);
    }

    @Transactional public ImageMetadata saveImageMetadata(String imageId, String imageUrl, int width, int height,
            long uploadTimestamp) {
        ImageMetadata max = imageMetadataRepository.findFirstByPartitionOrderByOrderValueDesc(ImageMetadata.PARTITION).orElse(null);

        ImageMetadata imageMetadata = new ImageMetadata();
        imageMetadata.setImageId(imageId);
        imageMetadata.setOrderValue((max == null ? 0 : max.getOrderValue()) + SEPARATION_VALUE);
        imageMetadata.setImageUrl(imageUrl);
        imageMetadata.setWidth(width);
        imageMetadata.setHeight(height);
        imageMetadata.setUploadTimestamp(uploadTimestamp);

        return imageMetadataRepository.save(imageMetadata);
    }
}

