interface UserState {
  user: User;
  fetchStatus: string;
}

interface User {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  token: string;
  events: Event[]; // Add the events property to the User interface
}
export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
}

export interface AuthState {
  authUser: AuthUser | null;
}

interface Event {
  event_id: number;
  name: string;
  description: string;
  badges: Badge[];
  status: "before" | "ongoing" | "completed";
  date_start: Date;
  date_end: Date;
}

export interface EventState {
  events: Event[];
  fetchStatus: "loading" | "success" | "error" | null;
}

interface Badge {
  badge_id: string;
  name: string;
}
export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
}

export interface AuthState {
  authUser: AuthUser | null;
}

export type { UserState, User, Event };
