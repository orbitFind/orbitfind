import CreateEventForm from '@/components/events/CreateEventForm';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CreateEventsPage = () => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#070F2B] to-[#1B1A55]"
        >
            <button 
                className="bg-white text-black px-4 py-2 rounded-md mb-4" 
                onClick={() => navigate('/events')}
            >
                Back to Events
            </button>
            <CreateEventForm />
        </motion.div>
    );
};

export default CreateEventsPage;
