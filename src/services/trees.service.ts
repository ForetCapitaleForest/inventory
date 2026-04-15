import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
  FirestoreError,
} from 'firebase/firestore';
import { db } from './firebase';
import { Tree } from '../types/tree.types';

const TREES_COLLECTION = 'trees';

class TreeServiceError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'TreeServiceError';
  }
}

export const treesService = {
  /**
   * Get all trees
   */
  async getAll(): Promise<Tree[]> {
    try {
      const q = query(
        collection(db, TREES_COLLECTION),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Tree[];
    } catch (error) {
      throw new TreeServiceError('Failed to fetch trees', error);
    }
  },

  /**
   * Get a single tree by ID
   */
  async getById(id: string): Promise<Tree | null> {
    try {
      const docRef = doc(db, TREES_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Tree;
      }
      return null;
    } catch (error) {
      throw new TreeServiceError(`Failed to fetch tree with id: ${id}`, error);
    }
  },

  /**
   * Get trees by status
   */
  async getByStatus(status: string): Promise<Tree[]> {
    try {
      const q = query(
        collection(db, TREES_COLLECTION),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Tree[];
    } catch (error) {
      throw new TreeServiceError(`Failed to fetch trees by status: ${status}`, error);
    }
  },

  /**
   * Get trees by health status
   */
  async getByHealthStatus(healthStatus: string): Promise<Tree[]> {
    try {
      const q = query(
        collection(db, TREES_COLLECTION),
        where('healthStatus', '==', healthStatus),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Tree[];
    } catch (error) {
      throw new TreeServiceError(`Failed to fetch trees by health status: ${healthStatus}`, error);
    }
  },

  /**
   * Create a new tree
   */
  async create(tree: Omit<Tree, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      console.log('TreeService.create called with:', tree);
      
      // Remove undefined values - Firestore doesn't accept them
      const cleanedTree = Object.entries(tree).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as any);
      
      console.log('Cleaned tree data (undefined removed):', cleanedTree);
      
      const docRef = await addDoc(collection(db, TREES_COLLECTION), {
        ...cleanedTree,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log('TreeService.create success, ID:', docRef.id);
      return docRef.id;
    } catch (error: any) {
      console.error('TreeService.create error:', error);
      console.error('Error code:', error?.code);
      console.error('Error message:', error?.message);
      throw new TreeServiceError(
        `Failed to create tree: ${error?.message || error?.code || 'Unknown error'}`,
        error
      );
    }
  },

  /**
   * Update an existing tree
   */
  async update(id: string, updates: Partial<Tree>): Promise<void> {
    try {
      // Remove undefined values - Firestore doesn't accept them
      const cleanedUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as any);
      
      const docRef = doc(db, TREES_COLLECTION, id);
      await updateDoc(docRef, {
        ...cleanedUpdates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      throw new TreeServiceError(`Failed to update tree with id: ${id}`, error);
    }
  },

  /**
   * Delete a tree
   */
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, TREES_COLLECTION, id));
    } catch (error) {
      throw new TreeServiceError(`Failed to delete tree with id: ${id}`, error);
    }
  },

  /**
   * Get trees by supplier
   */
  async getBySupplier(supplierId: string): Promise<Tree[]> {
    try {
      const q = query(
        collection(db, TREES_COLLECTION),
        where('supplierId', '==', supplierId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Tree[];
    } catch (error) {
      throw new TreeServiceError(`Failed to fetch trees by supplier: ${supplierId}`, error);
    }
  },

  /**
   * Get trees by nursery location
   */
  async getByNurseryLocation(locationId: string): Promise<Tree[]> {
    try {
      const q = query(
        collection(db, TREES_COLLECTION),
        where('nurseryLocationId', '==', locationId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Tree[];
    } catch (error) {
      throw new TreeServiceError(`Failed to fetch trees by nursery location: ${locationId}`, error);
    }
  },

  /**
   * Get trees by planting site
   */
  async getByPlantingSite(siteId: string): Promise<Tree[]> {
    try {
      const q = query(
        collection(db, TREES_COLLECTION),
        where('plantingSiteId', '==', siteId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Tree[];
    } catch (error) {
      throw new TreeServiceError(`Failed to fetch trees by planting site: ${siteId}`, error);
    }
  },
};

// Made with Bob
