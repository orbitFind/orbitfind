import { auth } from "@/lib/firebase";
import { setAuthUser } from "@/store/authSlice";
import { selectAuthUser, useAppDispatch } from "@/store/store";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation, Navigate, Outlet } from "react-router-dom";
import { useToast } from "./ui/use-toast";

const ProtectedRoute: React.FC = () => {
    const { fetchStatus, authUser } = useSelector(selectAuthUser);
    const [loading, setLoading] = useState(true);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    const token = await user.getIdToken(true);

                    localStorage.setItem('authUser', JSON.stringify({
                        user: {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName
                        },
                        token
                    }));

                    dispatch(setAuthUser({
                        authUser: {
                            uid: user.uid,
                            email: user.email!,
                            displayName: user.displayName!
                        },
                        token
                    }));
                } else {
                    localStorage.removeItem('authUser');
                    navigate('/auth');
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

        return () => unsubscribe();
    }, [dispatch, navigate, toast, location.pathname]);

    // Block route rendering while loading auth state
    if (loading || fetchStatus === "loading") {
        return <div>Loading...</div>;
    }

    if (fetchStatus === "error" || !authUser) {
        return <Navigate to="/auth" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;