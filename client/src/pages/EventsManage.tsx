import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaCalendarAlt,
  FaHome,
  FaTimes,
  FaUsers,
  FaCog,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTrash,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { events } from "@/constants"; // Assuming events are defined in constants

interface Event {
  id: number;
  title: string;
  date: string;
  people: number;
  description: string;
  location: string;
  tags: string[];
}

const EventsManage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showAttendees, setShowAttendees] = useState(false);
  const [editableEvent, setEditableEvent] = useState<Event | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);

  const handleMoreInfo = (event: Event) => {
    setSelectedEvent(event);
    setEditableEvent({ ...event });
    setStartDate(new Date(event.date));
  };

  const handleClose = () => {
    setSelectedEvent(null);
    setEditableEvent(null);
  };

  const handleToggleAttendees = () => {
    setShowAttendees(!showAttendees);
  };

  const handleSaveChanges = () => {
    if (editableEvent) {
      console.log("Event updated:", editableEvent);
      // Implement save logic or API call here
    }
  };

  const handleDeleteEvent = (eventId: number) => {
    console.log("Deleting event with ID:", eventId);
    // Implement delete logic or API call here
  };

  // DatePicker Wrapper
  const DatePickerWrapper: React.FC<{
    selected: Date | null;
    onChange: (date: Date | null) => void;
  }> = ({ selected, onChange }) => {
    return (
      <DatePicker
        selected={selected}
        onChange={onChange}
        className="bg-gray-700 text-gray-200 p-3 rounded-lg w-full border border-gray-600"
        dateFormat="yyyy-MM-dd"
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col md:flex-row">
      {/* Sidebar */}
      <motion.div
        className="w-full md:w-1/4 bg-gray-800 p-6 border-r border-gray-700 shadow-lg"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        exit={{ x: -100 }}
      >
        <img
          className="h-20 mb-6 mx-auto"
          src="/Orbitfind.png"
          alt="Logo"
        />
        <nav className="space-y-4">
          <button className="flex items-center space-x-2 p-2 rounded-lg">
            <FaHome className="text-xl text-gray-400" />
            <span className="text-lg">Home</span>
          </button>
          <button className="flex items-center space-x-2 p-2 rounded-lg">
            <FaCalendarAlt className="text-xl text-gray-400" />
            <span className="text-lg">Manage Events</span>
          </button>
          <button className="flex items-center space-x-2 p-2 rounded-lg">
            <FaCog className="text-xl text-gray-400" />
            <span className="text-lg">Settings</span>
          </button>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <motion.div
          className="bg-gray-800 p-4 border-b border-gray-700 shadow-md flex justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-semibold">
            Event Management Dashboard
          </h1>
        </motion.div>

        {/* Events List */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {events.map((event) => (
            <motion.div
              key={event.id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col h-full border border-gray-700"
              transition={{ duration: 0.3 }}
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {event.title}
                </h3>
                <div className="flex items-center text-gray-400 mb-4">
                  <FaCalendarAlt className="mr-2" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-gray-400 mb-4">
                  <FaUsers className="mr-2" />
                  <span>{event.people} People RSVP'd</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-auto">
                <button
                  onClick={() => handleMoreInfo(event)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center space-x-2"
                >
                  <FaEdit />
                  <span>Manage Event</span>
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg flex items-center space-x-2"
                >
                  <FaTrash />
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Modal for Event Management */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-800 w-full max-w-lg p-8 rounded-lg shadow-xl relative overflow-y-auto"
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 text-lg"
              >
                <FaTimes />
              </button>
              <h2 className="text-2xl font-semibold mb-6">
                Manage {editableEvent?.title}
              </h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={editableEvent?.title || ''}
                    onChange={(e) => setEditableEvent({ ...editableEvent!, title: e.target.value })}
                    className="bg-gray-700 text-gray-200 p-3 rounded-lg w-full border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Date</label>
                  <DatePickerWrapper
                    selected={startDate}
                    onChange={(date) => {
                      setStartDate(date);
                      setEditableEvent({ ...editableEvent!, date: date?.toISOString().split('T')[0] || '' });
                    }}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={editableEvent?.location || ''}
                    onChange={(e) => setEditableEvent({ ...editableEvent!, location: e.target.value })}
                    className="bg-gray-700 text-gray-200 p-3 rounded-lg w-full border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Description</label>
                  <textarea
                    value={editableEvent?.description || ''}
                    onChange={(e) => setEditableEvent({ ...editableEvent!, description: e.target.value })}
                    className="bg-gray-700 text-gray-200 p-3 rounded-lg w-full border border-gray-600"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Tags</label>
                  <div className="flex flex-wrap space-x-2">
                    {editableEvent?.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="bg-gray-600 text-gray-200 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Attendees */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Attendees</h3>
                  <button
                    onClick={handleToggleAttendees}
                    className="flex items-center space-x-2 text-gray-400 underline hover:text-gray-200"
                  >
                    <FaUsers className="mr-2" />
                    <span>{editableEvent?.people} People RSVP'd</span>
                  </button>
                  {showAttendees && (
                    <div className="mt-4 max-h-40 overflow-y-auto">
                      {Array.from({ length: editableEvent?.people || 0 }).map((_, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <img
                            src={`https://via.placeholder.com/32x32?text=P${index + 1}`}
                            alt={`Person ${index + 1}`}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <span>{`Person ${index + 1}`}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleSaveChanges}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg flex items-center space-x-2"
                >
                  <FaSave />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={handleClose}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg flex items-center space-x-2"
                >
                  <FaTimes />
                  <span>Cancel</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventsManage;
