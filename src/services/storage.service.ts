
import { FirebaseStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

class StorageService {
  private storage: FirebaseStorage;

  constructor(storage: FirebaseStorage) {
    this.storage = storage;
  }

  async uploadFile(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }
}

export const storageService = new StorageService(storage);
