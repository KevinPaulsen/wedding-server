package com.paulsen.wedding.repositories;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.paulsen.wedding.model.AvailableRsvpCode;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AvailableRsvpCodeRepository {

    private final DynamoDBMapper dynamoDBMapper;

    public AvailableRsvpCodeRepository(DynamoDBMapper dynamoDBMapper) {
        this.dynamoDBMapper = dynamoDBMapper;
    }

    public AvailableRsvpCode getAnyAvailableCode() {
        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression().withLimit(1);

        List<AvailableRsvpCode> result = dynamoDBMapper.scan(AvailableRsvpCode.class, scanExpression);

        return result.isEmpty() ? null : result.get(0);
    }

    public void delete(AvailableRsvpCode availableRsvpCode) {
        dynamoDBMapper.delete(availableRsvpCode);
    }
}