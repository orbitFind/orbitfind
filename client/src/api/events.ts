import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./base";
import axios from "axios";
import { Event, EventCreate } from "@/constants/interfaces";
import { useSelector } from "react-redux";
import { selectAuthUser } from "@/store/store";

export const getAllEvents = createAsyncThunk(
  "getAllEvents",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/events`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching events: ", error.message);
        return rejectWithValue(error.response?.data);
      }

      console.error("Error fetching events: ", error);
      return rejectWithValue(
        `An unknown error has occurred. Please try again.\n${error}`
      );
    }
  }
);

export const createEvent = createAsyncThunk(
  "createEvent",
  async (
    { eventData, token }: { eventData: EventCreate; token: string },
    { rejectWithValue }
  ) => {
    try {
      console.log(eventData);

      const response = await api.post(
        "/events",
        {
          ...eventData,
          status: "before",
        },
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
        console.error("Error creating event: ", error.message);
        return rejectWithValue(error.response?.data);
      }

      console.error("Error creating event: ", error);
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
