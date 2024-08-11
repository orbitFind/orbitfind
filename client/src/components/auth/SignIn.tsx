import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from "framer-motion"
import { authSlice } from '@/store/authSlice';
import { useAppDispatch } from '@/store/store';

const SignIn = () => {
    const navigate = useNavigate();
    const { setAuthUser } = authSlice.actions;
    const dispatch = useAppDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Sign in the user
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user.email || !user.displayName || !user.uid) {
                console.error('Invalid user object');
                throw new Error('Invalid user object');
            }

            // Set the auth user in the store
            dispatch(setAuthUser({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
            }));

            // Clear the form
            setSuccess(true);
            setError(null);

            // Redirect to the events page
            setTimeout(() => {
                navigate('/events');
            }, 3000);

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
            setSuccess(false);
        }
    };

    return (
        <>
            <motion.div
                className="w-full max-w-md bg-white shadow-md rounded-lg p-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.h2
                    className="text-3xl font-semibold text-center mb-6 text-black"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    Sign In
                </motion.h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            style={{ color: 'black' }}
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            style={{ color: 'black' }}
                        />
                    </motion.div>
                    <motion.button
                        type="submit"
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Sign In
                    </motion.button>
                    {error && (
                        <motion.p
                            className="text-red-500 text-center mt-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            {error}
                        </motion.p>
                    )}
                    {success && (
                        <motion.p
                            className="text-green-500 text-center mt-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            User signed in successfully!
                        </motion.p>
                    )}
                </form>
            </motion.div>
        </>
    );
};

export default SignIn;
