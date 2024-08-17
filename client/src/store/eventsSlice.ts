import { createSlice } from "@reduxjs/toolkit";
import { EventState } from "@/constants/interfaces";
import { getAllEvents } from "@/api/events";

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    fetchStatus: "loading",
  } as EventState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllEvents.pending, (state) => {
      state.fetchStatus = "loading";
    });
    builder.addCase(getAllEvents.fulfilled, (state, action) => {
      state.events = action.payload;
      state.fetchStatus = "success";
    });
    builder.addCase(getAllEvents.rejected, (state) => {
      state.fetchStatus = "error";
    });
  },
});

export const {} = eventsSlice.actions;

export default eventsSlice.reducer;
