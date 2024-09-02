import { User } from "@/constants/interfaces"
import { motion } from "framer-motion"

interface CompletedEventsProps {
    user: User;
}

const CompletedEvents: React.FC<CompletedEventsProps> = ({ user }) => {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.completedEvents.map((event, index) => (
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
    )
}

export default CompletedEvents
