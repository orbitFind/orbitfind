import { createEvent } from "@/api/events";
import { Badge } from "@/constants/interfaces";
import { useAppDispatch } from "@/store/store";
import { useState } from "react";
import { FaSave } from "react-icons/fa";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const CreateEventForm = () => {
    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventBadges, setEventBadges] = useState<Badge[]>([]);
    const [eventRegion, setEventRegion] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventTags, setEventTags] = useState<string[]>([]);
    const [eventStartDate, setEventStartDate] = useState(new Date());
    const [eventEndDate, setEventEndDate] = useState(new Date());

    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const authUser = localStorage.getItem('authUser');
    const { token } = JSON.parse(authUser!);

    const handleEventNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEventName(e.target.value);
    };

    const handleEventDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEventDescription(e.target.value);
    };

    const handleEventBadgesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEventBadges([...eventBadges, { badge_id: e.target.value, name: e.target.value }]);
    };

    // const handleSelectBadge = (e: React.ChangeEvent<HTMLSelectElement>) => {

    // }

    const handleEventRegionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        const date = new Date(e.target.value)
        setEventEndDate(date);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(createEvent({
            eventData: {
                name: eventName,
                description: eventDescription,
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
        }).then(() => {
            alert('Event created successfully');
            navigate('/events');
        }).catch((error) => {
            alert('Error creating event');
            console.error(error);
        });
    };

    const handleEventTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value.split(",");
        setEventTags(tags);
    };

    const renderTags = () => {
        return eventTags.map((tag, index) => (
            <div key={index} className="inline-block bg-gray-200 rounded-md px-2 py-1 mr-2 mb-2 text-black">
                <span>{tag}</span>
            </div>
        ));
    };

    const renderBadges = () => {
        return eventBadges.map((badge, index) => (
            <div key={index} className="inline-block bg-gray-200 rounded-md px-2 py-1 mr-2 mb-2 text-black">
                <span>{badge.name}</span>
            </div>
        ))
    }

    return (
        <form onSubmit={handleSubmit} className="w-10/12 p-8 rounded shadow bg-[#4F8CFF] text-[#E5E7EB] px-4 py-2 rounded-md hover:bg-[#4F8CFF] shadow-md">
            <h2 className="text-2xl font-bold mb-4">Create Event</h2>
            <div className="mb-4">
                <label htmlFor="eventName" className="block text-white-700 font-bold mb-2">
                    Event Name
                </label>
                <Input
                    type="text"
                    id="eventName"
                    value={eventName}
                    onChange={handleEventNameChange}
                    className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="eventDescription" className="block text-white-700 font-bold mb-2">
                    Event Description
                </label>
                <textarea
                    id="eventDescription"
                    value={eventDescription}
                    onChange={handleEventDescriptionChange}
                    className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="eventBadges" className="block text-white-700 font-bold mb-2">
                    Event Badges
                </label>
                <div className="flex flex-wrap">
                    {renderBadges()}
                </div>
                <select
                    id="eventBadges"
                    className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500"
                    onChange={handleEventBadgesChange}
                >
                    <option value="" key={"placeholder-option"}>Select a badge</option>
                    <option value={""} key={"create-new-badge"}>+ Create a new badge</option>
                    {eventBadges.map((badge) => (
                        <option key={badge.badge_id} value={badge.badge_id}>
                            {badge.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="eventRegion" className="block text-white-700 font-bold mb-2">
                    Event Region
                </label>
                <Input
                    type="text"
                    id="eventRegion"
                    value={eventRegion}
                    onChange={handleEventRegionChange}
                    className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="eventLocation" className="block text-white-700 font-bold mb-2">
                    Event Location
                </label>
                <Input
                    type="text"
                    id="eventLocation"
                    value={eventLocation}
                    onChange={handleEventLocationChange}
                    className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="eventTags" className="block text-white-700 font-bold mb-2">
                    Event Tags
                </label>
                <div className="flex flex-wrap">
                    {renderTags()}
                </div>
                <Input
                    type="text"
                    id="eventTags"
                    value={eventTags}
                    onChange={handleEventTagsChange}
                    className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="eventStartDate" className="block text-white-700 font-bold mb-2">
                    Event Start Date
                </label>
                <Input
                    type="date"
                    id="eventStartDate"
                    value={eventStartDate.toISOString().split('T')[0]}
                    onChange={handleEventStartDateChange}
                    className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="eventEndDate" className="block text-white-700 font-bold mb-2">
                    Event End Date
                </label>
                <Input
                    type="date"
                    id="eventEndDate"
                    value={eventEndDate.toISOString().split('T')[0]}
                    onChange={handleEventEndDateChange}
                    className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500"
                    required
                />
            </div>

            <Button
                type="submit"
                className="flex items-center justify-center bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
                <FaSave className="mr-2" />
                Create
            </Button>
        </form>
    );

}

export default CreateEventForm;