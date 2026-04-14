import { Timestamp } from 'firebase/firestore';

export type TreeStatus = 'ordered' | 'in_transit' | 'in_nursery' | 'planted' | 'deceased';
export type HealthStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
export type UserRole = 'admin' | 'editor' | 'viewer';

export interface Tree {
  id: string;
  
  // Basic Information
  species: string;
  commonName?: string;
  provenance: string;
  
  // Workflow Status
  status: TreeStatus;
  
  // Supplier Information
  supplierId: string;
  supplierName: string;
  purchaseOrderNumber?: string;
  cost?: number;
  orderDate: Timestamp;
  arrivalDate?: Timestamp;
  
  // Physical Attributes
  initialHeight?: number;
  initialDiameter?: number;
  age?: number;
  
  // Location Tracking
  nurseryLocationId?: string;
  plantingSiteId?: string;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
  };
  
  // Health & Condition
  healthStatus: HealthStatus;
  soilConditions?: string;
  
  // Photos
  photoUrls: string[];
  
  // Notes & History
  notes: string;
  
  // Metadata
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface GrowthMeasurement {
  id: string;
  treeId: string;
  date: Timestamp;
  height: number;
  diameter: number;
  canopySpread?: number;
  notes?: string;
  measuredBy: string;
}

export type MaintenanceType = 'watering' | 'fertilizing' | 'pruning' | 'treatment' | 'inspection' | 'other';

export interface MaintenanceRecord {
  id: string;
  treeId: string;
  date: Timestamp;
  type: MaintenanceType;
  description: string;
  performedBy: string;
  nextScheduledDate?: Timestamp;
}

export type DiseaseSeverity = 'mild' | 'moderate' | 'severe';
export type DiseaseStatus = 'active' | 'treated' | 'resolved';

export interface DiseaseRecord {
  id: string;
  treeId: string;
  detectedDate: Timestamp;
  diseaseName: string;
  severity: DiseaseSeverity;
  symptoms: string;
  treatment?: string;
  resolvedDate?: Timestamp;
  status: DiseaseStatus;
  photos: string[];
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  active: boolean;
}

export interface NurseryLocation {
  id: string;
  name: string;
  section?: string;
  capacity: number;
  currentOccupancy: number;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
  };
  notes?: string;
}

export type SunExposure = 'full_sun' | 'partial_shade' | 'full_shade';

export interface PlantingSite {
  id: string;
  name: string;
  address?: string;
  gpsCoordinates: {
    latitude: number;
    longitude: number;
  };
  soilType?: string;
  sunExposure?: SunExposure;
  notes?: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: Timestamp;
  lastLogin: Timestamp;
}

// Made with Bob
