package com.paulsen.wedding.repositories;

import com.paulsen.wedding.model.ImageMetadata;
import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

@EnableScan public interface ImageMetadataRepository extends CrudRepository<ImageMetadata, String> {
    Optional<ImageMetadata> findByImageId(String imageId);
}
