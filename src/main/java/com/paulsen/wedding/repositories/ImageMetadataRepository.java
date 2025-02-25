package com.paulsen.wedding.repositories;

import com.paulsen.wedding.model.gallery.ImageMetadata;
import com.paulsen.wedding.model.gallery.ImageMetadataKey;
import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository @EnableScan public interface ImageMetadataRepository
        extends CrudRepository<ImageMetadata, ImageMetadataKey> {
    Optional<ImageMetadata> getImageMetadataByImageId(String imageId);

    Optional<ImageMetadata> findFirstByPartitionOrderByOrderValueDesc(String orderGroup);

    List<ImageMetadata> findAllByPartitionOrderByOrderValueAsc(String orderGroup);
}
