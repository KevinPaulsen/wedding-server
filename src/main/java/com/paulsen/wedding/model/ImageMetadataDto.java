package com.paulsen.wedding.model;

import java.util.Objects;

public class ImageMetadataDto {
    private String imageId;
    private String imageUrl;

    public ImageMetadataDto(String imageId, String imageUrl) {
        this.imageId = imageId;
        this.imageUrl = imageUrl;
    }

    public ImageMetadataDto() {
    }

    public String getImageId() {
        return imageId;
    }

    public void setImageId(String imageId) {
        this.imageId = imageId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    @Override public final boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ImageMetadataDto that)) {
            return false;
        }

        return Objects.equals(getImageId(), that.getImageId()) && Objects.equals(getImageUrl(), that.getImageUrl());
    }

    @Override public int hashCode() {
        int result = Objects.hashCode(getImageId());
        result = 31 * result + Objects.hashCode(getImageUrl());
        return result;
    }
}
