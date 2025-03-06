import React, { useEffect } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store/store';
import { signIn, signOutUser, setUser } from '../store/authSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const AuthButton: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user, loading, error } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            dispatch(setUser(user));
        });
        return unsubscribe;
    }, [dispatch]);

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
