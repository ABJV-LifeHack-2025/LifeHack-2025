"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "./types";
import { supabase } from "./supabaseClient";

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  toggleFavorite: (brandId: string) => void;
  isFavorite: (brandId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database for demo
const mockUsers: User[] = [
  {
    id: "1",
    email: "demo@example.com",
    name: "Demo User",
    favorites: ["6", "5"], // Patagonia and Apple as initial favorites
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem("user");
    const savedUsers = localStorage.getItem("users");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email ?? "",
            name: session.user.user_metadata?.name ?? "",
            favorites: [],
          });
        } else {
          setUser(null);
        }
      }
    );

    // On mount, check for existing session
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email ?? "",
          name: data.user.user_metadata?.name ?? "",
          favorites: [],
        });
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { success: false, error: error.message };
    }
    setUser({
      id: data.user?.id ?? "",
      email: data.user?.email ?? "",
      name: data.user?.user_metadata?.name ?? "",
      favorites: [], // You may want to fetch this from a profile table
    });
    return { success: true };
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    if (error || !data.user) {
      return { success: false, error: error?.message || "Signup failed" };
    }

    // Insert into profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: data.user.id, // Must match auth.users id
          name: name,
          email: email,
        },
      ]);
    if (profileError) {
      return { success: false, error: profileError.message };
    }

    setUser({
      id: data.user.id,
      email: data.user.email ?? "",
      name: name,
      favorites: [],
    });
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const toggleFavorite = (brandId: string) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      favorites: user.favorites.includes(brandId)
        ? user.favorites.filter((id) => id !== brandId)
        : [...user.favorites, brandId],
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Update users array
    const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u));
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const isFavorite = (brandId: string): boolean => {
    return user?.favorites.includes(brandId) || false;
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, toggleFavorite, isFavorite }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
