import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Event, EventState } from "@/constants/interfaces";
import {
  getAllEvents,
  createEvent,
  getHostedEvents,
  deleteEvent,
} from "@/api/events";

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    fetchStatus: "loading",
  } as EventState,
  reducers: {
    setEvents: (state, action: PayloadAction<EventState>) => {
      state.events = action.payload.events;
      state.fetchStatus = action.payload.fetchStatus;
    },
    setSpecificEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex(
        (event) => event.event_id === action.payload.event_id
      );
      state.events[index] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllEvents.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.events = action.payload;
        state.fetchStatus = "success";
      })
      .addCase(getAllEvents.rejected, (state) => {
        state.fetchStatus = "error";
      })
      .addCase(createEvent.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
        state.fetchStatus = "success";
      })
      .addCase(createEvent.rejected, (state) => {
        state.fetchStatus = "error";
      })
      .addCase(getHostedEvents.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(getHostedEvents.fulfilled, (state, action) => {
        state.events = action.payload;
        state.fetchStatus = "success";
        setEvents(action.payload);
      })
      .addCase(getHostedEvents.rejected, (state) => {
        state.fetchStatus = "error";
      })
      .addCase(deleteEvent.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        const newEvents = state.events.filter(
          (event) => event.event_id !== action.payload
        );
        setEvents({ events: newEvents, fetchStatus: "success" });
      })
      .addCase(deleteEvent.rejected, (state) => {
        state.fetchStatus = "error";
      });
  },
});

export const { setEvents } = eventsSlice.actions;

export default eventsSlice.reducer;
