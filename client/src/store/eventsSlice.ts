import { createSlice } from "@reduxjs/toolkit";
import { EventState } from "@/constants/interfaces";
import { getAllEvents, createEvent } from "@/api/events";

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    fetchStatus: "loading",
  } as EventState,
  reducers: {},
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
      });
  },
});

export const {} = eventsSlice.actions;

export default eventsSlice.reducer;
