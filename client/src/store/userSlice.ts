import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserState } from "@/constants/interfaces";
import { updateUser } from "@/api/user";
import { isValidEmail } from "@/lib/utils";
// import {} from "@/api/users";

const dummyEvent = {
  event_id: 6246724424,
  name: "Anonymous Get-together",
  description: "Hello world",
  status: "before",
  tags: ["live", "anonymous"],
  date_start: new Date(Date.now()).toISOString(),
  date_end: new Date(Date.now()).toISOString(),
  hosted_by: "135g42v4g256g",
};

const dummyData = {
  id: "135g42v4g256g",
  email: "johndoe15@example.com",
  password: "",
  username: "johndoe15",
  fullName: "John Doe",
  bio: "Hello world",
  profilePic: "https://via.placeholder.com/150x150?text=JD",
  signedUpTo: [],
  hostedEvents: [dummyEvent],
  completedEvents: [],
  badges: [],
  achievements: [],
};

export const userSlice = createSlice({
  name: "task",
  initialState: {
    user: dummyData,
    fetchStatus: null,
    error: null,
  } as UserState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.user.username = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      if (!isValidEmail(action.payload)) {
        state.error = "Invalid email address.";
      }
      state.user.email = action.payload;
    },
    setBio: (state, action: PayloadAction<string>) => {
      state.user.bio = action.payload;
    },
    setFullName: (state, action: PayloadAction<string>) => {
      state.user.fullName = action.payload;
    },
    setProfilePic: (state, action: PayloadAction<string>) => {
      state.user.profilePic = action.payload;
    },
    setUserError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.fetchStatus = "success";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.fetchStatus = "error";
        state.error = action.error.message!;
      });
  },
});

export const {
  setUser,
  setUsername,
  setFullName,
  setBio,
  setEmail,
  setProfilePic,
  setUserError,
} = userSlice.actions;
export default userSlice.reducer;
