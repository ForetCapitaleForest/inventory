import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { treesService } from '../../services/trees.service';
import { Tree, TreeStatus, HealthStatus } from '../../types/tree.types';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

interface TreeFormProps {
  tree?: Tree;
  mode: 'create' | 'edit';
}

export const TreeForm = ({ tree, mode }: TreeFormProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    species: tree?.species || '',
    commonName: tree?.commonName || '',
    provenance: tree?.provenance || '',
    status: tree?.status || 'ordered' as TreeStatus,
    supplierId: tree?.supplierId || '',
    supplierName: tree?.supplierName || '',
    purchaseOrderNumber: tree?.purchaseOrderNumber || '',
    cost: tree?.cost?.toString() || '',
    orderDate: tree?.orderDate ? new Date(tree.orderDate.toMillis()).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    arrivalDate: tree?.arrivalDate ? new Date(tree.arrivalDate.toMillis()).toISOString().split('T')[0] : '',
    initialHeight: tree?.initialHeight?.toString() || '',
    initialDiameter: tree?.initialDiameter?.toString() || '',
    age: tree?.age?.toString() || '',
    nurseryLocationId: tree?.nurseryLocationId || '',
    plantingSiteId: tree?.plantingSiteId || '',
    healthStatus: tree?.healthStatus || 'good' as HealthStatus,
    soilConditions: tree?.soilConditions || '',
    notes: tree?.notes || '',
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Tree, 'id' | 'createdAt' | 'updatedAt'>) => treesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trees'] });
      navigate('/trees');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Tree> }) => treesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trees'] });
      navigate('/trees');
    },
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.species || !formData.provenance || !formData.supplierName) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      const treeData: any = {
        species: formData.species,
        commonName: formData.commonName || undefined,
        provenance: formData.provenance,
        status: formData.status,
        supplierId: formData.supplierId || 'default',
        supplierName: formData.supplierName,
        purchaseOrderNumber: formData.purchaseOrderNumber || undefined,
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        orderDate: Timestamp.fromDate(new Date(formData.orderDate)),
        arrivalDate: formData.arrivalDate ? Timestamp.fromDate(new Date(formData.arrivalDate)) : undefined,
        initialHeight: formData.initialHeight ? parseFloat(formData.initialHeight) : undefined,
        initialDiameter: formData.initialDiameter ? parseFloat(formData.initialDiameter) : undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        nurseryLocationId: formData.nurseryLocationId || undefined,
        plantingSiteId: formData.plantingSiteId || undefined,
        healthStatus: formData.healthStatus,
        soilConditions: formData.soilConditions || undefined,
        photoUrls: tree?.photoUrls || [],
        notes: formData.notes,
        createdBy: user?.uid || 'unknown',
      };

      if (mode === 'create') {
        await createMutation.mutateAsync(treeData);
      } else if (tree) {
        await updateMutation.mutateAsync({ id: tree.id, data: treeData });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save tree');
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          {mode === 'create' ? 'Add New Tree' : 'Edit Tree'}
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Species"
                value={formData.species}
                onChange={(e) => handleChange('species', e.target.value)}
                helperText="Scientific name (e.g., Acer saccharum)"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Common Name"
                value={formData.commonName}
                onChange={(e) => handleChange('commonName', e.target.value)}
                helperText="e.g., Sugar Maple"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Provenance"
                value={formData.provenance}
                onChange={(e) => handleChange('provenance', e.target.value)}
                helperText="Origin location"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <MenuItem value="ordered">Ordered</MenuItem>
                <MenuItem value="in_transit">In Transit</MenuItem>
                <MenuItem value="in_nursery">In Nursery</MenuItem>
                <MenuItem value="planted">Planted</MenuItem>
                <MenuItem value="deceased">Deceased</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Supplier Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Supplier Name"
                value={formData.supplierName}
                onChange={(e) => handleChange('supplierName', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Purchase Order Number"
                value={formData.purchaseOrderNumber}
                onChange={(e) => handleChange('purchaseOrderNumber', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Cost"
                value={formData.cost}
                onChange={(e) => handleChange('cost', e.target.value)}
                InputProps={{ startAdornment: '$' }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Order Date"
                value={formData.orderDate}
                onChange={(e) => handleChange('orderDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Arrival Date"
                value={formData.arrivalDate}
                onChange={(e) => handleChange('arrivalDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Physical Attributes
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Initial Height (cm)"
                value={formData.initialHeight}
                onChange={(e) => handleChange('initialHeight', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Initial Diameter (cm)"
                value={formData.initialDiameter}
                onChange={(e) => handleChange('initialDiameter', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Age (years)"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Health & Condition
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Health Status"
                value={formData.healthStatus}
                onChange={(e) => handleChange('healthStatus', e.target.value)}
              >
                <MenuItem value="excellent">Excellent</MenuItem>
                <MenuItem value="good">Good</MenuItem>
                <MenuItem value="fair">Fair</MenuItem>
                <MenuItem value="poor">Poor</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Soil Conditions"
                value={formData.soilConditions}
                onChange={(e) => handleChange('soilConditions', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                helperText="Any additional information about this tree"
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => navigate('/trees')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : mode === 'create' ? 'Add Tree' : 'Save Changes'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

// Made with Bob
