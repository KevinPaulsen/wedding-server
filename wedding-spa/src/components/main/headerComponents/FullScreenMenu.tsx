import React, { useState } from 'react';
import { Box, Button, Container } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Title from "./Title";
import CustomButton from "../../shared/CustomButton";
import '../../../styles/FullScreenMenu.css';

// Define the HeaderLink type (should match what you already use)
export interface HeaderLink {
  label: string;
  to: string;
}

// Accept links as a prop
interface FullScreenMenuProps {
  links: HeaderLink[];
}

// Create a styled NavLink for the menu links.
const StyledMenuLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.contrastText,
  fontSize: '2rem',
  position: 'relative',
  margin: theme.spacing(1, 0),
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '3px',
    backgroundColor: theme.palette.primary.light,
    bottom: '-4px',
    left: 0,
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
  },
  '&.active::after': {
    opacity: 1,
  },
}));

const FullScreenMenu: React.FC<FullScreenMenuProps> = ({ links }) => {
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
        {/* Menu Toggle Button for medium screens */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }} className={`menu-button-container ${menuOpen ? 'above-overlay' : ''}`}>
          <Button sx={{minWidth: 0, p: 0}} onClick={toggleMenu} className={`menu-button ${menuOpen ? 'open' : ''}`} aria-label="Toggle Menu">
            <Box className="menu-icon">
              <Box className="line top-line" />
              <Box className="line middle-line" />
              <Box className="line bottom-line" />
            </Box>
          </Button>
        </Box>

        {/* Fullscreen Overlay */}
        <Box className={`fullscreen-overlay ${menuOpen ? 'show' : ''}`}>
          <Container sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Title Row (Centered) */}
            <Box sx={{ mt: 6, height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Title color="var(--main-light)" />
            </Box>

            {/* Menu Links (Grows to fill available space) */}
            <Box sx={{ flexGrow: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              {links.map(link => (
                  <StyledMenuLink key={link.to} to={link.to}>
                    {link.label}
                  </StyledMenuLink>
              ))}
            </Box>

            {/* RSVP Button Row */}
            <Box sx={{ mb: 5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CustomButton text="RSVP" onClick={handleRsvpClick} variant="lightOutlined" width="80px" height="40px" />
            </Box>
          </Container>
        </Box>
      </>
  );
};

export default FullScreenMenu;
