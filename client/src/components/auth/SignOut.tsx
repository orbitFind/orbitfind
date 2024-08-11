import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const SignOut = () => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut(auth).then(() => {
                navigate('/');
            });
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSignOut}
        >
            Sign Out
        </button>
    );
};

export default SignOut;