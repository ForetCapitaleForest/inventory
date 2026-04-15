import { TreeStatus, HealthStatus } from '../types/tree.types';

export const statusColors: Record<TreeStatus, 'default' | 'primary' | 'secondary' | 'success' | 'error'> = {
  ordered: 'default',
  in_transit: 'primary',
  in_nursery: 'secondary',
  planted: 'success',
  deceased: 'error',
};

export const healthColors: Record<HealthStatus, 'success' | 'info' | 'warning' | 'error'> = {
  excellent: 'success',
  good: 'success',
  fair: 'warning',
  poor: 'error',
  critical: 'error',
};

// Made with Bob