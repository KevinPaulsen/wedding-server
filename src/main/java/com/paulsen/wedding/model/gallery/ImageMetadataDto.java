package com.paulsen.wedding.model.gallery;

import java.util.Objects;

public class ImageMetadataDto {
    private String imageId;
    private String imageUrl;
    private Integer width;
    private Integer height;

    public ImageMetadataDto(String imageId, String imageUrl, Integer width, Integer height) {
        this.imageId = imageId;
        this.imageUrl = imageUrl;
        this.width = width;
        this.height = height;
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

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    @Override public final boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ImageMetadataDto that)) {
            return false;
        }

        return Objects.equals(getImageId(), that.getImageId()) && Objects.equals(getImageUrl(), that.getImageUrl()) &&
               Objects.equals(getWidth(), that.getWidth()) && Objects.equals(getHeight(), that.getHeight());
    }

    @Override public int hashCode() {
        int result = Objects.hashCode(getImageId());
        result = 31 * result + Objects.hashCode(getImageUrl());
        result = 31 * result + Objects.hashCode(getWidth());
        result = 31 * result + Objects.hashCode(getHeight());
        return result;
    }
}
