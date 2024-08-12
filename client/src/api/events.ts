import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api/base";
import axios from "axios";
import { Event, EventCreate } from "@/store/interfaces";
import { useSelector } from "react-redux";
import { selectAuthUser } from "@/store/store";

export const getAllEvents = createAsyncThunk("getAllEvents", async () => {
  try {
    const response = await api.get(`/events`, {});

    // Convert Axios headers to a plain object
    const headers = { ...response.headers };
    return { ...response.data, headers };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
});

export const creatEvent = createAsyncThunk(
  "createEvent",
  async (eventData: EventCreate, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/events",
        {
          ...eventData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Convert Axios headers to a plain object
      const headers = { ...response.headers };
      return { ...response.data, headers };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error creating event: ", error.message);
        return rejectWithValue(error.response?.data);
      }

      return rejectWithValue(
        `An unknown error has orccured. Please try again.\n${error}`
      );
    }
  }
);

export const updateEvent = createAsyncThunk(
  "updateEvent",
  async (updateData: Event, { rejectWithValue }) => {
    try {
      const { token } = useSelector(selectAuthUser);

      const response = await api.put(
        `/events/${updateData.event_id}`,
        { updateData },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Convert Axios headers to a plain object
      const headers = { ...response.headers };
      return { ...response.data, headers };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error updating event: ", error.message);
        return rejectWithValue(error.response?.data);
      }

      return rejectWithValue(
        `An unknown error has orccured. Please try again.\n${error}`
      );
    }
  }
);
