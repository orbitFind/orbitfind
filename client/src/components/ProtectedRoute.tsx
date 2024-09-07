import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { setAuthUser } from '@/store/authSlice';
import { selectAuthUser, useAppDispatch } from '@/store/store';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useToast } from './ui/use-toast';

const ProtectedRoute: React.FC = () => {
    const { fetchStatus } = useSelector(selectAuthUser);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

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
                toast({
                    title: 'Error',
                    description: 'Something went wrong, please sign in again.',
                    variant: 'destructive'
                });
                navigate('/auth');
            }
        });
    }, [location.pathname]); // Include dispatch in the dependency array

    if (fetchStatus === "error") {
        return <Navigate to="/auth" />;
    }

    return (
        <div>
            <Outlet />
        </div>
    );
};

export default ProtectedRoute;
