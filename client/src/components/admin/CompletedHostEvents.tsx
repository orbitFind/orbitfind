import { User } from "@/constants/interfaces"
import { motion } from "framer-motion"

interface CompletedHostEventsProps {
    user: User;
}

const CompletedHostEvents: React.FC<CompletedHostEventsProps> = ({ user }) => {
    return (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {user?.hostedEvents.filter(event => event.status === "completed").map((event, index) => (
                <motion.div
                    key={index}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 flex flex-col h-full border border-gray-700"
                    initial={{ opacity: 0.9 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <h3 className="text-xl text-[#E5E7EB]">{event.name}</h3>
                    <p className="text-[#9290C3]">{event.description}</p>
                    <br />
                    <p className="text-[#9290C3]">Date Ended: {new Date(event.date_end).toLocaleString()}</p>
                    <p className="text-[#9290C3]">Location: {event.location}</p>
                </motion.div>
            ))}
        </motion.div>
    )
}

export default CompletedHostEvents
