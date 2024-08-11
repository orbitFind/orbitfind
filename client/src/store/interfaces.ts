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
}

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
}

export interface AuthState {
  authUser: AuthUser | null;
}

export type { UserState, User };
