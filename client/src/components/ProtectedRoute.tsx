import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { setAuthUser } from '@/store/authSlice';
import { selectAuthUser, selectUser, useAppDispatch } from '@/store/store';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUser } from '@/api/user';
import { useToast } from './ui/use-toast';

const ProtectedRoute: React.FC = () => {
    const { authUser } = useSelector(selectAuthUser);
    const userSlice = useSelector(selectUser);
    const [loading, setLoading] = useState(true); // Add loading state

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    if (!userSlice.user) {
                        dispatch(getUser());
                    }

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
                toast({
                    title: 'Error',
                    description: 'Something went wrong, please sign in again.',
                    variant: 'destructive'
                });
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
        </div>
    );
};

export default ProtectedRoute;
