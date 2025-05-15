// components/admin/AdminStatsOverview.tsx
import React from 'react';
import {Box, Card, CardContent, Grid2, Typography, useTheme} from '@mui/material';

export interface StatsData {
  mainStatName: string;
  mainStatData: number;
  smallStats: {
    statName: string;
    data: {
      name?: string;
      statData: number;
      color?: string;
    }[]
  }[];
}

interface AdminStatsDashboardProps {
  stats: StatsData;
}

const AdminStatsDashboard: React.FC<AdminStatsDashboardProps> = ({ stats }) => {
  const theme = useTheme();

  // Helper to determine the color: use provided color or fallback to theme text primary.
  const getColor = (color?: string): string => color || theme.palette.text.primary;

  return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mx: 1,
      }}>
        <Card
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: 2,
              gap: 1,
              width: '100%',
              maxWidth: 1200,
              bgcolor: theme.palette.secondary.light,
            }}
        >
          <Card sx={{ textAlign: 'center' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {stats.mainStatName}
              </Typography>
              <Typography variant="h4">{stats.mainStatData}</Typography>
            </CardContent>
          </Card>

          {/* Small Stats Cards */}
          <Grid2 container spacing={1} justifyContent="center">
            {stats.smallStats.map((group, index) => (
                <Grid2 key={index} size={{xs: 12, sm: 6, lg: 3}}>
                  <Card>
                    <CardContent>
                      {/* If there is only one data item without a name, display a simple card */}
                      {group.data.length === 1 && !group.data[0].name ? (
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                              {group.statName}
                            </Typography>
                            <Typography variant="h4" sx={{ color: getColor(group.data[0].color) }}>
                              {group.data[0].statData}
                            </Typography>
                          </Box>
                      ) : (
                          <>
                            <Typography
                                variant="h6"
                                sx={{ textAlign: 'center', textTransform: 'capitalize', mb: 1 }}
                            >
                              {group.statName}
                            </Typography>
                            <Box sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-around',
                            }}>
                              {group.data.map((item, idx) => (
                                  <Box sx={{ textAlign: 'center' }}>
                                    {item.name && (
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ fontWeight: 'bold', color: getColor(item.color) }}
                                        >
                                          {item.name}
                                        </Typography>
                                    )}
                                    <Typography variant="h6">{item.statData}</Typography>
                                  </Box>
                              ))}
                            </Box>
                          </>
                      )}
                    </CardContent>
                  </Card>
                </Grid2>
            ))}
          </Grid2>
        </Card>
      </Box>
  );
};

export default AdminStatsDashboard;
