import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, AuthUser } from "@/store/interfaces";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
  } as AuthState,
  reducers: {
    setAuthUser(state, action: PayloadAction<AuthUser>) {
      const user = action.payload;
      state.authUser = user;
    },
    clearAuthUser(state) {
      state.authUser = null;
    },
  },
});

export const { setAuthUser, clearAuthUser } = authSlice.actions;
export default authSlice.reducer;
