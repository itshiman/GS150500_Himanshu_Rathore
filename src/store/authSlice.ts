import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../firebase';
interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}
const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

export const signIn = createAsyncThunk('auth/signIn', async (_, { rejectWithValue }) => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

export const signOutUser = createAsyncThunk('auth/signOutUser', async (_, { rejectWithValue }) => {
    try {
        await signOut(auth);
        return null;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signIn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signIn.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(signIn.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(signOutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signOutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
            })
            .addCase(signOutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});
export const { setUser } = authSlice.actions;
export default authSlice.reducer;
