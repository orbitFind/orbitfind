import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthUser, useAppDispatch } from '@/store/store';
import SignOut from '@/components/auth/SignOut';
import { setAuthUser } from '@/store/authSlice';

const ProtectedRoute: React.FC = () => {
    const { authUser } = useSelector(selectAuthUser);
    const dispatch = useAppDispatch();
    const navigate = useNavigate()

    useEffect(() => {
        const storedAuthUser = localStorage.getItem('authUser');

        if (storedAuthUser) {
            const { user, token } = JSON.parse(storedAuthUser);
            // Restore the user and token to the Redux store
            dispatch(setAuthUser({ authUser: user, token }));
        }

        if (!authUser) {
            navigate("/auth")
        }
    }, [])



    return <div><Outlet />
        <SignOut /></div>;
};

export default ProtectedRoute;
