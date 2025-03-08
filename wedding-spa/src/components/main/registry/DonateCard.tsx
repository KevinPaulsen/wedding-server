import React from 'react';
import {Box, Card, CardActions, CardContent, CardMedia, Typography} from '@mui/material';
import CustomButton from "../../shared/CustomButton";
import VenmoDonateButton from "./VenmoDonateButton";

interface GenericCardProps {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  showVenmo?: boolean;
}

const DonateCard: React.FC<GenericCardProps> = ({
                                                   image,
                                                   title,
                                                   description,
                                                   buttonText,
                                                   onButtonClick,
                                                  showVenmo,
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
          <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', gap: 1}}>
            <CustomButton text={buttonText} onClick={onButtonClick} variant="dark" maxWidth="100%"/>
            {showVenmo && <VenmoDonateButton/>}
          </Box>
        </CardActions>
      </Card>
  );
};

export default DonateCard;
