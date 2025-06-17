"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { supabase } from "./supabase";

type AppUser = {
  id: string;
  email: string;
  name: string;
  favorites: string[];
};

interface AuthContextType {
  user: AppUser | null;
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
  toggleFavorite: (brandId: string) => Promise<void>;
  isFavorite: (brandId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch favorites from Supabase for the logged-in user
  const fetchFavorites = async (userId: string) => {
    const { data, error } = await supabase
      .from("favorites")
      .select("esg_id")
      .eq("user_id", userId);
    if (error) return [];
    return data.map((fav: { esg_id: string }) => fav.esg_id);
  };

  useEffect(() => {
    let mounted = true;

    // On mount, get the current session
    supabase.auth.getSession().then(async ({ data }) => {
      if (mounted && data.session?.user) {
        const { id, email, user_metadata } = data.session.user;
        const favorites = await fetchFavorites(id);
        setUser({
          id,
          email: email ?? "",
          name: user_metadata?.name ?? "",
          favorites,
        });
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { id, email, user_metadata } = session.user;
          const favorites = await fetchFavorites(id);
          setUser({
            id,
            email: email ?? "",
            name: user_metadata?.name ?? "",
            favorites,
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      mounted = false;
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

    if (error || !data.session?.user) {
      return { success: false, error: error?.message || "Login failed" };
    }

    const { id, email: userEmail, user_metadata } = data.session.user;
    const favorites = await fetchFavorites(id);

    setUser({
      id,
      email: userEmail ?? "",
      name: user_metadata?.name ?? "",
      favorites,
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

    setUser({
      id: data.user.id,
      email: email,
      name: name,
      favorites: [],
    });
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Toggle favorite (local only, no DB)
  const toggleFavorite = async (brandId: string) => {
    if (!user) return;

    const isFav = user.favorites.includes(brandId);

    if (isFav) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("esg_id", brandId);

      if (error) {
        console.error("Failed to remove favorite:", error.message);
        return;
      }

      setUser({
        ...user,
        favorites: user.favorites.filter((id) => id !== brandId),
      });
    } else {
      const { error } = await supabase.from("favorites").insert([
        {
          user_id: user.id,
          esg_id: brandId,
        },
      ]);

      if (error) {
        console.error("Failed to add favorite:", error.message);
        return;
      }

      setUser({
        ...user,
        favorites: [...user.favorites, brandId],
      });
    }
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
