
import { 
  Firestore, 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  DocumentData, 
  QuerySnapshot, 
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

class DbService {
  private db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  async getCollection(collectionName: string): Promise<QuerySnapshot<DocumentData>> {
    return await getDocs(collection(this.db, collectionName));
  }

  async getDocument(collectionName: string, docId: string): Promise<DocumentSnapshot<DocumentData>> {
    const docRef = doc(this.db, collectionName, docId);
    return await getDoc(docRef);
  }

  async isUserAdmin(userId: string): Promise<boolean> {
    try {
      const docSnap = await this.getDocument('user_roles', userId);
      if (docSnap.exists() && docSnap.data().role === 'admin') {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  }
}

export const dbService = new DbService(db);
