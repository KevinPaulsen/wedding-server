package com.paulsen.wedding.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIndexHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIndexRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import org.springframework.data.annotation.Id;

@DynamoDBTable(tableName="photo_gallery_metadata") public class ImageMetadata {

    public static final String PARTITION = "PHOTO";
    @Id private ImageMetadataKey metadataKey = new ImageMetadataKey();

    @DynamoDBAttribute(attributeName="imageUrl") private String imageUrl;
    @DynamoDBAttribute(attributeName="width") private Integer width;

    @DynamoDBAttribute(attributeName="height") private Integer height;

    @DynamoDBAttribute(attributeName="uploadTimestamp") private long uploadTimestamp;

    // Getters and setters
    @DynamoDBHashKey
    public String getImageId() {
        return metadataKey.getImageId();
    }
    public void setImageId(String imageId) {
        metadataKey.setImageId(imageId);
    }

    @DynamoDBRangeKey(attributeName = "orderValue")
    @DynamoDBIndexRangeKey(globalSecondaryIndexName = "partition-orderValue-index")
    public Long getOrderValue() {
        return metadataKey.getOrderValue();
    }

    public void setOrderValue(Long orderValue) {
        metadataKey.setOrderValue(orderValue);
    }

    @DynamoDBAttribute(attributeName = "partition")
    @DynamoDBIndexHashKey(globalSecondaryIndexName = "partition-orderValue-index")
    public String getPartition() {
        return PARTITION;
    }

    public void setPartition(String partition) {}

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
