import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api/base";
import axios from "axios";

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
