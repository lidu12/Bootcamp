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
  updateProfile: (data: Partial<User>) => Promise<void>;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const DEFAULT_LOCAL_USER: User = {
  id: 1,
  email: "dev@devbloom.local",
  username: "developer",
  bio: "Full-Stack & AI Engineering Bootcamp Learner",
  timezone: "UTC",
  preferred_theme: "emerald-bloom",
  is_dark_mode: true,
  streak_freezes_available: 1,
  streak_freezes_used: 0,
  created_at: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEFAULT_LOCAL_USER);
  const [loading, setLoading] = useState(false);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      console.warn("Failed to fetch user from server, using local default:", err);
      setUser(DEFAULT_LOCAL_USER);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async () => {
    setUser(DEFAULT_LOCAL_USER);
  };

  const register = async () => {
    setUser(DEFAULT_LOCAL_USER);
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const res = await api.patch("/users/me", data);
      setUser(res.data);
    } catch (err) {
      setUser((prev) => (prev ? { ...prev, ...data } : DEFAULT_LOCAL_USER));
    }
  };

  const logout = () => {
    setUser(DEFAULT_LOCAL_USER);
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
