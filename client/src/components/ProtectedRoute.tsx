import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { setAuthUser } from '@/store/authSlice';
import SignOut from '@/components/auth/SignOut';
import { selectAuthUser, useAppDispatch } from '@/store/store';
import { auth } from '@/lib/firebase';

const ProtectedRoute: React.FC = () => {
    const { authUser } = useSelector(selectAuthUser);
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true); // Add loading state
    const navigate = useNavigate();

    useEffect(() => {
        const assignAuth = async () => {
            try {
                if (!auth) {
                    localStorage.removeItem('authUser');
                    return;
                }

                const storedAuthUser = localStorage.getItem('authUser');
                if (storedAuthUser) {
                    const { user, token, refreshToken } = await JSON.parse(storedAuthUser);

                    if (!user || !token || !refreshToken) {
                        navigate('/auth');
                        console.error('Invalid user object: ' + storedAuthUser);
                        throw new Error('Invalid user object');
                    }

                    // Restore the user and token to the Redux store
                    dispatch(setAuthUser({
                        authUser: {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName
                        }, token, refreshToken
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
