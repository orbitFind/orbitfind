import React, { useEffect, useState } from "react";
import { FaSearch, FaTimes, FaMapMarkerAlt, FaCalendar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { categories, regions } from "@/constants"; // Assuming events are defined in constants
import { selectEvents, useAppDispatch } from "@/store/store";
import { getAllEvents, RSVPUserInEvent } from "@/api/events";
import { useSelector } from "react-redux";
import { Event } from "@/constants/interfaces";
import ConfirmModal from "@/components/ui/confirmModal";
import { useToast } from "@/components/ui/use-toast";

const EventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  // const [showPeople, setShowPeople] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { toast } = useToast();

  // RSVP Component
  const [selectedRSVPEvent, setSelectedRSVPEvent] = useState<Event | null>(
    null
  );
  const [RSVPModalOpen, setRSVPModalOpen] = useState<boolean>(false);

  const openRSVPModal = (event: Event) => {
    console.log(event.signed_up_users);
    setSelectedRSVPEvent(event);
    setRSVPModalOpen(true);
  };
  const closeRSVPModal = () => {
    setSelectedRSVPEvent(null);
    setRSVPModalOpen(false);
  };

  const authUser = localStorage.getItem("authUser") || null;

  if (!authUser) {
    console.error("No user is logged in.");
    return;
  }

  const { user } = JSON.parse(authUser);

  const dispatch = useAppDispatch();
  const { events } = useSelector(selectEvents);
  const fetchEvents = async () => {
    await dispatch(getAllEvents());
  };
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRSVP = () => {
    dispatch(
      RSVPUserInEvent({
        ...selectedRSVPEvent!,
        people: (selectedRSVPEvent?.people || 0) + 1,
        signed_up_users: [...(selectedRSVPEvent?.signed_up_users || []), user],
      })
    );

    toast({
      title: "RSVP'd",
      description: `You have RSVP'd to ${selectedRSVPEvent?.name}`,
      variant: "default",
    });
    closeRSVPModal();
    fetchEvents();
  };

  const handleMoreInfo = (event: any) => {
    setSelectedEvent(event);
    // setShowPeople(false);
  };

  const handleClose = () => {
    setSelectedEvent(null);
  };

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(event.target.value);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCategory(event.target.value);
  };

  const handleTagInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputTag.trim()) {
      setTags([...tags, inputTag.trim()]);
      setInputTag("");
    }
  };

  const handleTagRemove = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleRegionRemove = () => {
    setSelectedRegion("");
  };

  const handleCategoryRemove = () => {
    setSelectedCategory("");
  };

  const handleClearFilters = () => {
    setSelectedRegion("");
    setSelectedCategory("");
    setTags([]);
    setSearchTerm("");
  };

  const similarTagMatch = (eventTags: string[]) => {
    return tags.some((tag) =>
      eventTags.some((eventTag) =>
        eventTag.toLowerCase().includes(tag.toLowerCase())
      )
    );
  };

  const matchesSearchTerm = (event: Event) => {
    const lowerCaseSearchTerm = searchTerm?.toLowerCase();
    return (
      event.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
      event.region?.toLowerCase().includes(lowerCaseSearchTerm) ||
      event.category?.toLowerCase().includes(lowerCaseSearchTerm) ||
      event.tags?.some((tag: string) =>
        tag.toLowerCase().includes(lowerCaseSearchTerm)
      )
    );
  };

  const filterEvents = events?.filter(
    (event) =>
      (selectedRegion === "" || event.region === selectedRegion) &&
      (selectedCategory === "" || event.category === selectedCategory) &&
      tags.every((tag) => event.tags.includes(tag)) &&
      matchesSearchTerm(event)
  );

  const getSimilarEvents = events?.filter(
    (event) =>
      (selectedRegion === "" || event.region === selectedRegion) &&
      (selectedCategory === "" || event.category === selectedCategory) &&
      similarTagMatch(event.tags) &&
      matchesSearchTerm(event)
  );

  const displayedEvents =
    filterEvents.length > 0 ? filterEvents : getSimilarEvents;

  const getRandomPeople = (num: number) => {
    return Array.from({ length: num })
      .map((_, index) => ({
        id: index + 1,
        imageUrl: `https://via.placeholder.com/32x32?text=P${index + 1}`,
      }))
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-[#070F2B] flex flex-col md:flex-row">
      {/* Sidebar */}
      <motion.div
        className="w-full md:w-1/4 bg-[#1B1A55] p-6 border-b md:border-b-0 md:border-r border-[#535C91] transition duration-200 ease-in-out"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        exit={{ x: -100 }}
      >
        <img
          className="h-20 mb-6 text-[#E5E7EB]" // Adjust the height here (e.g., h-20 for a larger logo)
          src="/Orbitfind.png"
          alt="Logo"
        />
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <FaSearch className="text-2xl text-[#9290C3] mr-2" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#070F2B] p-2 rounded-lg focus:outline-none focus:ring focus:ring-[#535C91] text-[#E5E7EB] placeholder-[#A8A8A8] w-full"
            />
          </div>
          <select
            value={selectedRegion}
            onChange={handleRegionChange}
            className="bg-[#070F2B] text-[#E5E7EB] p-2 rounded-lg focus:outline-none border border-[#535C91] transition duration-150 ease-in-out w-full mb-4"
          >
            <option value="">Select Region</option>
            {regions.map((region) => (
              <option key={region.value} value={region.value}>
                {region.label}
              </option>
            ))}
          </select>
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
          <input
            type="text"
            placeholder="Add Tags"
            value={inputTag}
            onChange={(e) => setInputTag(e.target.value)}
            onKeyDown={handleTagInput}
            className="bg-[#070F2B] p-2 rounded-lg focus:outline-none focus:ring focus:ring-[#535C91] text-[#E5E7EB] placeholder-[#A8A8A8] w-full"
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Selected Filters Section */}
        <div className="flex flex-wrap justify-center mt-4 mb-4 space-x-2">
          {selectedRegion && (
            <div className="bg-[#535C91] text-[#E5E7EB] px-3 py-1 rounded-full flex items-center">
              {selectedRegion}
              <FaTimes
                className="ml-2 cursor-pointer"
                onClick={handleRegionRemove}
              />
            </div>
          )}
          {selectedCategory && (
            <div className="bg-[#535C91] text-[#E5E7EB] px-3 py-1 rounded-full flex items-center">
              {selectedCategory}
              <FaTimes
                className="ml-2 cursor-pointer"
                onClick={handleCategoryRemove}
              />
            </div>
          )}
          {tags.map((tag, index) => (
            <div
              key={index}
              className="bg-[#535C91] text-[#E5E7EB] px-3 py-1 rounded-full flex items-center"
            >
              {tag}
              <FaTimes
                className="ml-2 cursor-pointer"
                onClick={() => handleTagRemove(tag)}
              />
            </div>
          ))}
        </div>

        {/* Clear Filters Button */}
        {(selectedRegion || selectedCategory || tags.length > 0) && (
          <div className="flex justify-center mb-4">
            <button
              onClick={handleClearFilters}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200 ease-in-out"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Events List */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {displayedEvents.filter((event) => event.status !== "completed")
            .length > 0 ? (
            displayedEvents
              .filter((event) => event.status !== "completed")
              .map((event) => (
                <motion.div
                  key={event.event_id}
                  className="bg-[#E5E7EB] text-[#1B1A55] p-4 rounded-lg shadow-lg flex flex-col h-full"
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "#1B1A55", // Inverted background
                    color: "#E5E7EB", // Inverted text color
                  }}
                >
                  {event.status === "ongoing" && (
                    <div className="bg-[#FF0000] text-white px-2 py-1 rounded-lg mb-4 font-bold">
                      • LIVE
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                    <div className="flex items-center mb-4">
                      <FaCalendar className="mr-2" />
                      <span>{event.date_start}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-4">
                      {getRandomPeople(3).map((person) => (
                        <img
                          key={person.id}
                          src={person.imageUrl}
                          alt={`Person ${person.id}`}
                          className="w-8 h-8 rounded-full"
                        />
                      ))}
                      <span>{event.people} Going</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <button
                      onClick={() => handleMoreInfo(event)}
                      className="bg-[#1B1A55] text-[#E5E7EB] py-1 px-3 rounded hover:bg-[#E5E7EB] hover:text-[#1B1A55] transition duration-200 ease-in-out"
                    >
                      More Info
                    </button>
                    {!event.hosted_users?.some((u) => u === user.uid) &&
                      event.signed_up_users?.some((u) => u === user.uid) && (
                        <button className="bg-[#535C91] text-[#E5E7EB] py-1 px-3 rounded cursor-not-allowed">
                          RSVP'd
                        </button>
                      )}
                    {!event.hosted_users?.some((u) => u === user.uid) &&
                      !event.signed_up_users?.some((u) => u === user.uid) && (
                        <button
                          className="bg-[#9290C3] text-[#1B1A55] py-1 px-3 rounded hover:bg-[#E5E7EB] hover:text-[#1B1A55] transition duration-200 ease-in-out"
                          onClick={() => openRSVPModal(event)}
                        >
                          RSVP
                        </button>
                      )}
                    {event.hosted_users?.some((u) => u === user.uid) && (
                      <button className="bg-[#535C91] text-[#E5E7EB] py-1 px-3 rounded cursor-not-allowed">
                        Hosted
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-[#E5E7EB]">
              <p>No events found matching your search criteria.</p>
            </div>
          )}
        </motion.div>
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
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 text-[#E5E7EB] text-lg"
              >
                <FaTimes />
              </button>
              <h2 className="text-2xl font-semibold text-[#E5E7EB] mb-4">
                {selectedEvent.name}
              </h2>
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
                    <span
                      key={index}
                      className="bg-[#535C91] text-[#E5E7EB] px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* People Going */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#E5E7EB]">
                  {selectedEvent.signed_up_users.length} People Going
                </h3>
                {/* <button
                  onClick={() => setShowPeople(!showPeople)}
                  className="flex items-center space-x-2 text-[#9290C3] underline hover:text-[#E5E7EB] transition duration-200 ease-in-out"
                >
                  <FaUsers className="mr-2" />
                  <span>{selectedEvent.signed_up_users.length} People Going</span>
                </button>
                {showPeople && (
                  <div className="mt-4 max-h-40 overflow-y-auto">
                    {Array.from({ length: selectedEvent.people }).map(
                      (_, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <img
                            src={`https://via.placeholder.com/32x32?text=P${index + 1
                              }`}
                            alt={`Person ${index + 1}`}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <span className="text-[#E5E7EB]">
                            Person {index + 1}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )} */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ConfirmModal
        key="rsvp-modal"
        isOpen={RSVPModalOpen}
        title="RSVP Confirmation"
        description="Are you sure you want to RSVP to this event?"
        confirmText="RSVP"
        cancelText="Cancel"
        onConfirm={handleRSVP}
        onCancel={closeRSVPModal}
      />
    </div>
  );
};

export default EventsPage;
