// components/admin/AdminStatsDashboard.tsx
import React from 'react';
import { Box, Card, CardContent, Typography, Grid, useTheme } from '@mui/material';

interface EventStats {
  pending: number;
  coming: number;
  notComing: number;
}

export interface StatsData {
  totalGuests: number;
  events: {
    [key: string]: EventStats;
  };
}

interface AdminStatsDashboardProps {
  stats: StatsData;
}

const AdminStatsDashboard: React.FC<AdminStatsDashboardProps> = ({ stats }) => {
  const theme = useTheme();

  // Helper function using MUI theme colors
  const getColor = (type: 'pending' | 'coming' | 'notComing'): string => {
    switch (type) {
      case 'pending':
        return theme.palette.info.main;
      case 'coming':
        return theme.palette.success.main;
      case 'notComing':
        return theme.palette.error.main;
      default:
        return '#000';
    }
  };

  return (
      <Box sx={{
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Card
            sx={{
              p: 2,
              mx: 1,
              maxWidth: 1100,
              bgcolor: theme.palette.secondary.dark
            }}
        >
          <Grid container spacing={2}>
            {/* Global Total Guests */}
            <Grid item xs={12}>
              <Card sx={{ textAlign: 'center' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Total Guests
                  </Typography>
                  <Typography variant="h4">{stats.totalGuests}</Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Event-specific Stats */}
            {Object.entries(stats.events).map(([eventName, eventData]) => (
                <Grid item xs={12} sm={6} md={3} key={eventName}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ textTransform: 'capitalize', mb: 1 }}>
                        {eventName}
                      </Typography>
                      <Grid container spacing={1}>
                        {(['pending', 'coming', 'notComing'] as const).map((key) => (
                            <Grid item xs={4} key={key}>
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{ color: getColor(key), fontWeight: 'bold' }}
                                >
                                  {key.charAt(0).toUpperCase() + key.slice(1)}
                                </Typography>
                                <Typography variant="h6">{eventData[key]}</Typography>
                              </Box>
                            </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
            ))}
          </Grid>
        </Card>
      </Box>
  );
};

export default AdminStatsDashboard;
