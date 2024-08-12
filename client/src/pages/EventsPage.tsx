import React, { useState } from 'react';
import { FaSearch, FaBell, FaUserCircle, FaCalendarAlt, FaHome, FaUsers, FaTimes, FaMapMarkerAlt, FaTag, FaCalendar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { events } from '@/constants';

const EventsPage = () => {
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [showPeople, setShowPeople] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [inputTag, setInputTag] = useState('');
    const [zoomedImage, setZoomedImage] = useState<string | null>(null); // New state for zoomed image

    const handleMoreInfo = (event: any) => {
        setSelectedEvent(event);
        setShowPeople(false);
    };

    const handleClose = () => {
        setSelectedEvent(null);
    };

    const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRegion(event.target.value);
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
    };

    const handleTagInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputTag.trim()) {
            setTags([...tags, inputTag.trim()]);
            setInputTag('');
        }
    };

    const handleTagRemove = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    const filteredEvents = events.filter(event =>
        (selectedRegion === '' || event.region === selectedRegion) &&
        (selectedCategory === '' || event.category === selectedCategory) &&
        tags.every(tag => event.tags.includes(tag))
    );

    const similarEvents = events.filter(event =>
        (selectedRegion === '' || event.region === selectedRegion) &&
        (selectedCategory === '' || event.category === selectedCategory) &&
        tags.some(tag => event.tags.includes(tag))
    );

    const displayedEvents = filteredEvents.length > 0 ? filteredEvents : similarEvents;

    const getRandomPeople = (num: number) => {
        return Array.from({ length: num }).map((_, index) => ({
            id: index + 1,
            imageUrl: `https://via.placeholder.com/32x32?text=P${index + 1}`,
        })).sort(() => 0.5 - Math.random()).slice(0, 3);
    };

    return (
        <div className="min-h-screen bg-[#070F2B] flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-1/4 bg-[#1B1A55] p-6 border-b md:border-b-0 md:border-r border-[#535C91]">
                <img className="h-10 mb-6 text-[#E5E7EB]" src='/Orbitfind.png' alt="Logo" />
                <nav className="space-y-4">
                    <button className="flex items-center space-x-2 p-2 hover:bg-[#535C91] rounded">
                        <FaHome className="text-xl text-[#9290C3]" />
                        <span className="text-lg text-[#E5E7EB]">Home</span>
                    </button>
                    <button className="flex items-center space-x-2 p-2 hover:bg-[#535C91] rounded">
                        <FaCalendarAlt className="text-xl text-[#9290C3]" />
                        <span className="text-lg text-[#E5E7EB]">Events</span>
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-[#1B1A55] p-4 border-b border-[#535C91] flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-4">
                        <FaSearch className="text-2xl text-[#9290C3]" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-[#070F2B] p-2 rounded-lg focus:outline-none focus:ring focus:ring-[#535C91] text-[#E5E7EB]"
                        />
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
                        <select value={selectedRegion} onChange={handleRegionChange} className="bg-[#070F2B] text-[#E5E7EB] p-2 rounded-lg focus:outline-none">
                            <option value="">Select Region</option>
                            <option value="London">London</option>
                            <option value="New York">New York</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Bangladesh">Bangladesh</option>
                        </select>
                        <select value={selectedCategory} onChange={handleCategoryChange} className="bg-[#070F2B] text-[#E5E7EB] p-2 rounded-lg focus:outline-none">
                            <option value="">Select Category</option>
                            <option value="Music">Music</option>
                            <option value="Technology">Technology</option>
                            <option value="Sports">Sports</option>
                            <option value="Food">Food</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Art">Art</option>
                            <option value="Business">Business</option>
                        </select>
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Add Tags"
                                value={inputTag}
                                onChange={(e) => setInputTag(e.target.value)}
                                onKeyDown={handleTagInput}
                                className="bg-[#070F2B] p-2 rounded-lg focus:outline-none focus:ring focus:ring-[#535C91] text-[#E5E7EB]"
                            />
                            <div className="flex flex-wrap space-x-2 ml-2">
                                {tags.map((tag, index) => (
                                    <span key={index} className="bg-[#535C91] text-[#E5E7EB] px-2 py-1 rounded-full flex items-center">
                                        {tag}
                                        <FaTimes className="ml-2 cursor-pointer" onClick={() => handleTagRemove(tag)} />
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {displayedEvents.map(event => (
                        <motion.div
                            key={event.id}
                            className="bg-[#1B1A55] p-6 rounded-lg shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <h3 className="text-xl font-semibold text-[#E5E7EB] mb-2">{event.title}</h3>
                            <div className="flex items-center text-[#9290C3] mb-4">
                                <FaCalendar className="mr-2" />
                                <span>{event.date}</span>
                            </div>
                            <div className="flex items-center space-x-2 mb-4">
                                {getRandomPeople(3).map(person => (
                                    <img
                                        key={person.id}
                                        src={person.imageUrl}
                                        alt={`Person ${person.id}`}
                                        className="w-8 h-8 rounded-full"
                                    />
                                ))}
                                <span className="text-[#E5E7EB]">{event.people} Going</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <button 
                                    onClick={() => handleMoreInfo(event)} 
                                    className="bg-[#070F2B] text-[#E5E7EB] py-1 px-3 rounded hover:bg-[#535C91] transition duration-200 ease-in-out">
                                    More Info
                                </button>
                                <button className="bg-[#9290C3] text-[#1B1A55] py-1 px-3 rounded hover:bg-[#E5E7EB] transition duration-200 ease-in-out">
                                    RSVP
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Modal for More Info */}
            <AnimatePresence>
                {selectedEvent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="bg-[#1B1A55] w-full max-w-lg p-6 rounded-lg shadow-lg relative overflow-y-auto"
                        >
                            <button onClick={handleClose} className="absolute top-3 right-3 text-[#E5E7EB] text-lg">
                                <FaTimes />
                            </button>
                            <h2 className="text-2xl font-semibold text-[#E5E7EB] mb-4">{selectedEvent.title}</h2>
                            <p className="text-[#E5E7EB] mb-4">{selectedEvent.description}</p>
                            
                            {/* Location */}
                            <div className="mb-4 flex items-center">
                                <FaMapMarkerAlt className="text-[#E5E7EB] mr-2" />
                                <span className="text-[#E5E7EB]">{selectedEvent.location}</span>
                            </div>

                            {/* Tags */}
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-[#E5E7EB]">Tags</h3>
                                <div className="flex flex-wrap space-x-2">
                                    {selectedEvent.tags.map((tag: string, index: number) => (
                                        <span key={index} className="bg-[#535C91] text-[#E5E7EB] px-2 py-1 rounded-full">{tag}</span>
                                    ))}
                                </div>
                            </div>

                            {/* People Going */}
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-[#E5E7EB]">People Going</h3>
                                <button
                                    onClick={() => setShowPeople(!showPeople)}
                                    className="flex items-center space-x-2 text-[#9290C3] underline hover:text-[#E5E7EB] transition duration-200 ease-in-out"
                                >
                                    <FaUsers className="mr-2" />
                                    <span>{selectedEvent.people} People Going</span>
                                </button>
                                {showPeople && (
                                    <div className="mt-4 max-h-40 overflow-y-auto">
                                        {Array.from({ length: selectedEvent.people }).map((_, index) => (
                                            <div key={index} className="flex items-center mb-2">
                                                <img
                                                    src={`https://via.placeholder.com/32x32?text=P${index + 1}`}
                                                    alt={`Person ${index + 1}`}
                                                    className="w-8 h-8 rounded-full mr-2"
                                                />
                                                <span className="text-[#E5E7E]">Person {index + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Attachments */}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EventsPage;
