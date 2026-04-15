import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Chip,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { treesService } from '../../services/trees.service';
import { Tree, TreeStatus, HealthStatus } from '../../types/tree.types';
import { useNavigate } from 'react-router-dom';
import { statusColors, healthColors } from '../../constants/tree-colors';

export const TreeList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TreeStatus | 'all'>('all');
  const [healthFilter, setHealthFilter] = useState<HealthStatus | 'all'>('all');
  const [deleteError, setDeleteError] = useState<string>('');

  const { data: trees, isLoading, error } = useQuery({
    queryKey: ['trees'],
    queryFn: () => treesService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => treesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trees'] });
    },
    onError: (error: any) => {
      setDeleteError(error?.message || 'Failed to delete tree. Please try again.');
    },
  });

  const handleDelete = async (id: string, species: string) => {
    if (window.confirm(`Are you sure you want to delete ${species}?`)) {
      setDeleteError('');
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        // Error is handled by onError callback
      }
    }
  };

  const filteredTrees = useMemo(() => {
    return trees?.filter((tree) => {
      const matchesSearch =
        tree.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tree.commonName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        tree.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || tree.status === statusFilter;
      const matchesHealth = healthFilter === 'all' || tree.healthStatus === healthFilter;

      return matchesSearch && matchesStatus && matchesHealth;
    });
  }, [trees, searchTerm, statusFilter, healthFilter]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load trees. Please try again later.
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Trees</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/trees/new')}
        >
          Add Tree
        </Button>
      </Box>

      <Box mb={3} display="flex" gap={2} flexWrap="wrap">
        <TextField
          placeholder="Search trees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1, minWidth: 250 }}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value as TreeStatus | 'all')}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="ordered">Ordered</MenuItem>
            <MenuItem value="in_transit">In Transit</MenuItem>
            <MenuItem value="in_nursery">In Nursery</MenuItem>
            <MenuItem value="planted">Planted</MenuItem>
            <MenuItem value="deceased">Deceased</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Health</InputLabel>
          <Select
            value={healthFilter}
            label="Health"
            onChange={(e) => setHealthFilter(e.target.value as HealthStatus | 'all')}
          >
            <MenuItem value="all">All Health</MenuItem>
            <MenuItem value="excellent">Excellent</MenuItem>
            <MenuItem value="good">Good</MenuItem>
            <MenuItem value="fair">Fair</MenuItem>
            <MenuItem value="poor">Poor</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredTrees && filteredTrees.length === 0 ? (
        <Alert severity="info">
          No trees found. {trees && trees.length > 0 ? 'Try adjusting your filters.' : 'Click "Add Tree" to get started.'}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredTrees?.map((tree) => (
            <Grid item xs={12} sm={6} md={4} key={tree.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                    <Typography variant="h6" component="div">
                      {tree.species}
                    </Typography>
                    <Box display="flex" gap={0.5}>
                      <Chip
                        label={tree.status.replace('_', ' ')}
                        color={statusColors[tree.status]}
                        size="small"
                      />
                    </Box>
                  </Box>

                  {tree.commonName && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {tree.commonName}
                    </Typography>
                  )}

                  <Box mt={2} mb={1}>
                    <Chip
                      label={`Health: ${tree.healthStatus}`}
                      color={healthColors[tree.healthStatus]}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" mt={2}>
                    <strong>Supplier:</strong> {tree.supplierName}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    <strong>Provenance:</strong> {tree.provenance}
                  </Typography>

                  {tree.initialHeight && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Height:</strong> {tree.initialHeight}cm
                    </Typography>
                  )}

                  {tree.notes && (
                    <Typography variant="body2" color="text.secondary" mt={1} noWrap>
                      {tree.notes}
                    </Typography>
                  )}
                </CardContent>

                <CardActions>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/trees/${tree.id}`)}
                    title="View Details"
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/trees/${tree.id}/edit`)}
                    title="Edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(tree.id, tree.species)}
                    title="Delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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
