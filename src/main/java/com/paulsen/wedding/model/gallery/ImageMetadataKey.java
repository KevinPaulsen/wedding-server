package com.paulsen.wedding.model.gallery;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey;

import java.io.Serializable;

public class ImageMetadataKey implements Serializable {

    private String imageId;
    private Long orderValue;

    @DynamoDBHashKey(attributeName="imageId") public String getImageId() {
        return imageId;
    }

    public void setImageId(String imageId) {
        this.imageId = imageId;
    }

    @DynamoDBRangeKey(attributeName="orderValue") public Long getOrderValue() {
        return orderValue;
    }

    public void setOrderValue(Long orderValue) {
        this.orderValue = orderValue;
    }
}

