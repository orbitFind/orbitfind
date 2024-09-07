import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Event, User } from '@/constants/interfaces';
import { updateEvent } from '@/api/events';
import { useAppDispatch } from '@/store/store';
import { useToast } from '../ui/use-toast';

interface SignInUsersProps {
    event: Event;
    fetchStatus: "loading" | "success" | "error" | null;
}

const SignInUsers: React.FC<SignInUsersProps> = ({ event, fetchStatus }) => {
    const [curEvent, setCurEvent] = useState(event);
    const users = curEvent.signed_up_users;

    const dispatch = useAppDispatch();
    const { toast } = useToast();

    const handleSignInClick = (user: User) => {

        if (curEvent.signed_up_users.includes(user)) {
            try {
                dispatch(
                    updateEvent({
                        ...curEvent,
                        completed_users: curEvent.completed_users ? [...curEvent.completed_users, user] : [user],
                    })
                );
                setCurEvent({
                    ...curEvent,
                    completed_users: curEvent.completed_users ? [...curEvent.completed_users, user] : [user],
                });
                toast({ title: 'User Signed In', description: `${user.full_name} has been signed in`, variant: 'default' });
            } catch (error) {
                console.error(error);
                toast({ title: 'Error', description: 'An error occured while signing in the user', variant: 'destructive' });
            };
        }
    };

    return (
        <div className="flex flex-col items-start w-full">
            <h1 className="text-2xl font-bold mb-4">Sign In Users</h1>
            {users.map((user, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gray-600 p-4 rounded-md mb-2 w-full flex justify-between items-center"
                >
                    <span>{user.full_name}</span>
                    {curEvent.signed_up_users?.some((u) => u.id === user.id) && !curEvent.completed_users?.some((u) => u.id === user.id) && (
                        <button
                            onClick={() => handleSignInClick(user)}
                            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            {fetchStatus === "loading" ? 'Signing In...' : 'Sign In'}
                        </button>
                    )}

                    {curEvent.signed_up_users?.some((u) => u.id === user.id) && curEvent.completed_users?.some((u) => u.id === user.id) && (
                        <button
                            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md cursor-not-allowed"
                        >
                            Signed In
                        </button>
                    )}
                </motion.div>
            ))}
        </div>
    );
};

export default SignInUsers;
