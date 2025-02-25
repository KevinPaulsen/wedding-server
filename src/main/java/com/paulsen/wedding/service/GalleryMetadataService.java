package com.paulsen.wedding.service;

import com.paulsen.wedding.model.gallery.ImageMetadata;
import com.paulsen.wedding.repositories.ImageMetadataRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        ImageMetadata max = imageMetadataRepository.findFirstByPartitionOrderByOrderValueDesc(ImageMetadata.PARTITION)
                                                   .orElse(null);

        ImageMetadata imageMetadata = new ImageMetadata();
        imageMetadata.setImageId(imageId);
        imageMetadata.setOrderValue((max == null ? 0 : max.getOrderValue()) + SEPARATION_VALUE);
        imageMetadata.setImageUrl(imageUrl);
        imageMetadata.setWidth(width);
        imageMetadata.setHeight(height);
        imageMetadata.setUploadTimestamp(uploadTimestamp);

        return imageMetadataRepository.save(imageMetadata);
    }

    @Transactional public void changeImageOrder(String movingImageId, String previousImageId, String followingImageId) {
        ImageMetadata moving = movingImageId == null || movingImageId.isEmpty() ? null
                                                                                :
                               imageMetadataRepository.getImageMetadataByImageId(
                                                                                        movingImageId).orElse(null);
        ImageMetadata previous = previousImageId == null || previousImageId.isEmpty() ? null
                                                                                      :
                                 imageMetadataRepository.getImageMetadataByImageId(
                                                                                                                       previousImageId)
                                                                                                               .orElse(null);
        ImageMetadata next = followingImageId == null || followingImageId.isEmpty() ? null
                                                                                    :
                             imageMetadataRepository.getImageMetadataByImageId(
                                                                                                                     followingImageId)
                                                                                                             .orElse(null);

        long previousValue = previous == null ? 0 : previous.getOrderValue();
        long nextValue = next == null ? previousValue + 2 * SEPARATION_VALUE : next.getOrderValue();

        if (moving == null || (previous == null && next == null)) {
            return;
        }

        long moveTo = (previousValue + nextValue) / 2;

        if (previousValue == moveTo || nextValue == moveTo) {
            resetOrderValues();
            changeImageOrder(movingImageId, previousImageId, followingImageId);
        } else {
            moving.setOrderValue(moveTo);
            imageMetadataRepository.save(moving);
        }
    }

    private void resetOrderValues() {
        List<ImageMetadata> allImageData
                = imageMetadataRepository.findAllByPartitionOrderByOrderValueAsc(ImageMetadata.PARTITION);

        long currentOrderValue = SEPARATION_VALUE;

        for (ImageMetadata image : allImageData) {
            image.setOrderValue(currentOrderValue);
            imageMetadataRepository.save(image);
            currentOrderValue += SEPARATION_VALUE;
        }
    }

    public void delete(String imageId) {
        imageMetadataRepository.getImageMetadataByImageId(imageId).ifPresent(imageMetadataRepository::delete);
    }
}

