import React from 'react';
import {Box, Grid2, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {Link, NavLink, useNavigate} from 'react-router-dom';
import FullScreenMenu from './FullScreenMenu';
import CustomButton, {ButtonVariant} from '../../shared/CustomButton';
import HomeIcon from '@mui/icons-material/Home';

// Define a type for navigation links.
export interface HeaderLink {
  label: string;
  to: string;
}

// Define a type for a center button configuration.
export interface CenterButtonConfig {
  text: string;
  onClick: () => void;
  variant?: ButtonVariant;
  width?: string;
  height?: string;
}

// Props for our header component.
export interface AppHeaderProps {
  title: string;
  leftLinks?: HeaderLink[];
  rightLinks?: HeaderLink[];
  centerButton?: boolean;
  homeIconDestination?: string;
  mainDestination?: string;
}

// Create a styled NavLink that shows an underline when active and on hover.
const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
  color: 'inherit',
  fontSize: '1.25rem',
  position: 'relative',
  paddingBottom: theme.spacing(0.5),
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '2px',
    backgroundColor: theme.palette.primary.light,
    bottom: theme.spacing(0.4),
    left: 0,
    opacity: 0,
    transition: 'opacity 0.2s ease-in-out',
  },
  '&.active::after': {
    opacity: 1,
  },
  '&:hover::after': {
    opacity: 0.8,
  },
}));

const WeddingHeader: React.FC<AppHeaderProps> = ({
                                                   title,
                                                   leftLinks = [],
                                                   rightLinks = [],
                                                   centerButton = false,
                                                   homeIconDestination,
                                                   mainDestination,
                                                 }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/rsvp");
  };

  return (
      <Box
          className="text-center"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
      >
        {/* Top Row: Home Icon, Title & FullScreenMenu */}
        <Grid2 container alignItems="center">
          <Grid2 size={2} container alignItems="center">
            {homeIconDestination && (
                <Box
                    component={NavLink}
                    to={homeIconDestination}
                    sx={{display: 'flex', alignItems: 'center'}}
                >
                  <HomeIcon fontSize="large" sx={{color: (theme) => theme.palette.primary.main}}/>
                </Box>
            )}
          </Grid2>
          <Grid2 size={8} sx={{textAlign: 'center'}}>
            {mainDestination ? <Link to={mainDestination} style={{textDecoration: 'none'}}>
                  <Typography variant="h1" sx={{fontSize: 'clamp(1em, 4vw + 1em, 6em)'}}>
                    {title}
                  </Typography>
                </Link> :
                <Typography variant="h1" sx={{fontSize: 'clamp(1em, 4vw + 1em, 6em)'}}>
                  {title}
                </Typography>
            }
          </Grid2>
          <Grid2 size={2} container justifyContent="flex-end">
            <FullScreenMenu/>
          </Grid2>
        </Grid2>

        {/* Navigation Row for screens sm and up */}
        {centerButton ? (
            // When button exists: links on left/right with button centered.
            <Box
                sx={{
                  display: {xs: 'none', sm: 'grid'},
                  gridTemplateColumns: '1fr auto 1fr',
                  alignItems: 'center',
                  gap: 3,
                }}
            >
              {leftLinks && (
                  <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: 3}}>
                    {leftLinks.map((link) => (
                        <StyledNavLink key={link.to} to={link.to}>
                          {link.label}
                        </StyledNavLink>
                    ))}
                  </Box>
              )}
              <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <CustomButton
                    text="RSVP"
                    onClick={handleClick}
                    variant="dark"
                    width="80px"
                    height="40px"
                />
              </Box>
              {rightLinks && (
                  <Box sx={{display: 'flex', justifyContent: 'flex-start', gap: 3}}>
                    {rightLinks.map((link) => (
                        <StyledNavLink key={link.to} to={link.to}>
                          {link.label}
                        </StyledNavLink>
                    ))}
                  </Box>
              )}
            </Box>
        ) : (
            // When only links exist: center them together.
            <Box
                sx={{
                  display: {xs: 'none', sm: 'flex'},
                  justifyContent: 'center',
                  gap: 3,
                }}
            >
              {leftLinks.map((link) => (
                  <StyledNavLink key={link.to} to={link.to}>
                    {link.label}
                  </StyledNavLink>
              ))}
              {rightLinks.map((link) => (
                  <StyledNavLink key={link.to} to={link.to}>
                    {link.label}
                  </StyledNavLink>
              ))}
            </Box>
        )}

        {/* Navigation Row for small screens */}
        {centerButton ? (
            // For small screens when button exists, show only the button.
            <Box
                sx={{
                  display: {xs: 'flex', sm: 'none'},
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
        ) : (
            // For small screens when only links exist, center the links.
            <Box
                sx={{
                  display: {xs: 'flex', sm: 'none'},
                  justifyContent: 'center',
                  gap: 3,
                }}
            >
              {leftLinks.map((link) => (
                  <StyledNavLink key={link.to} to={link.to}>
                    {link.label}
                  </StyledNavLink>
              ))}
              {rightLinks.map((link) => (
                  <StyledNavLink key={link.to} to={link.to}>
                    {link.label}
                  </StyledNavLink>
              ))}
            </Box>
        )}
      </Box>
  );
};

export default WeddingHeader;
