import { Box, Typography, Paper, Alert, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export const LocationList = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Locations</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          disabled
        >
          Add Location
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Alert severity="info">
          <Typography variant="h6" gutterBottom>
            Coming Soon: Location Management
          </Typography>
          <Typography variant="body2">
            This feature will allow you to:
          </Typography>
          <ul>
            <li>Manage nursery locations and sections</li>
            <li>Track planting sites with GPS coordinates</li>
            <li>Monitor location capacity and occupancy</li>
            <li>View trees by location</li>
            <li>Map visualization of tree locations</li>
          </ul>
          <Typography variant="body2" sx={{ mt: 2 }}>
            For now, you can track basic location information in the tree notes field.
          </Typography>
        </Alert>
      </Paper>
    </Box>
  );
};

// Made with Bob
