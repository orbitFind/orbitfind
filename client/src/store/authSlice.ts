import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, AuthUser } from "@/constants/interfaces";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    token: null,
    refreshToken: null,
  } as AuthState,
  reducers: {
    setAuthUser(
      state,
      action: PayloadAction<{
        authUser: AuthUser;
        token: string;
        refreshToken: string;
      }>
    ) {
      const { authUser, token, refreshToken } = action.payload;

      state.authUser = authUser;
      state.token = token;
      state.refreshToken = refreshToken;
    },
    clearAuthUser(state) {
      state.authUser = null;
    },
  },
});

export const { setAuthUser, clearAuthUser } = authSlice.actions;
export default authSlice.reducer;
