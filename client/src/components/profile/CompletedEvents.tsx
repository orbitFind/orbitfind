import { Event, User } from "@/constants/interfaces"
import { motion } from "framer-motion"
import { useEffect, useState } from "react";

interface CompletedEventsProps {
    user: User;
}

const CompletedEvents: React.FC<CompletedEventsProps> = ({ user }) => {
    const [completedEvents, setCompletedEvents] = useState<Event[]>([]);
    const [completedHostedEvents, setCompletedHostedEvents] = useState<Event[]>([]);

    useEffect(() => {
        if (!user) return
        if (user.completedEvents?.length > 0) {
            console.log(user.completedEvents);
            setCompletedEvents(user.completedEvents);
        }
        if (user.hostedEvents?.length > 0) {
            const hostedEvents = user.hostedEvents.filter(event => event.status === "completed");
            setCompletedHostedEvents(hostedEvents);
        }
    }, [user]);

    return (
        <>
            {completedEvents.length === 0 && completedHostedEvents.length === 0 && (
                <p className="text-[#E5E7EB]">You haven't completed any events yet!</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedHostedEvents.length > 0 && completedHostedEvents.map((event, index) => (
                    <div key={index}>
                        <motion.div
                            key={index}
                            className="bg-[#1B1A55] p-4 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105"
                            initial={{ opacity: 0.9 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h3 className="text-xl text-[#E5E7EB]">{event.name}</h3>
                            <h5 className="text-md text-[#E5E7EB] bg-gray-700 px-2 py-1 rounded-lg inline-block my-3">hosted by you</h5>
                            <p className="text-[#9290C3]">{event.description}</p>
                        </motion.div>
                    </div>
                ))}

                {completedEvents.length > 0 && completedEvents.map((event, index) => (
                    <div key={index}>
                        <motion.div
                            key={index}
                            className="bg-[#1B1A55] p-4 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105"
                            initial={{ opacity: 0.9 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h3 className="text-xl text-[#E5E7EB]">{event.name}</h3>
                            <p className="text-[#9290C3]">{event.description}</p>
                        </motion.div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default CompletedEvents
