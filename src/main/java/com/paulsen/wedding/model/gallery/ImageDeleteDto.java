package com.paulsen.wedding.model.gallery;

import java.util.Objects;

public class ImageDeleteDto {
    private String imageId;

    public String getImageId() {
        return imageId;
    }

    public void setImageId(String imageId) {
        this.imageId = imageId;
    }

    @Override public final boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ImageDeleteDto that)) {
            return false;
        }

        return Objects.equals(getImageId(), that.getImageId());
    }

    @Override public int hashCode() {
        return Objects.hashCode(getImageId());
    }
}
