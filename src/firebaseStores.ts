
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Store } from './store/storesSlice';
const storesCollection = collection(db, 'stores');
export const addStoreToFirebase = async (store: Omit<Store, 'id'>): Promise<void> => {
    await addDoc(storesCollection, store);
};
export const updateStoreInFirebase = async (store: Store): Promise<void> => {
    const storeDoc = doc(db, 'stores', store.id);
    await updateDoc(storeDoc, { name: store.name });
};
export const removeStoreFromFirebase = async (id: string): Promise<void> => {
    const storeDoc = doc(db, 'stores', id);
    await deleteDoc(storeDoc);
};
