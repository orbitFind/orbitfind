import React, { FormEvent, useEffect, useState } from "react";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaCalendarAlt,
  FaHome,
  FaTimes,
  FaUsers,
  FaCog,
  FaEdit,
  FaSave,
  FaTrash,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Event } from "@/constants/interfaces";
import { useSelector } from "react-redux";
import { selectEvents, selectUser, useAppDispatch } from "@/store/store";
import { deleteEvent, getHostedEvents, updateEvent } from "@/api/events";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "@/components/ui/confirmModal";
import { Input } from "@/components/ui/input";
import SignInUsers from "@/components/admin/SignInUsers";
import EndEvent from "@/components/admin/EndEvent";
import CompletedHostEvents from "@/components/admin/CompletedHostEvents";
import { getUser } from "@/api/user";
import { useToast } from "@/components/ui/use-toast";

const EventsManage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  // const [showAttendees, setShowAttendees] = useState(false);
  const [editableEvent, setEditableEvent] = useState<Event | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteEvent, setSelectedDeleteEvent] = useState<Event | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { events } = useSelector(selectEvents);
  const { user } = useSelector(selectUser)

  const fetchEvents = async () => {
    await dispatch(getHostedEvents()).unwrap().catch((error) => {
      console.error("Error fetching hosted events:", error);
      navigate("/auth");
    });
  }

  const fetchUser = async () => {
    await dispatch(getUser()).unwrap().catch((error) => {
      console.error("Error fetching user:", error);
      navigate("/auth");
    });
  }

  useEffect(() => {
    fetchEvents();
    fetchUser();
  }, [])

  const handleMoreInfo = (event: Event) => {
    setSelectedEvent(event);
    setEditableEvent({ ...event });
    setStartDate(new Date(event.date_start));
    setEndDate(new Date(event.date_end));
    console.log(event.signed_up_users)
  };

  const handleClose = () => {
    setSelectedEvent(null);
    setEditableEvent(null);
  };

  // const handleToggleAttendees = () => {
  //   setShowAttendees(!showAttendees);
  // };

  const handleSaveChanges = async (e: FormEvent) => {
    e.preventDefault();
    if (editableEvent) {
      if (new Date(editableEvent.date_start) > new Date(editableEvent.date_end)) {
        toast({ title: "Error", description: "Start date cannot be after end date.", variant: "destructive" });
        return;
      }

      if (new Date(editableEvent.date_start) < new Date() || new Date(editableEvent.date_end) < new Date()) {
        toast({ title: "Error", description: "Event dates cannot be in the past.", variant: "destructive" });
        return;
      }

      try {
        await dispatch(updateEvent(editableEvent)).unwrap();
        console.log("Event updated successfully.");
        toast({ title: "Success", description: "Event updated successfully.", variant: "default" });
        handleClose();
        await fetchEvents(); // Refetch events
      } catch (error) {
        console.error("Error updating event:", error);
        toast({ title: "Error", description: "Error updating event.", variant: "destructive" });
      }
    }
  };

  const handleDeleteModal = (event: Event) => {
    setSelectedDeleteEvent(event);
    setDeleteModalOpen(true);
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const newDate = new Date(e.target.value);
    setStartDate(newDate);
    setEditableEvent({ ...editableEvent!, date_start: newDate.toUTCString() });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const newDate = new Date(e.target.value);
    setEndDate(newDate);
    setEditableEvent({ ...editableEvent!, date_end: newDate.toUTCString() });
  }

  const handleDeleteEvent = (eventId: number) => {
    console.log("Deleting event:", eventId);
    if (eventId === -1) return;

    const authUser = localStorage.getItem("authUser") || null;
    if (!authUser) {
      console.error("No user is logged in.");
      toast({ title: "Error", description: "No user is logged in.", variant: "destructive" });
      return;
    }

    console.log("Deleting event:", eventId);
    dispatch(deleteEvent(eventId)).unwrap().then(() => {
      console.log("Event deleted successfully.");
      alert("Event deleted successfully.");
      setDeleteModalOpen(false);

      // Refetch events
      toast({ title: "Success", description: "Event deleted successfully.", variant: "default" });
      fetchEvents();
    }).catch((error) => {
      console.error("Error deleting event:", error);
      toast({ title: "Error", description: "Error deleting event.", variant: "destructive" });
    });
  };

  const navigateHome = () => {
    navigate("/events");
  }

  const navigateCreate = () => {
    navigate("/events/create");
  }

  // // DatePicker Wrapper
  // const DatePickerWrapper: React.FC<{
  //   selected: Date | null;
  //   onChange: (date: Date | null) => void;
  // }> = ({ selected, onChange }) => {
  //   return (
  //     <DatePicker
  //       selected={selected}
  //       onChange={onChange}
  //       className="bg-gray-700 text-gray-200 p-3 rounded-lg w-full border border-gray-600"
  //       dateFormat="yyyy-MM-dd"
  //     />
  //   );
  // };

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
          <button className="flex items-center space-x-2 p-2 rounded-lg" onClick={navigateHome}>
            <FaHome className="text-xl text-gray-400" />
            <span className="text-lg">Home</span>
          </button>
          <button className="flex items-center space-x-2 p-2 rounded-lg" onClick={navigateCreate}>
            <FaCalendarAlt className="text-xl text-gray-400" />
            <span className="text-lg">Create Events</span>
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

        <h2 className="text-2xl font-semibold mx-6 mt-6">
          Upcoming Events
        </h2>


        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {events.filter(event => event.status !== "completed").length > 0 ? events?.filter(event => event.status !== "completed").map((event) => (
            <motion.div
              key={event.event_id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col h-full border border-gray-700"
              transition={{ duration: 0.3 }}
            >
              <div>
                {event.status === "before" && (
                  <div className="bg-[#FFA500] text-white px-2 py-1 rounded-lg mb-4 font-bold">
                    Starts in {Math.floor((new Date(event.date_start).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) < 1 ? `${Math.floor((new Date(event.date_start).getTime() - new Date().getTime()) / (1000 * 60 * 60))} hours` : `${Math.floor((new Date(event.date_start).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`}
                  </div>
                )}
                {event.status === "ongoing" && (
                  <div className="bg-[#FF0000] text-white px-2 py-1 rounded-lg mb-4 font-bold">
                    • LIVE
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">
                  {event.name}
                </h3>
                <div className="flex items-center text-gray-400 mb-4">
                  <FaCalendarAlt className="mr-2" />
                  <span>{new Date(event.date_start).toLocaleString()}</span>
                </div>
                <div className="flex items-center text-gray-400 mb-4">
                  <FaCalendarAlt className="mr-2" />
                  <span>{new Date(event.date_end).toLocaleString()}</span>
                </div>
                <div className="flex items-center text-gray-400 mb-4">
                  <FaUsers className="mr-2" />
                  <span>{event.signed_up_users.length} People RSVP'd</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-auto">
                <button
                  onClick={() => handleMoreInfo(event)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center space-x-2"
                >
                  <FaEdit />
                  <span>Manage</span>
                </button>
                {event.status === "before" && (
                  <button
                    onClick={() => handleDeleteModal(event)}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg flex items-center space-x-2"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </motion.div>
          )) : (
            <div className="text-gray-400 w-full">
              <p>No upcoming events.</p>
            </div>
          )}
        </motion.div>
        <h2 className="text-2xl font-semibold m-6">
          Completed Events
        </h2>
        <CompletedHostEvents user={user!} />
      </div>



      {/* Modal for Event Management */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-y-scroll"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-800 w-full max-w-lg p-8 rounded-lg shadow-xl relative overflow-y-auto"
            >
              {/* <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 text-lg"
              >
                <FaTimes />
              </button> */}

              {/* Event Management Form */}
              <form onSubmit={handleSaveChanges}>
                <h2 className="text-2xl font-semibold my-6">
                  Manage {editableEvent?.name}
                </h2>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className={`block text-gray-400 mb-1`}>Title</label>
                    {editableEvent?.status === "ongoing" ? (
                      <div className="bg-red-600 text-white py-2 rounded-lg w-full">
                        {editableEvent?.name}
                      </div>
                    ) : (
                      <Input
                        type="text"
                        value={editableEvent?.name || ''}
                        onChange={(e) => setEditableEvent({ ...editableEvent!, name: e.target.value })}
                        className={`bg-gray-700 text-gray-200 p-3 rounded-lg w-full border border-gray-600`}
                      />
                    )
                    }

                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Start Date</label>
                    {editableEvent?.status === "ongoing" ? (
                      <div className="bg-red-600 text-white py-2 rounded-lg w-full">
                        {startDate?.toLocaleString()}
                      </div>
                    ) : (
                      <Input
                        type="date"
                        value={startDate?.toISOString().split('T')[0]}
                        onChange={handleStartDateChange}
                        className="bg-gray-700 text-gray-200 p-3 rounded-lg w-full border border-gray-600"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">End Date</label>
                    {editableEvent?.status === "ongoing" ? (
                      <div className="bg-red-600 text-white py-2 rounded-lg w-full">
                        {endDate?.toLocaleString()}
                      </div>
                    ) : (
                      <Input
                        type="date"
                        value={endDate?.toISOString().split('T')[0]}
                        onChange={handleEndDateChange}
                        className="bg-gray-700 text-gray-200 p-3 rounded-lg w-full border border-gray-600"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Location</label>
                    {editableEvent?.status === "ongoing" ? (
                      <div className="bg-red-600 text-white py-2 rounded-lg w-full">
                        {editableEvent?.location}
                      </div>
                    ) : (
                      <Input
                        type="text"
                        value={editableEvent?.location || ''}
                        onChange={(e) => setEditableEvent({ ...editableEvent!, location: e.target.value })}
                        className="bg-gray-700 text-gray-200 p-3 rounded-lg w-full border border-gray-600"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Region</label>
                    {editableEvent?.status === "ongoing" ? (
                      <div className="bg-red-600 text-white py-2 rounded-lg w-full">
                        {editableEvent?.region}
                      </div>
                    ) : (
                      <Input
                        type="text"
                        value={editableEvent?.region || ''}
                        onChange={(e) => setEditableEvent({ ...editableEvent!, region: e.target.value })}
                        className="bg-gray-700 text-gray-200 p-3 rounded-lg w-full border border-gray-600"
                      />
                    )}
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

                  {/* Sign In Users */}
                  {selectedEvent.status === "before" ? (
                    <div className="flex flex-col w-full">
                      <h3 className="text-lg font-semibold mb-2">Sign In Users</h3>
                      <p className="text-gray-400">Portal will open when the event is live.</p>
                    </div>
                  ) :
                    selectedEvent.status === "ongoing" &&
                      selectedEvent.signed_up_users?.length > 0 ? (
                      <div className="flex flex-col items-center w-full">
                        <SignInUsers event={selectedEvent} />
                      </div>
                    ) : (
                      <div className="flex flex-col w-full">
                        <h3 className="text-lg font-semibold mb-2">No users signed up</h3>
                        <p className="text-gray-400">No users have signed up for this event yet.</p>
                      </div>
                    )}

                  {/* Attendees
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
                  </div> */}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded-lg flex items-center space-x-2"
                  >
                    <FaSave />
                    <span>Save</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg flex items-center space-x-2"
                  >
                    <FaTimes />
                    <span>Cancel</span>
                  </button>
                  <EndEvent event={selectedEvent} setSelectedEvent={setSelectedEvent} />
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ConfirmModal
        key="delete-event-modal"
        isOpen={deleteModalOpen}
        title="Delete Event"
        description="Are you sure you want to delete this event?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => handleDeleteEvent(selectedDeleteEvent?.event_id || -1)}
        onCancel={() => setDeleteModalOpen(false)} />
    </div>
  );
};

export default EventsManage;
