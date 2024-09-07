import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from "framer-motion"
import { authSlice } from '@/store/authSlice';
import { useAppDispatch } from '@/store/store';
import { useToast } from '../ui/use-toast';

const SignIn = () => {
    const navigate = useNavigate();
    const { setAuthUser } = authSlice.actions;

    const dispatch = useAppDispatch();
    const { toast } = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user.email || !user.displayName || !user.uid) {
                console.error('Invalid user object');
                throw new Error('Invalid user object');
            }

            const token = await user.getIdToken();
            const refreshToken = await user.getIdToken(true);

            dispatch(setAuthUser({
                authUser: {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                },
                token: token,
                refreshToken: refreshToken
            }));

            localStorage.setItem('authUser', JSON.stringify({ user, token, refreshToken }));

            toast({ title: 'Sign In', description: 'User signed in successfully', variant: 'default' });
            navigate('/events');

        } catch (error) {
            if (error instanceof Error) {
                toast({ title: 'Error', description: error.message, variant: 'destructive' });
            } else {
                toast({ title: 'Error', description: 'An unknown error has occurred', variant: 'destructive' });
            }
        }
    };

    return (
        <>
            <motion.h2
                className="text-3xl font-semibold text-center mb-6 text-[#E5E7EB]"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                Sign In
            </motion.h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                {['Email', 'Password'].map((placeholder, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    >
                        <input
                            type={placeholder === 'Password' ? 'password' : 'email'}
                            value={placeholder === 'Email' ? email : password}
                            onChange={(e) => placeholder === 'Email' ? setEmail(e.target.value) : setPassword(e.target.value)}
                            placeholder={placeholder}
                            required
                            className="w-full border border-[#535C91] bg-[#1B1A55] text-[#E5E7EB] px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] transition-all duration-300 ease-in-out hover:shadow-lg"
                        />
                    </motion.div>
                ))}
                <motion.button
                    type="submit"
                    className="w-full bg-[#4F8CFF] text-[#E5E7EB] px-4 py-2 rounded-md hover:bg-[#4F8CFF] transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Sign In
                </motion.button>
            </form>
        </>
    );
};

export default SignIn;