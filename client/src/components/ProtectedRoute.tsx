import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/store/store';
import SignOut from './auth/SignOut';

const ProtectedRoute: React.FC = () => {
    const { authUser } = useSelector(selectAuthUser);

    if (!authUser) {
        return <Navigate to="/auth" />;
    }

    return <div><Outlet />
        <SignOut /></div>;
};

export default ProtectedRoute;
