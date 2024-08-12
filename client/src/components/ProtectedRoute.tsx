import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { setAuthUser } from '@/store/authSlice';
import SignOut from '@/components/auth/SignOut';
import { selectAuthUser, useAppDispatch } from '@/store/store';

const ProtectedRoute: React.FC = () => {
    const { authUser } = useSelector(selectAuthUser);
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const assignAuth = async () => {
            try {
                const storedAuthUser = localStorage.getItem('authUser');

                if (storedAuthUser) {
                    const { user, token } = JSON.parse(storedAuthUser);

                    // Restore the user and token to the Redux store
                    dispatch(setAuthUser({
                        authUser: {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName
                        }, token
                    }));
                }
            } catch (error) {
                console.error('Error restoring authentication data:', error);
            } finally {
                setLoading(false);
            }
        };

        assignAuth();


    }, []); // Include dispatch in the dependency array

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!authUser) {
        return <Navigate to="/auth" />;
    }

    return (
        <div>
            <Outlet />
            <SignOut />
        </div>
    );
};

export default ProtectedRoute;
