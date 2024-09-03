import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { setAuthUser } from '@/store/authSlice';
import SignOut from '@/components/auth/SignOut';
import { selectAuthUser, useAppDispatch } from '@/store/store';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const ProtectedRoute: React.FC = () => {
    const { authUser } = useSelector(selectAuthUser);
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true); // Add loading state
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    const token = await user.getIdToken();
                    const refreshToken = await user.getIdToken(true);

                    localStorage.setItem('authUser', JSON.stringify({
                        user: {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName
                        },
                        token,
                        refreshToken
                    }));

                    dispatch(setAuthUser({
                        authUser: {
                            uid: user.uid,
                            email: user.email!,
                            displayName: user.displayName!
                        }, token, refreshToken
                    }));
                }
            } catch (error) {
                console.error('Error fetching user: ', error);
                localStorage.removeItem('authUser');
                navigate('/auth');
            } finally {
                setLoading(false);
            }
        });
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
