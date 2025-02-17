package com.paulsen.wedding.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIndexHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIndexRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName="WeddingGalleryMetadata") public class ImageMetadata {

    public static final String PARTITION = "PHOTO";

    @DynamoDBHashKey private String imageId;

    @DynamoDBAttribute(attributeName="orderValue")
    @DynamoDBIndexRangeKey(globalSecondaryIndexName="partition-orderValue-index") private Long orderValue;

    @DynamoDBAttribute(attributeName="imageUrl") private String imageUrl;
    @DynamoDBAttribute(attributeName="width") private Integer width;

    @DynamoDBAttribute(attributeName="height") private Integer height;

    @DynamoDBAttribute(attributeName="uploadTimestamp") private long uploadTimestamp;

    // Getters and setters
    public String getImageId() {
        return imageId;
    }

    public void setImageId(String imageId) {
        this.imageId = imageId;
    }

    public Long getOrderValue() {
        return orderValue;
    }

    public void setOrderValue(Long orderValue) {
        this.orderValue = orderValue;
    }

    @DynamoDBAttribute(attributeName="partition")
    @DynamoDBIndexHashKey(globalSecondaryIndexName="partition-orderValue-index") public String getPartition() {
        return PARTITION;
    }

    public void setPartition(String partition) {
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

    public long getUploadTimestamp() {
        return uploadTimestamp;
    }

    public void setUploadTimestamp(long uploadTimestamp) {
        this.uploadTimestamp = uploadTimestamp;
    }
}
