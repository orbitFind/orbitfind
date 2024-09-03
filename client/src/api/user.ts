import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "./base";
import { User } from "@/constants/interfaces";

export const getUser = createAsyncThunk(
  "getUser",
  async (_, { rejectWithValue }) => {
    try {
      const authUser = localStorage.getItem("authUser") || null;
      if (!authUser) {
        return rejectWithValue("No user is logged in.");
      }

      const { token, refreshToken, user } = JSON.parse(authUser);

      const response = await api.get(`/users/${user.uid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          RefreshToken: refreshToken,
        },
      });

      return response.data;
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
  async (userData: User, { rejectWithValue }) => {
    try {
      const authUser = localStorage.getItem("authUser") || null;
      if (!authUser) {
        return rejectWithValue("No user is logged in.");
      }

      const { token, refreshToken, user } = JSON.parse(authUser);

      const response = await api.put(`/users/${user.uid}`, userData, {
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

export const syncUsers = createAsyncThunk(
  "syncUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/sync_users");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error syncing users: ", error.message);
        return rejectWithValue(error.response?.data);
      }

      return rejectWithValue(
        `An unknown error has occurred. Please try again.\n${error}`
      );
    }
  }
);
