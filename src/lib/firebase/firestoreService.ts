import {
  db as firestoreDb,
  auth as firebaseAuth,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  orderBy
} from '../firebase/config';
import { Store, User } from '../../types';

export class FirestoreSyncService {
  /**
   * Sync user stores to Firestore for the authenticated user
   */
  static async saveUserStores(userId: string, stores: Store[]): Promise<void> {
    try {
      for (const store of stores) {
        const storeRef = doc(firestoreDb, 'users', userId, 'stores', store.id);
        await setDoc(storeRef, {
          id: store.id,
          userId,
          name: store.name,
          platform: store.platform,
          currency: store.currency,
          url: store.url || '',
          status: store.status || 'connected',
          lastSyncedAt: store.lastSyncedAt || new Date().toISOString(),
          productCount: store.productCount || 0,
          orderCount: store.orderCount || 0,
        }, { merge: true });
      }
    } catch (err) {
      console.warn('[Firestore] Error saving user stores:', err);
    }
  }

  /**
   * Log user activity / audit entry to Firestore
   */
  static async logActivity(userId: string, action: string, details: string): Promise<void> {
    try {
      const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const logRef = doc(firestoreDb, 'users', userId, 'activity_logs', logId);
      await setDoc(logRef, {
        id: logId,
        userId,
        action,
        details,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('[Firestore] Error logging activity:', err);
    }
  }

  /**
   * Update user profile data directly in Firestore
   */
  static async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(firestoreDb, 'users', userId);
      await setDoc(userRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('[Firestore] Error updating user profile:', err);
    }
  }
}
