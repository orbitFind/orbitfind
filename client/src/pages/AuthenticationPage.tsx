import SignIn from "@/components/auth/SignIn";
import SignUp from "@/components/auth/SignUp";
import { motion } from "framer-motion";
import { useState } from "react";

const AuthPage = () => {
    const [register, setRegister] = useState(false);
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#070F2B] to-[#1B1A55]">
            {register ? (
                <motion.div
                    className="w-full max-w-md bg-[#1B1A55] bg-opacity-70 backdrop-blur-lg p-10 rounded-lg shadow-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <SignUp />
                    <p className="text-center text-[#E5E7EB] mt-6">
                        Already have an account?{' '}
                        <span
                            onClick={() => setRegister(false)}
                            className="text-[#4F8CFF] hover:underline transition-colors duration-300 cursor-pointer"
                        >
                            Sign In
                        </span>
                    </p>
                </motion.div>
            ) : (
                <motion.div
                    className="w-full max-w-md bg-[#1B1A55] bg-opacity-70 backdrop-blur-lg p-10 rounded-lg shadow-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <SignIn />
                    <p className="text-center text-[#E5E7EB] mt-6">
                        Don&apos;t have an account?{' '}
                        <span
                            onClick={() => setRegister(true)}
                            className="text-[#4F8CFF] hover:underline transition-colors duration-300 cursor-pointer"
                        >
                            Sign Up
                        </span>
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default AuthPage;