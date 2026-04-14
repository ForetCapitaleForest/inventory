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
} from 'firebase/firestore';
import { db } from './firebase';
import { Tree } from '../types/tree.types';

const TREES_COLLECTION = 'trees';

export const treesService = {
  /**
   * Get all trees
   */
  async getAll(): Promise<Tree[]> {
    const q = query(
      collection(db, TREES_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Tree[];
  },

  /**
   * Get a single tree by ID
   */
  async getById(id: string): Promise<Tree | null> {
    const docRef = doc(db, TREES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Tree;
    }
    return null;
  },

  /**
   * Get trees by status
   */
  async getByStatus(status: string): Promise<Tree[]> {
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
  },

  /**
   * Get trees by health status
   */
  async getByHealthStatus(healthStatus: string): Promise<Tree[]> {
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
  },

  /**
   * Create a new tree
   */
  async create(tree: Omit<Tree, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, TREES_COLLECTION), {
      ...tree,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  /**
   * Update an existing tree
   */
  async update(id: string, updates: Partial<Tree>): Promise<void> {
    const docRef = doc(db, TREES_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  },

  /**
   * Delete a tree
   */
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, TREES_COLLECTION, id));
  },

  /**
   * Get trees by supplier
   */
  async getBySupplier(supplierId: string): Promise<Tree[]> {
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
  },

  /**
   * Get trees by nursery location
   */
  async getByNurseryLocation(locationId: string): Promise<Tree[]> {
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
  },

  /**
   * Get trees by planting site
   */
  async getByPlantingSite(siteId: string): Promise<Tree[]> {
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
  },
};

// Made with Bob
