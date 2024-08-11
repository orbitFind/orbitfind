import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserState } from "@/store/interfaces";
import {} from "@/api/users";

export const userSlice = createSlice({
  name: "task",
  initialState: {
    user: {},
    fetchStatus: "",
  } as UserState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(postNewTask.fulfilled, (state, action) => {
  //       state.fetchStatus = "success";
  //     })
  //     .addCase(postNewTask.pending, (state) => {
  //       state.fetchStatus = "loading";
  //     })
  //     .addCase(postNewTask.rejected, (state) => {
  //       state.fetchStatus = "error";
  //     });
  // },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
