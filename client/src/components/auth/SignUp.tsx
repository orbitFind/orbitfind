import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { motion } from 'framer-motion';
import { useAppDispatch } from '@/store/store';
import { setAuthUser } from '@/store/authSlice';
import { syncUsers } from '@/api/user';
import { useToast } from '../ui/use-toast';

const SignUp = () => {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
            return;
        }

        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;
            await updateProfile(user, { displayName });

            if (!user.email || !user.displayName || !user.uid) {
                throw new Error('Invalid user object');
            }

            const token = await user.getIdToken(true)

            dispatch(setAuthUser({
                authUser: {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                },
                token
            }));

            localStorage.setItem('authUser', JSON.stringify({ user, token }));

            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setDisplayName('');

            toast({ title: 'Sign Up', description: 'User signed up successfully', variant: 'default' });
            dispatch(syncUsers())
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
                Sign Up
            </motion.h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                {['Display Name', 'Email', 'Password', 'Confirm Password'].map((placeholder, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    >
                        <input
                            type={placeholder.includes('Password') ? 'password' : 'text'}
                            value={placeholder === 'Display Name' ? displayName : placeholder === 'Email' ? email : placeholder === 'Password' ? password : confirmPassword}
                            onChange={(e) => {
                                if (placeholder === 'Display Name') setDisplayName(e.target.value);
                                else if (placeholder === 'Email') setEmail(e.target.value);
                                else if (placeholder === 'Password') setPassword(e.target.value);
                                else if (placeholder === 'Confirm Password') setConfirmPassword(e.target.value);
                            }}
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
                    Sign Up
                </motion.button>

            </form>
        </>
    );
};

export default SignUp;
