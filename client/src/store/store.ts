import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import userReducer from "@/store/userSlice";
import authReducer from "@/store/authSlice";
import eventsReducer from "@/store/eventsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    authUser: authReducer,
    events: eventsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export const selectUser = (state: RootState) => state.user;
export const selectAuthUser = (state: RootState) => state.authUser;
export const selectEvents = (state: RootState) => state.events;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>(); // Export a hook that can be reused to resolve types

export default store;
