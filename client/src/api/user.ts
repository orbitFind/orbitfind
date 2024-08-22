import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "./base";
import { User } from "@/constants/interfaces";

export const getUser = createAsyncThunk(
  "getUser",
  async (
    { token, refreshToken }: { token: string; refreshToken: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get("/users/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          RefreshToken: refreshToken,
        },
      });
      const headers = { ...response.headers };
      return { ...response.data, headers };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching user: ", error.message);
        return rejectWithValue(error.response?.data);
      }

      return rejectWithValue(
        `An unknown error has occurred. Please try again.\n${error}`
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "updateUser",
  async (
    {
      userData,
      token,
      refreshToken,
    }: { userData: User; token: string; refreshToken: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put("/users/me", userData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          RefreshToken: refreshToken,
        },
      });
      const headers = { ...response.headers };
      return { ...response.data, headers };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error updating user: ", error.message);
        return rejectWithValue(error.response?.data);
      }

      return rejectWithValue(
        `An unknown error has occurred. Please try again.\n${error}`
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "deleteUser",
  async (
    { token, refreshToken }: { token: string; refreshToken: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.delete("/users/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          RefreshToken: refreshToken,
        },
      });
      const headers = { ...response.headers };
      return { ...response.data, headers };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error deleting user: ", error.message);
        return rejectWithValue(error.response?.data);
      }

      return rejectWithValue(
        `An unknown error has occurred. Please try again.\n${error}`
      );
    }
  }
);
