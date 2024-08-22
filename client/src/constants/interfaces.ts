export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  fullName: string;
  bio: string;
  profilePic: string;
  signedUpTo: Event[]; // Add the events property to the User interface
  hostedEvents: Event[];
  completedEvents: Event[];
  badges: Badge[];
  achievements: Achievement[];
}

export interface UserState {
  user: User;
  fetchStatus: "success" | "loading" | "error" | null;
  error: string | null;
}

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
}

export interface AuthState {
  authUser: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
}

export interface Event {
  event_id: number;
  name: string;
  description: string;
  badges?: Badge[];
  region: string;
  location: string;
  category: string;
  people: number;
  status: "before" | "ongoing" | "completed";
  tags: string[];
  date_start: string; // YYYY-MM-DD
  date_end: string; // YYYY-MM-DD
  hosted_by: string;
}

export interface EventCreate {
  name: string;
  description: string;
  badges?: Badge[];
  region: string;
  location: string;
  tags: string[];
  date_start: string; // YYYY-MM-DD
  date_end: string; // YYYY-MM-DD
}

export interface EventState {
  events: Event[];
  fetchStatus: "loading" | "success" | "error" | null;
}

export interface Badge {
  badge_id: string;
  name: string;
}

export interface Achievement {
  achievementId: string;
  name: string;
  userId: string;
  badgeId?: string;
  noToCompletion: number;
  progress: number;
  completed: boolean;
}
