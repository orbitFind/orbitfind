// src/components/auth/SignOut.tsx
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { useAppDispatch } from '@/store/store';
import { clearAuthUser } from '@/store/authSlice';

const useSignOut = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem("authUser");
      dispatch(clearAuthUser());
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return signOut;
};

export default useSignOut;
