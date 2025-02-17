package com.paulsen.wedding.repositories;

import com.paulsen.wedding.model.ImageMetadata;
import com.paulsen.wedding.model.ImageMetadataKey;
import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository @EnableScan public interface ImageMetadataRepository extends CrudRepository<ImageMetadata, ImageMetadataKey> {
    // This method will use the GSI to query items with orderGroup="PHOTO" and sort by orderValue descending.
    Optional<ImageMetadata> findFirstByPartitionOrderByOrderValueDesc(String orderGroup);

    List<ImageMetadata> findAllByPartitionOrderByOrderValueAsc(String orderGroup);
}
