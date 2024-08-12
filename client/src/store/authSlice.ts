import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, AuthUser } from "@/store/interfaces";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    token: null,
  } as AuthState,
  reducers: {
    setAuthUser(
      state,
      action: PayloadAction<{ authUser: AuthUser; token: string }>
    ) {
      const { authUser, token } = action.payload;
      state.authUser = authUser;
      state.token = token;
    },
    clearAuthUser(state) {
      state.authUser = null;
    },
  },
});

export const { setAuthUser, clearAuthUser } = authSlice.actions;
export default authSlice.reducer;
