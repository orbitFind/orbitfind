import SignIn from "@/components/auth/SignIn";
import SignUp from "@/components/auth/SignUp";
import { motion } from "framer-motion";
import { useState } from "react";

const AuthPage = () => {
    const [register, setRegister] = useState(false);
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">
        {register ? (
            <motion.div className="w-full max-w-md bg-white shadow-md rounded-lg p-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}>
                <SignUp />
                <p className="text-center text-gray-600 mt-6">
                    Already have an account?{' '}
                    <motion.button
                        onClick={() => setRegister(false)}
                        className="text-blue-500 hover:underline"
                        whileHover={{ scale: 1.1 }}
                    >
                        Sign In
                    </motion.button>
                </p>
            </motion.div>

        ) : (
            <motion.div
                className="w-full max-w-md bg-white shadow-md rounded-lg p-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <SignIn />
                <p className="text-center text-gray-600 mt-6">
                    Don&apos;t have an account?{' '}
                    <motion.button
                        onClick={() => setRegister(true)}
                        className="text-blue-500 hover:underline"
                        whileHover={{ scale: 1.1 }}
                    >
                        Sign Up
                    </motion.button>
                </p>
            </motion.div>
        )
        };
    </div>;


}

export default AuthPage;