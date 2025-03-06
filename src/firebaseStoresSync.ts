
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { store } from './store/store';
import { setStores } from './store/storesSlice';
import { Store } from './store/storesSlice';
export const subscribeToStores = () => {
    const storesCollection = collection(db, 'stores');
    
    return onSnapshot(storesCollection, (snapshot) => {
        const storesData: Store[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Store[];
        store.dispatch(setStores(storesData));
    });
};
