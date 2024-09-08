import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./base";
import axios from "axios";
import { Event, EventCreate } from "@/constants/interfaces";

export const getAllEvents = createAsyncThunk(
  "events/getAllEvents",
  async (_, { rejectWithValue }) => {
    try {
      const authUser = localStorage.getItem("authUser") || null;
      if (!authUser) {
        return rejectWithValue("No user is logged in.");
      }
      const { token } = JSON.parse(authUser);

      const response = await api.get(`/events`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching events: ", error.response?.data);
        return rejectWithValue(error.response?.data);
      }

      console.error("Error fetching events: ", error);
      return rejectWithValue(
        `An unknown error has occurred. Please try again.\n${error}`
      );
    }
  }
);

export const getHostedEvents = createAsyncThunk(
  "events/getHostedEvents",
  async (_, { rejectWithValue }) => {
    try {
      const authUser = localStorage.getItem("authUser") || null;
      if (!authUser) {
        return rejectWithValue("No user is logged in.");
      }
      const { token } = JSON.parse(authUser);

      const response = await api.get(`/events/hosted`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching events: ", error.response?.data);
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
  "events/createEvent",
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
  "events/updateEvent",
  async (updateData: Event, { rejectWithValue }) => {
    try {
      const authUser = localStorage.getItem("authUser") || null;
      if (!authUser) {
        return rejectWithValue("No user is logged in.");
      }

      const { token } = JSON.parse(authUser);

      const response = await api.put(
        `/events/${updateData.event_id}`,
        { ...updateData },
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

export const RSVPUserInEvent = createAsyncThunk(
  "events/RSVPUserInEvent",
  async (updateData: Event, { rejectWithValue }) => {
    try {
      const authUser = localStorage.getItem("authUser") || null;
      if (!authUser) {
        return rejectWithValue("No user is logged in.");
      }

      const { token } = JSON.parse(authUser);

      const response = await api.put(
        `/events/${updateData.event_id}/rsvp`,
        {
          ...updateData,
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
        console.error("Error RSVPing user in event: ", error.message);
        return rejectWithValue(error.response?.data);
      }

      return rejectWithValue(
        `An unknown error has orccured. Please try again.\n${error}`
      );
    }
  }
);

export const endEvent = createAsyncThunk(
  "events/endEvent",
  async (event_id: number, { rejectWithValue }) => {
    try {
      const authUser = localStorage.getItem("authUser") || null;
      if (!authUser) {
        return rejectWithValue("No user is logged in.");
      }

      const { token } = JSON.parse(authUser);

      const response = await api.put(
        `/events/${event_id}/end`,
        {},
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
        console.error("Error ending event: ", error.message);
        return rejectWithValue(error.response?.data);
      }

      return rejectWithValue(
        `An unknown error has orccured. Please try again.\n${error}`
      );
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (event_id: number, { rejectWithValue }) => {
    try {
      const authUser = localStorage.getItem("authUser") || null;
      if (!authUser) {
        return rejectWithValue("No user is logged in.");
      }

      const { token } = JSON.parse(authUser);

      const response = await api.delete(`/events/${event_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Convert Axios headers to a plain object
      const headers = { ...response.headers };
      return { ...response.data, headers };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error deleting event: ", error.message);
        return rejectWithValue(error.response?.data);
      }

      return rejectWithValue(
        `An unknown error has orccured. Please try again.\n${error}`
      );
    }
  }
);
