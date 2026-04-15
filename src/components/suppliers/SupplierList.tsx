import { Box, Typography, Paper, Alert, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export const SupplierList = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Suppliers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          disabled
        >
          Add Supplier
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Alert severity="info">
          <Typography variant="h6" gutterBottom>
            Coming Soon: Supplier Management
          </Typography>
          <Typography variant="body2">
            This feature will allow you to:
          </Typography>
          <ul>
            <li>Add and manage tree suppliers</li>
            <li>Track supplier contact information</li>
            <li>View purchase history by supplier</li>
            <li>Manage supplier relationships</li>
          </ul>
          <Typography variant="body2" sx={{ mt: 2 }}>
            For now, you can enter supplier names directly when adding trees.
          </Typography>
        </Alert>
      </Paper>
    </Box>
  );
};

// Made with Bob
