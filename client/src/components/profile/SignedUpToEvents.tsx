import { Event, User } from "@/constants/interfaces"
import { motion } from "framer-motion"
import ConfirmModal from "../ui/confirmModal"
import { updateUser } from "@/api/user";
import { useState } from "react";
import { useAppDispatch } from "@/store/store";
import { useToast } from "../ui/use-toast";
interface SignedUpToEventsProps {
    user: User;
}

const SignedUpToEvents: React.FC<SignedUpToEventsProps> = ({ user }) => {
    const dispatch = useAppDispatch();
    const { toast } = useToast();
    const [optOutModal, setOptOutModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const openOptOutModal = (event: Event) => {
        setSelectedEvent(event);
        setOptOutModal(true);
    };
    const closeOptOutModal = () => setOptOutModal(false);


    const handleOptOut = () => {
        if (!user || !selectedEvent) return;
        dispatch(updateUser({
            ...user,
            signedUpTo: user.signedUpTo.filter((event) => event.event_id !== selectedEvent.event_id)
        }));
        setOptOutModal(false);
        toast({ title: "Opted Out", description: `You have opted out of ${selectedEvent.name}`, variant: "default" });
    };


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.signedUpTo.map((event, index) => (
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

                        <button className="mt-4 bg-[#FF0000] text-[#E5E7EB] px-4 py-2 rounded-lg" onClick={() => openOptOutModal(event)}>
                            Opt Out
                        </button>
                    </motion.div>
                    <ConfirmModal
                        isOpen={optOutModal}
                        onCancel={closeOptOutModal}
                        onConfirm={handleOptOut}
                        title={`Opt Out of ${event.name}`}
                        description="Are you sure you want to opt out of this event?"
                        confirmText="Yes, Opt Out"
                        cancelText="No, Keep Me In"
                    />
                </div>
            ))}
        </div>
    )
}

export default SignedUpToEvents
