import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, CircularProgress, Alert } from '@mui/material';
import { treesService } from '../../services/trees.service';
import { TreeForm } from './TreeForm';

export const EditTree = () => {
  const { id } = useParams<{ id: string }>();

  const { data: tree, isLoading, error } = useQuery({
    queryKey: ['tree', id],
    queryFn: () => treesService.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !tree) {
    return (
      <Alert severity="error">
        Failed to load tree. The tree may not exist.
      </Alert>
    );
  }

  return <TreeForm tree={tree} mode="edit" />;
};

// Made with Bob
