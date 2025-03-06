// src/components/ProtectedRoute.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Container, Typography } from '@mui/material';
import AuthButton from './AuthButton';

interface ProtectedRouteProps {
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const user = useSelector((state: RootState) => state.auth.user);

    if (!user) {
        return (
            <Container sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Please sign in to access this page.
                </Typography>
                {/* Renders the sign-in button */}
                <AuthButton />
            </Container>
        );
    }

    return children;
};

export default ProtectedRoute;
