import React, {useState} from 'react';
import {Box, Button, Container} from '@mui/material';
import {NavLink, useNavigate} from 'react-router-dom';
import {styled} from '@mui/material/styles';
import Title from "./Title";
import CustomButton from "../../shared/CustomButton";
import '../../../styles/FullScreenMenu.css';

// Create a styled NavLink for the menu links.
const StyledMenuLink = styled(NavLink)(({theme}) => ({
  textDecoration: 'none',
  color: theme.palette.primary.contrastText,
  fontSize: '2rem',
  position: 'relative',
  margin: theme.spacing(1, 0),
  // Create a pseudo-element for the underline.
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '3px', // thicker underline
    backgroundColor: theme.palette.primary.light,
    bottom: '-4px', // position it a bit further below the text
    left: 0,
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
  },
  // When active, reveal the underline.
  '&.active::after': {
    opacity: 1,
  },
}));

const FullScreenMenu: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const handleRsvpClick = () => {
    navigate("/rsvp");
  };

  return (
      <>
        {/* Menu Toggle Button for small screens */}
        <Box
            sx={{display: {xs: 'block', sm: 'none'}}}
            className={`menu-button-container ${menuOpen ? 'above-overlay' : ''}`}
        >
          <Button
              onClick={toggleMenu}
              className={`menu-button ${menuOpen ? 'open' : ''}`}
              aria-label="Toggle Menu"
          >
            <Box className="menu-icon">
              <Box className="line top-line"/>
              <Box className="line middle-line"/>
              <Box className="line bottom-line"/>
            </Box>
          </Button>
        </Box>

        {/* Fullscreen Overlay */}
        <Box className={`fullscreen-overlay ${menuOpen ? 'show' : ''}`}>
          <Container
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
          >
            {/* Title Row (Centered) */}
            <Box
                sx={{
                  mt: 6,
                  height: '50px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
            >
              <Title color="var(--main-light)"/>
            </Box>

            {/* Menu Links (Grows to fill available space) */}
            <Box
                sx={{
                  flexGrow: 1,
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
            >
              <StyledMenuLink to="/gallery">Gallery</StyledMenuLink>
              <StyledMenuLink to="/details">Details</StyledMenuLink>
              <StyledMenuLink to="/registry">Registry</StyledMenuLink>
              <StyledMenuLink to="/story">Our Story</StyledMenuLink>
            </Box>

            {/* RSVP Button Row */}
            <Box
                sx={{
                  mb: 5,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
            >
              <CustomButton
                  text="RSVP"
                  onClick={handleRsvpClick}
                  variant="lightOutlined"
                  width="80px"
                  height="40px"
              />
            </Box>
          </Container>
        </Box>
      </>
  );
};

export default FullScreenMenu;
