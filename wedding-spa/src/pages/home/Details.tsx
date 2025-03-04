// pages/home/Details.tsx
import React from 'react';
import { Typography } from '@mui/material';
import BaseLayout from '../../components/main/BaseLayout';
import Timeline from '../../components/main/timeline/Timeline';

const Details: React.FC = () => {
    return (
        <BaseLayout>
            <>
                <Typography
                    variant="h4"
                    align="center"
                    gutterBottom
                    sx={{ mb: 3 }}
                >
                    Wedding Details
                </Typography>
                <Timeline />
            </>
        </BaseLayout>
    );
};

export default Details;
