import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Button, Typography } from '@mui/material';
import CustomButton from "../../shared/CustomButton";

interface GenericCardProps {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
}

const DonateCard: React.FC<GenericCardProps> = ({
                                                   image,
                                                   title,
                                                   description,
                                                   buttonText,
                                                   onButtonClick,
                                                 }) => {
  return (
      <Card sx={{ maxWidth: 345, bgcolor: "secondary.light" }}>
        <CardMedia
            component="img"
            height="200"
            image={image}
            alt={title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "center" }}>
          <CustomButton text={buttonText} onClick={onButtonClick} variant="dark" />
        </CardActions>
      </Card>
  );
};

export default DonateCard;
