import { createEvent } from "@/api/events";
import { Badge } from "@/constants/interfaces";
import { useAppDispatch, selectEvents } from "@/store/store";
import { useState } from "react";
import { FaSave } from "react-icons/fa";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { formatDate } from "@/util/input";
import { categories, regions } from "@/constants";
import { motion } from 'framer-motion';
import { useSelector } from "react-redux";

const CreateEventForm = () => {
    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventBadges, setEventBadges] = useState<Badge[]>([]);
    const [eventRegion, setEventRegion] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventTags, setEventTags] = useState<string[]>([]);
    const [eventStartDate, setEventStartDate] = useState(new Date());
    const [eventEndDate, setEventEndDate] = useState(new Date());
    const [selectedCategory, setSelectedCategory] = useState("");

    const navigate = useNavigate();
    const { toast } = useToast();
    const { fetchStatus } = useSelector(selectEvents);
    const dispatch = useAppDispatch();

    const handleEventNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEventName(e.target.value);
    };

    const handleEventDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEventDescription(e.target.value);
    };

    const handleCategoryChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedCategory(event.target.value);
    };

    const handleEventRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEventRegion(e.target.value);
    };

    const handleEventLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEventLocation(e.target.value);
    };

    const handleEventStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = new Date(e.target.value);
        setEventStartDate(date);
    };

    const handleEventEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = new Date(e.target.value);
        setEventEndDate(date);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (eventName === '' || eventDescription === '' || eventRegion === '' || eventLocation === '' || eventTags.length === 0 || selectedCategory === '') {
            toast({ title: 'Error', description: 'Please fill in all fields', variant: "destructive" });
            return;
        }

        if (eventStartDate > eventEndDate) {
            toast({ title: 'Error', description: 'Event start date cannot be after event end date', variant: "destructive" });
            return;
        }

        if (eventStartDate < new Date() || eventEndDate < new Date()) {
            toast({ title: 'Error', description: 'Event start and end date cannot be in the past', variant: "destructive" });
            return;
        }

        const authUser = localStorage.getItem('authUser');
        if (!authUser) {
            toast({ title: 'Error', description: 'Please log in to create an event', variant: "destructive" });
            navigate('/auth');
        }
        const { token } = JSON.parse(authUser!);

        dispatch(createEvent({
            eventData: {
                name: eventName,
                description: eventDescription,
                category: selectedCategory,
                badges: eventBadges,
                region: eventRegion,
                location: eventLocation,
                tags: eventTags,
                date_start: eventStartDate.toISOString(),
                date_end: eventEndDate.toISOString(),
            },
            token
        })).then(() => {
            setEventName('');
            setEventDescription('');
            setEventBadges([]);
            setEventRegion('');
            setEventLocation('');
            setEventTags([]);
            setEventStartDate(new Date());
            setEventEndDate(new Date());
            toast({ title: 'Success', description: 'Event created successfully', variant: "default" });
            navigate('/events');
        }).catch((error) => {
            toast({ title: 'Error', description: 'An error occurred while creating the event', variant: "destructive" });
            console.error(error);
        });
    };

    const handleEventTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value.split(",");
        setEventTags(tags);
    };

    const renderTags = () => {
        return eventTags.map((tag, index) => (
            <div key={index} className="inline-block bg-[#9290C3] rounded-md px-2 py-1 mr-2 mb-2 text-[#E5E7EB]">
                <span>{tag}</span>
            </div>
        ));
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="w-full max-w-lg p-8 rounded-lg shadow-lg bg-[#070F2B] text-[#E5E7EB]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className="text-3xl font-bold mb-6">Create Event</h2>
            <div className="mb-5">
                <label htmlFor="eventName" className="block text-[#E5E7EB] font-bold mb-2">
                    Event Name
                </label>
                <Input
                    type="text"
                    id="eventName"
                    value={eventName}
                    onChange={handleEventNameChange}
                    className="w-full border border-[#535C91] rounded py-2 px-3 focus:outline-none focus:border-[#9290C3]"
                    required
                />
            </div>
            <div className="mb-5">
                <label htmlFor="eventDescription" className="block text-[#E5E7EB] font-bold mb-2">
                    Event Description
                </label>
                <textarea
                    id="eventDescription"
                    value={eventDescription}
                    onChange={handleEventDescriptionChange}
                    className="w-full border border-[#535C91] rounded py-2 px-3 focus:outline-none focus:border-[#9290C3]"
                    required
                />
            </div>
            <div className="mb-5">
                <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="bg-[#070F2B] text-[#E5E7EB] p-2 rounded-lg focus:outline-none border border-[#535C91] transition duration-150 ease-in-out w-full mb-4"
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                            {category.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-5">
                <label htmlFor="eventRegion" className="block text-[#E5E7EB] font-bold mb-2">
                    Event Region
                </label>
                <select
                    id="eventRegion"
                    value={eventRegion}
                    onChange={handleEventRegionChange}
                    className="w-full border border-[#535C91] rounded py-2 px-3 focus:outline-none focus:border-[#9290C3]"
                    required
                >
                    <option value="" disabled>Select a region</option>
                    {regions.map((region) => (
                        <option key={region.value} value={region.value}>
                            {region.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-5">
                <label htmlFor="eventLocation" className="block text-[#E5E7EB] font-bold mb-2">
                    Event Location
                </label>
                <Input
                    type="text"
                    id="eventLocation"
                    value={eventLocation}
                    onChange={handleEventLocationChange}
                    className="w-full border border-[#535C91] rounded py-2 px-3 focus:outline-none focus:border-[#9290C3]"
                    required
                />
            </div>
            <div className="mb-5">
                <label htmlFor="eventTags" className="block text-[#E5E7EB] font-bold mb-2">
                    Event Tags
                </label>
                <div className="flex flex-wrap mb-2">
                    {renderTags()}
                </div>
                <Input
                    type="text"
                    id="eventTags"
                    value={eventTags}
                    onChange={handleEventTagsChange}
                    className="w-full border border-[#535C91] rounded py-2 px-3 focus:outline-none focus:border-[#9290C3]"
                    required
                />
            </div>
            <div className="mb-5">
                <label htmlFor="eventStartDate" className="block text-[#E5E7EB] font-bold mb-2">
                    Event Start Date
                </label>
                <Input
                    type="datetime-local"
                    id="eventStartDate"
                    value={formatDate(eventStartDate)}
                    onChange={handleEventStartDateChange}
                    className="w-full border border-[#535C91] rounded py-2 px-3 focus:outline-none focus:border-[#9290C3]"
                    required
                />
            </div>
            <div className="mb-5">
                <label htmlFor="eventEndDate" className="block text-[#E5E7EB] font-bold mb-2">
                    Event End Date
                </label>
                <Input
                    type="datetime-local"
                    id="eventEndDate"
                    value={formatDate(eventEndDate)}
                    onChange={handleEventEndDateChange}
                    className="w-full border border-[#535C91] rounded py-2 px-3 focus:outline-none focus:border-[#9290C3]"
                    required
                />
            </div>

            <Button
                type="submit"
                className="flex items-center justify-center bg-[#4F8CFF] text-[#E5E7EB] py-2 px-4 rounded hover:bg-[#535C91]"
            >
                <FaSave className="mr-2" />
                {fetchStatus === "loading" ? 'Creating...' : 'Create'}
            </Button>
        </motion.form>
    );
}

export default CreateEventForm;
