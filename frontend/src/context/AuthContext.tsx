import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

export interface User {
  id: number;
  email: string;
  username: string;
  bio?: string;
  timezone: string;
  preferred_theme: string;
  is_dark_mode: boolean;
  streak_freezes_available?: number;
  streak_freezes_used?: number;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (user: string, email: string, pass: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<User>;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const getSavedLocalUser = (): User => {
  try {
    const saved = localStorage.getItem("devbloom_cached_user");
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return {
    id: 1,
    email: "dev@devbloom.local",
    username: "developer",
    bio: "Full-Stack & AI Engineering Bootcamp Learner",
    timezone: "UTC",
    preferred_theme: "rose-gold-champagne",
    is_dark_mode: true,
    streak_freezes_available: 1,
    streak_freezes_used: 0,
    created_at: new Date().toISOString(),
  };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getSavedLocalUser());
  const [loading, setLoading] = useState(false);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/users/profile");
      if (res.data) {
        setUser(res.data);
        localStorage.setItem("devbloom_cached_user", JSON.stringify(res.data));
      }
    } catch {
      // fallback to cached user
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async () => {
    await fetchCurrentUser();
  };

  const register = async () => {
    await fetchCurrentUser();
  };

  const updateProfile = async (data: Partial<User>): Promise<User> => {
    let updatedUser: User;
    try {
      const res = await api.put("/users/profile", data);
      updatedUser = res.data;
    } catch {
      // Offline fallback
      updatedUser = {
        ...(user || getSavedLocalUser()),
        ...data,
      } as User;
    }
    setUser(updatedUser);
    localStorage.setItem("devbloom_cached_user", JSON.stringify(updatedUser));
    return updatedUser;
  };

  const logout = () => {
    localStorage.removeItem("devbloom_token");
    localStorage.removeItem("devbloom_cached_user");
    setUser(getSavedLocalUser());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        updateProfile,
        logout,
        refetchUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
