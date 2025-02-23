package com.paulsen.wedding.model.gallery;

import java.util.Objects;

public class ChangeImageOrderDto {
    private String movingImageId;
    private String previousImageId;
    private String followingImageId;

    public ChangeImageOrderDto(String movingImageId, String previousImageId, String followingImageId) {
        this.movingImageId = movingImageId;
        this.previousImageId = previousImageId;
        this.followingImageId = followingImageId;
    }

    public ChangeImageOrderDto() {}

    public String getMovingImageId() {
        return movingImageId;
    }

    public void setMovingImageId(String movingImageId) {
        this.movingImageId = movingImageId;
    }

    public String getPreviousImageId() {
        return previousImageId;
    }

    public void setPreviousImageId(String previousImageId) {
        this.previousImageId = previousImageId;
    }

    public String getFollowingImageId() {
        return followingImageId;
    }

    public void setFollowingImageId(String followingImageId) {
        this.followingImageId = followingImageId;
    }

    @Override public final boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ChangeImageOrderDto that)) {
            return false;
        }

        return Objects.equals(getMovingImageId(), that.getMovingImageId()) &&
               Objects.equals(getPreviousImageId(), that.getPreviousImageId()) &&
               Objects.equals(getFollowingImageId(), that.getFollowingImageId());
    }

    @Override public int hashCode() {
        int result = Objects.hashCode(getMovingImageId());
        result = 31 * result + Objects.hashCode(getPreviousImageId());
        result = 31 * result + Objects.hashCode(getFollowingImageId());
        return result;
    }
}
