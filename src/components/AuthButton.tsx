// src/components/AuthButton.tsx
import React, { useEffect, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { setUser, signIn, signOutUser } from '../store/authSlice';
import { RootState, useAppDispatch } from '../store/store';

const AuthButton: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user, loading, error } = useSelector((state: RootState) => state.auth);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            dispatch(setUser(user));
            // After the first call, mark initialization as complete
            setInitializing(false);
        });
        return unsubscribe;
    }, [dispatch]);

    // While initializing, show a spinner (or nothing) to avoid flicker
    if (initializing) {
        return <CircularProgress color="inherit" size={20} />;
    }

    const handleAuthAction = () => {
        if (user) {
            dispatch(signOutUser());
        } else {
            dispatch(signIn());
        }
    };

    return (
        <div>
            <Button color="inherit" onClick={handleAuthAction} disabled={loading}>
                {loading ? (
                    <CircularProgress color="inherit" size={20} />
                ) : user ? (
                    'Sign Out'
                ) : (
                    'Sign In'
                )}
            </Button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    );
};

export default AuthButton;
