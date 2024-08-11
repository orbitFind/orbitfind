import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import store from "@/store/store";
import { setAuthUser, clearAuthUser } from "@/store/authSlice";

// Initialize Firebase Auth
const auth = getAuth();

export const setupAuthListener = () => {
  onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      store.dispatch(
        setAuthUser({
          uid: user.uid,
          email: user.email || "",
          displayName: user.displayName || "",
        })
      );
    } else {
      store.dispatch(clearAuthUser());
    }
  });
};
