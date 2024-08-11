import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/store/store';

const ProtectedRoute: React.FC = () => {
    const authUser = useSelector(selectAuthUser);

    if (!authUser) {
        return <Navigate to="/signin" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
