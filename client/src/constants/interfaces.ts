export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  token: string;
  signedUpTo: Event[]; // Add the events property to the User interface
  hostedEvents: Event[];
  completedEvents: Event[];
  badges: Badge[];
  achievements: Achievement[];
}

export interface UserState {
  user: User;
  fetchStatus: string;
}

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
}

export interface AuthState {
  authUser: AuthUser | null;
  token: string | null;
}

export interface Event {
  event_id: number;
  name: string;
  description: string;
  badges?: Badge[];
  status: "before" | "ongoing" | "completed";
  tags: string[];
  date_start: Date;
  date_end: Date;
  hosted_by: string;
}

export interface EventCreate {
  name: string;
  description: string;
  badges?: Badge[];
  region: string;
  location: string;
  tags: string[];
  date_start: Date;
  date_end: Date;
}

export interface EventState {
  events: Event[];
  fetchStatus: "loading" | "success" | "error" | null;
}

export interface Badge {
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

export interface Achievement {
  achievementId: string;
  name: string;
  userId: string;
  badgeId?: string;
  noToCompletion: number;
  progress: number;
  completed: boolean;
}
