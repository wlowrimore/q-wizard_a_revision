"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  useSession,
  signIn as signInNextAuth,
  signOut as signOutNextAuth,
  signIn,
  signOut,
} from "next-auth/react";

export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

export interface UserContextProps {
  children: React.ReactNode;
}

export interface UserContextType {
  user: User | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  signIn: async () => {},
  signOut: async () => {},
});

export const UserProvider: React.FC<UserContextProps> = ({ children }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);

  // local storage logic
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  // local storage update logic
  useEffect(() => {
    if (user) {
      const userToStore = { ...user };
      localStorage.setItem("user", JSON.stringify(userToStore));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // useEffect(() => {
  //   if (session?.user) {
  //     const { id, name, email, image } = session.user as {
  //       id: string | null;
  //       name?: string | null;
  //       email?: string | null;
  //       image?: string | null;
  //     };

  //     setUser({
  //       id: id ?? "",
  //       name: name ?? "",
  //       email: email ?? "",
  //       image: image ?? "",
  //     });
  //   } else {
  //     setUser(null);
  //   }
  // }, [session]);

  return (
    <UserContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
};
