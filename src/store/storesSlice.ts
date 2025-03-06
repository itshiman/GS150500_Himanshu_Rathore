import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export interface Store {
    id: string;
    name: string;
    city: string;
    state: string;
}
interface StoresState {
    stores: Store[];
}
const initialState: StoresState = {
    stores: [],
};
const storesSlice = createSlice({
    name: 'stores',
    initialState,
    reducers: {
        addStore: (state, action: PayloadAction<Store>) => {
            state.stores.push(action.payload);
        },
        removeStore: (state, action: PayloadAction<string>) => {
            state.stores = state.stores.filter((store) => store.id !== action.payload);
        },
        updateStore: (state, action: PayloadAction<Store>) => {
            const index = state.stores.findIndex((store) => store.id === action.payload.id);
            if (index !== -1) {
                state.stores[index] = action.payload;
            }
        },
        reorderStores: (state, action: PayloadAction<{ startIndex: number; endIndex: number }>) => {
            const { startIndex, endIndex } = action.payload;
            const [removed] = state.stores.splice(startIndex, 1);
            state.stores.splice(endIndex, 0, removed);
        },
        setStores: (state, action: PayloadAction<Store[]>) => {
            state.stores = action.payload;
        },
    },
});
export const { addStore, removeStore, updateStore, reorderStores, setStores } = storesSlice.actions;
export default storesSlice.reducer;
