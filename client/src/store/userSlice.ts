import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserState } from "@/constants/interfaces";
import { getUser, updateUser } from "@/api/user";
// import {} from "@/api/users";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    fetchStatus: null,
  } as UserState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.fetchStatus = action.payload.fetchStatus;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.fetchStatus = "success";
        state.user = action.payload;
      })
      .addCase(getUser.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(getUser.rejected, (state) => {
        state.fetchStatus = "error";
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.fetchStatus = "success";
        state.user = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(updateUser.rejected, (state) => {
        state.fetchStatus = "error";
      });
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
