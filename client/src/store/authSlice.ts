import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, AuthUser } from "@/constants/interfaces";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    token: null,
    fetchStatus: null,
  } as AuthState,
  reducers: {
    setAuthUser(
      state,
      action: PayloadAction<{
        authUser: AuthUser;
        token: string;
      }>
    ) {
      const { authUser, token } = action.payload;
      state.fetchStatus = "loading";
      state.authUser = authUser;
      state.token = token;

      if (authUser && token) {
        state.fetchStatus = "success";
      } else {
        state.fetchStatus = "error";
      }
    },
    clearAuthUser(state) {
      state.authUser = null;
      state.token = null;
      state.fetchStatus = null;
    },
  },
});

export const { setAuthUser, clearAuthUser } = authSlice.actions;
export default authSlice.reducer;
