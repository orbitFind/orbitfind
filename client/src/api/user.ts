import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "./base";
import { selectAuthUser } from "@/store/store";
import { useSelector } from "react-redux";
import { User } from "@/constants/interfaces";

export const getUser = createAsyncThunk(
  "getUser",
  async (_, { rejectWithValue }) => {
    try {
      const { token } = useSelector(selectAuthUser);
      const response = await api.get("/users/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
  async (userData: User, { rejectWithValue }) => {
    try {
      const { token } = useSelector(selectAuthUser);
      const response = await api.put("/users/me", userData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
  async (_, { rejectWithValue }) => {
    try {
      const { token } = useSelector(selectAuthUser);
      const response = await api.delete("/users/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
