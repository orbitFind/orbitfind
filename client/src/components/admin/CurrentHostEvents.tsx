import { Event, User } from "@/constants/interfaces"
import { motion } from "framer-motion"
import { useState, useEffect } from "react";
import { FaCalendarAlt, FaUsers, FaEdit } from "react-icons/fa";

interface CurrentHostEventsProps {
    user: User;
    handleMoreInfo: (event: Event) => void;
}

const CurrentHostEvents: React.FC<CurrentHostEventsProps> = ({ user, handleMoreInfo }) => {
    const [currentHostedEvents, setCurrentHostedEvents] = useState<Event[]>([]);

    useEffect(() => {
        if (!user) return
        if (user.hostedEvents?.length > 0) {
            const hostedEvents = user.hostedEvents.filter(event => event.status === "ongoing");
            setCurrentHostedEvents(hostedEvents);
        }
    }, [user]);

    return (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {currentHostedEvents.length > 0 ? currentHostedEvents.map((event) => (
                <motion.div
                    key={event.event_id}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col h-full border border-gray-700"
                    transition={{ duration: 0.3 }}
                >
                    <div>
                        {event.status === "ongoing" && !(new Date(event.date_end) < new Date(Date.now())) && (
                            <div className="bg-[#FF0000] text-white px-2 py-1 rounded-lg mb-4 font-bold">
                                • LIVE
                            </div>
                        )}
                        {event.status === "ongoing" && new Date(event.date_end) < new Date(Date.now()) && (
                            <div className="bg-gray-600 text-white px-2 py-1 rounded-lg mb-4">
                                You need to mark this event as completed.
                            </div>
                        )}
                        <h3 className="text-xl font-semibold mb-2">
                            {event.name}
                        </h3>
                        <div className="flex items-center text-gray-400 mb-4">
                            <FaCalendarAlt className="mr-2" />
                            <span>{new Date(event.date_start).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center text-gray-400 mb-4">
                            <FaCalendarAlt className="mr-2" />
                            <span>{new Date(event.date_end).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center text-gray-400 mb-4">
                            <FaUsers className="mr-2" />
                            <span>{event.signed_up_users?.length ?? '0'} People RSVP'd</span>
                        </div>
                        <div>
                            <span className="text-gray-400">{event.status}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                        <button
                            onClick={() => handleMoreInfo(event)}
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center space-x-2"
                        >
                            <FaEdit />
                            <span>Manage</span>
                        </button>
                    </div>
                </motion.div>
            )) : (
                <p className="text-gray-400 w-full">You're not hosting any events currently!</p>
            )}
        </motion.div>
    )
}

export default CurrentHostEvents
