import { Box, Grid, Paper, Typography, Card, CardContent } from '@mui/material';
import NatureIcon from '@mui/icons-material/Nature';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import ParkIcon from '@mui/icons-material/Park';
import WarningIcon from '@mui/icons-material/Warning';

export const Dashboard = () => {
  // Placeholder data - will be replaced with real data from Firebase
  const stats = [
    {
      title: 'Total Trees',
      value: '0',
      icon: <NatureIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: 'In Nursery',
      value: '0',
      icon: <LocalFloristIcon sx={{ fontSize: 40 }} />,
      color: '#66bb6a',
    },
    {
      title: 'Planted',
      value: '0',
      icon: <ParkIcon sx={{ fontSize: 40 }} />,
      color: '#4caf50',
    },
    {
      title: 'Critical Health',
      value: '0',
      icon: <WarningIcon sx={{ fontSize: 40 }} />,
      color: '#f44336',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Welcome to the Tree Inventory Management System
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4">{stat.value}</Typography>
                  </Box>
                  <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <Typography color="text.secondary">
              No recent activities yet. Start by adding trees to your inventory.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Typography color="text.secondary">
              • Add a new tree to inventory
              <br />
              • Record maintenance activity
              <br />
              • Update tree health status
              <br />
              • Generate reports
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Getting Started
        </Typography>
        <Typography paragraph>
          To begin using the Tree Inventory System:
        </Typography>
        <Typography component="div">
          <ol>
            <li>Set up your Firebase project and add credentials to .env.local</li>
            <li>Navigate to the Trees section to add your first tree</li>
            <li>Add suppliers and locations for better organization</li>
            <li>Track growth measurements and maintenance activities</li>
            <li>Monitor tree health and generate reports</li>
          </ol>
        </Typography>
      </Paper>
    </Box>
  );
};

// Made with Bob
