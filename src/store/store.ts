// src/store/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import storesReducer from './storesSlice';
import authReducer from './authSlice';
import { useDispatch } from 'react-redux';

// Define persist config for the stores slice
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['stores'], // only persist the stores slice
};

const rootReducer = combineReducers({
    stores: storesReducer,
    auth: authReducer,
    // add other reducers as needed
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'], // ignore persist actions
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
