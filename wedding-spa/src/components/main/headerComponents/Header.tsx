import React from 'react';
import { Container, Box, Grid2 } from '@mui/material';
import { styled } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import FullScreenMenu from "./FullScreenMenu";
import Title from "./Title";
import CustomButton from "../../shared/CustomButton";

// Create a styled NavLink that shows a thick underline when active.
const StyledNavLink = styled(NavLink)(({ theme }) => ({
    textDecoration: 'none',
    color: 'inherit',
    fontSize: '1.25rem',
    position: 'relative',
    paddingBottom: theme.spacing(0.5),
    '&:after': {
        content: '""',
        position: 'absolute',
        width: '100%',
        height: '2px',
        backgroundColor: theme.palette.primary.light,
        bottom: theme.spacing(0.4),
        left: 0,
        opacity: 0,
    },
    // When the link is active, show the underline.
    '&.active:after': {
        opacity: 1,
    },
}));

const WeddingHeader: React.FC = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/rsvp");
    };

    return (
        <Container className="py-5 text-center">
            {/* Header Row - HomePage Button, Stack Button, Title */}
            <Grid2 container alignItems="center" px={0}>
                <Grid2 size={2}></Grid2>
                <Grid2 size={8}>
                    <Title />
                </Grid2>
                <Grid2 size={2} container justifyContent="flex-end">
                    <FullScreenMenu />
                </Grid2>
            </Grid2>

            {/* Content Row - RSVP Button, Navigation */}
            <Box
                sx={{
                    mt: 3,
                    display: { xs: 'none', sm: 'grid' },
                    gridTemplateColumns: '1fr auto 1fr',
                    alignItems: 'center',
                    gap: 3,
                }}
            >
                {/* Left Links */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 3,
                    }}
                >
                    <StyledNavLink to="/gallery">Gallery</StyledNavLink>
                    <StyledNavLink to="/details">Details</StyledNavLink>
                </Box>

                {/* Centered Button */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <CustomButton
                        text="RSVP"
                        onClick={handleClick}
                        variant="dark"
                        width="80px"
                        height="40px"
                    />
                </Box>

                {/* Right Links */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        gap: 3,
                    }}
                >
                    <StyledNavLink to="/registry">Registry</StyledNavLink>
                    <StyledNavLink to="/story">Our Story</StyledNavLink>
                </Box>
            </Box>

            {/* RSVP Button for Small Screens */}
            <Box
                sx={{
                    mt: 3,
                    display: { xs: 'flex', sm: 'none' },
                    justifyContent: 'center',
                }}
            >
                <CustomButton
                    text="RSVP"
                    onClick={handleClick}
                    variant="dark"
                    width="80px"
                />
            </Box>
        </Container>
    );
};

export default WeddingHeader;
