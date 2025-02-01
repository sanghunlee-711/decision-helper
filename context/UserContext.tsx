import { createContext, useContext } from "react";
import { User } from "firebase/auth";

export const UserContext = createContext<User | null>(null);

export const useUser = () => useContext(UserContext);
