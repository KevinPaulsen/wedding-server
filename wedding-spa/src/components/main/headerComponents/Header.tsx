import React, { useState, useEffect, useRef } from 'react';
import { Box, Grid2, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import FullScreenMenu from './FullScreenMenu';
import CustomButton from '../../shared/CustomButton';
import HomeIcon from '@mui/icons-material/Home';

export interface HeaderLink {
  label: string;
  to: string;
}

export interface AppHeaderProps {
  title: string;
  leftLinks?: HeaderLink[];
  rightLinks?: HeaderLink[];
  centerButton?: boolean;
  homeIconDestination?: string;
  mainDestination?: string;
}

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
  const [isTitleSticky, setIsTitleSticky] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    navigate('/rsvp');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (titleRef.current) {
        const rect = titleRef.current.getBoundingClientRect();
        // When the title's top is at or above 64px (adjust to your fixed header height)
        setIsTitleSticky(rect.top <= 40);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
      <>
        {/* Mobile Fixed Header */}
        <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              zIndex: 1100,
              py: 1,
              px: {xs: 1, sm: 3},
              backgroundColor: (theme) => theme.palette.secondary.main,
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.3s ease-in-out',
            }}
        >
          {/* Home Icon on the left */}
          {homeIconDestination && (
              <Box
                  component={NavLink}
                  to={homeIconDestination}
                  sx={{ display: 'flex', alignItems: 'center' }}
              >
                <HomeIcon fontSize="large" sx={{ color: (theme) => theme.palette.primary.main }} />
              </Box>
          )}

          {/* Center placeholder: either title when sticky, or an empty box with fixed width */}
          <Box sx={{ textAlign: 'center' }}>
              <Typography
                  variant="h1"
                  sx={{
                    color: (theme) => isTitleSticky ? theme.palette.primary.main : theme.palette.secondary.main,
                    fontSize: 'clamp(1em, 4vw + 1em, 6em)',
                    transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
                    opacity: 1,
                  }}
              >
                {title}
              </Typography>
          </Box>

          {/* FullScreen Menu on the right */}
          <FullScreenMenu links={[...leftLinks, ...rightLinks]} />
        </Box>

        {/* Main header content */}
        <Box
            sx={{
              pt: { xs: '20px', md: 0 }, // offset for the fixed mobile header
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
        >
          {/* Desktop Top Row (visible on md and up) */}
          <Grid2 container alignItems="center" px={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Grid2 size={2} container alignItems="center">
              {homeIconDestination && (
                  <Box
                      component={NavLink}
                      to={homeIconDestination}
                      sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <HomeIcon fontSize="large" sx={{ color: (theme) => theme.palette.primary.main }} />
                  </Box>
              )}
            </Grid2>
            <Grid2 size={8} sx={{ textAlign: 'center' }}>
              {mainDestination ? (
                  <Link to={mainDestination} style={{ textDecoration: 'none' }}>
                    <Typography variant="h1" sx={{ fontSize: 'clamp(1em, 4vw + 1em, 6em)' }}>
                      {title}
                    </Typography>
                  </Link>
              ) : (
                  <Typography variant="h1" sx={{ fontSize: 'clamp(1em, 4vw + 1em, 6em)' }}>
                    {title}
                  </Typography>
              )}
            </Grid2>
            <Grid2 size={2} container justifyContent="flex-end">
              <FullScreenMenu links={[...leftLinks, ...rightLinks]} />
            </Grid2>
          </Grid2>

          {/* Mobile Title (visible on xs) */}
          <Box
              ref={titleRef}
              sx={{
                display: { xs: 'flex', md: 'none' },
                justifyContent: 'center',
                px: 3,
                transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
                opacity: isTitleSticky ? 0 : 1,
              }}
          >
            {mainDestination ? (
                <Link to={mainDestination} style={{ textDecoration: 'none' }}>
                  <Typography variant="h1" sx={{ fontSize: 'clamp(1em, 4vw + 1em, 6em)', textAlign: 'center' }}>
                    {title}
                  </Typography>
                </Link>
            ) : (
                <Typography variant="h1" sx={{ fontSize: 'clamp(1em, 4vw + 1em, 6em)', textAlign: 'center' }}>
                  {title}
                </Typography>
            )}
          </Box>

          {/* Navigation Row */}
          {centerButton ? (
              <>
                {/* Desktop Navigation */}
                <Box
                    sx={{
                      display: { xs: 'none', md: 'grid' },
                      gridTemplateColumns: '1fr auto 1fr',
                      alignItems: 'center',
                      gap: 3,
                    }}
                >
                  {leftLinks && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3 }}>
                        {leftLinks.map((link) => (
                            <StyledNavLink key={link.to} to={link.to}>
                              {link.label}
                            </StyledNavLink>
                        ))}
                      </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CustomButton text="RSVP" onClick={handleClick} variant="dark" width="80px" height="40px" />
                  </Box>
                  {rightLinks && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 3 }}>
                        {rightLinks.map((link) => (
                            <StyledNavLink key={link.to} to={link.to}>
                              {link.label}
                            </StyledNavLink>
                        ))}
                      </Box>
                  )}
                </Box>

                {/* Mobile Navigation: only show RSVP button */}
                <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mt: 2 }}>
                  <CustomButton text="RSVP" onClick={handleClick} variant="dark" width="80px" height="40px" />
                </Box>
              </>
          ) : (
              <>
                {/* Desktop Navigation Links */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: 3 }}>
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

                {/* Mobile Navigation Links */}
                <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', gap: 3, mt: 2 }}>
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
              </>
          )}
        </Box>
      </>
  );
};

export default WeddingHeader;
