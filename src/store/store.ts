import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import storesReducer from './storesSlice';
import authReducer from './authSlice';
import { useDispatch } from 'react-redux';
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['stores'],
};
const rootReducer = combineReducers({
    stores: storesReducer,
    auth: authReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
                ignoredPaths: ['auth.user'],
                ignoredActionPaths: ['payload'],
            },
        }),
});
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
