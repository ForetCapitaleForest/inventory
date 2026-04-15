import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Snackbar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { treesService } from '../../services/trees.service';
import { statusColors, healthColors } from '../../constants/tree-colors';
import { useState } from 'react';

export const TreeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteError, setDeleteError] = useState<string>('');

  const { data: tree, isLoading, error } = useQuery({
    queryKey: ['tree', id],
    queryFn: () => treesService.getById(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: (treeId: string) => treesService.delete(treeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trees'] });
      navigate('/trees');
    },
    onError: (error: any) => {
      setDeleteError(error?.message || 'Failed to delete tree. Please try again.');
    },
  });

  const handleDelete = async () => {
    if (tree && window.confirm(`Are you sure you want to delete ${tree.species}?`)) {
      setDeleteError('');
      try {
        await deleteMutation.mutateAsync(tree.id);
      } catch (error) {
        // Error is handled by onError callback
      }
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !tree) {
    return (
      <Box>
        <Alert severity="error">
          Failed to load tree details. The tree may not exist.
        </Alert>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/trees')}
          sx={{ mt: 2 }}
        >
          Back to Trees
        </Button>
      </Box>
    );
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp || typeof timestamp.toMillis !== 'function') return 'N/A';
    try {
      return new Date(timestamp.toMillis()).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/trees')}
          >
            Back
          </Button>
          <Typography variant="h4">{tree.species}</Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/trees/${tree.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" gap={1} mb={2}>
              <Chip
                label={tree.status.replace('_', ' ')}
                color={statusColors[tree.status]}
              />
              <Chip
                label={`Health: ${tree.healthStatus}`}
                color={healthColors[tree.healthStatus]}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Species
            </Typography>
            <Typography variant="body1" gutterBottom>
              {tree.species}
            </Typography>
          </Grid>

          {tree.commonName && (
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Common Name
              </Typography>
              <Typography variant="body1" gutterBottom>
                {tree.commonName}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Provenance
            </Typography>
            <Typography variant="body1" gutterBottom>
              {tree.provenance}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Supplier Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Supplier Name
            </Typography>
            <Typography variant="body1" gutterBottom>
              {tree.supplierName}
            </Typography>
          </Grid>

          {tree.purchaseOrderNumber && (
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Purchase Order Number
              </Typography>
              <Typography variant="body1" gutterBottom>
                {tree.purchaseOrderNumber}
              </Typography>
            </Grid>
          )}

          {tree.cost && (
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Cost
              </Typography>
              <Typography variant="body1" gutterBottom>
                ${tree.cost.toFixed(2)}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Order Date
            </Typography>
            <Typography variant="body1" gutterBottom>
              {formatDate(tree.orderDate)}
            </Typography>
          </Grid>

          {tree.arrivalDate && (
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Arrival Date
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formatDate(tree.arrivalDate)}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Physical Attributes
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          {tree.initialHeight && (
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Initial Height
              </Typography>
              <Typography variant="body1" gutterBottom>
                {tree.initialHeight} cm
              </Typography>
            </Grid>
          )}

          {tree.initialDiameter && (
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Initial Diameter
              </Typography>
              <Typography variant="body1" gutterBottom>
                {tree.initialDiameter} cm
              </Typography>
            </Grid>
          )}

          {tree.age && (
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Age
              </Typography>
              <Typography variant="body1" gutterBottom>
                {tree.age} years
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Health & Condition
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Health Status
            </Typography>
            <Typography variant="body1" gutterBottom>
              {tree.healthStatus.charAt(0).toUpperCase() + tree.healthStatus.slice(1)}
            </Typography>
          </Grid>

          {tree.soilConditions && (
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Soil Conditions
              </Typography>
              <Typography variant="body1" gutterBottom>
                {tree.soilConditions}
              </Typography>
            </Grid>
          )}

          {tree.notes && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Notes
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {tree.notes}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Metadata
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Created
            </Typography>
            <Typography variant="body1" gutterBottom>
              {formatDate(tree.createdAt)}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Last Updated
            </Typography>
            <Typography variant="body1" gutterBottom>
              {formatDate(tree.updatedAt)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={!!deleteError}
        autoHideDuration={6000}
        onClose={() => setDeleteError('')}
        message={deleteError}
      />
    </Box>
  );
};

// Made with Bob
