import { endEvent, getHostedEvents } from '@/api/events';
import { Event } from '@/constants/interfaces';
import { useAppDispatch } from '@/store/store';
import React from 'react';
import { useToast } from '../ui/use-toast';

interface EndEventProps {
    event: Event;
    setSelectedEvent: React.Dispatch<React.SetStateAction<Event | null>>;
}

const EndEvent: React.FC<EndEventProps> = ({ event, setSelectedEvent }) => {
    const dispatch = useAppDispatch();
    const { toast } = useToast();
    const [loading, setLoading] = React.useState(false);

    const handleEndEvent = () => {
        setLoading(true);
        dispatch(endEvent(event.event_id)).then(() => {
            toast({ title: 'Event Ended', description: `The event ${event.name} has been ended`, variant: 'default' });
            dispatch(getHostedEvents());
            setSelectedEvent(null);
        }).catch((error) => {
            console.error(error);
            toast({ title: 'Error', description: 'An error occured while ending the event', variant: 'destructive' });
        }).finally(() => {
            setLoading(false);
        });
    };

    return (

        <div className="">
            {event.status === 'ongoing' && (
                <button
                    type="button"
                    className="bg-blue-500 shadow-md hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                    onClick={handleEndEvent}
                >
                    {loading ? 'Ending...' : 'End Event'}
                </button>
            )}

            {event.status === 'completed' && (
                <button
                    type="button"
                    className="bg-blue-500 shadow-md hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-not-allowed"
                >
                    Event ended
                </button>
            )}
        </div>
    );
};

export default EndEvent;