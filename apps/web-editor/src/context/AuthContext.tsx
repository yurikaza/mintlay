import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import { useLogout } from "../hooks/useLogout";
import { logout, setCredentials } from "../store/slices/authSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useAuth as useAuthHook } from "../hooks/useAuth";

interface User {
  address: string;
  username: string;
  plan: "FREE" | "PRO" | "ENTERPRISE";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const refreshUser = async () => {
    const token = localStorage.getItem("auth_token");
    console.log("token in refresh user: ", token);

    if (!token) return;

    try {
      // Call your getMe endpoint
      const response = await axios.get("http://localhost:3000/api/auth/me", {
        headers: {
          authorization: `${token}`,
        },
      });
      const userData = response.data; // Ensure this is the user object from DB
      console.log(userData);

      // CRITICAL: Re-sync Redux with the existing token + fresh user data
      dispatch(
        setCredentials({
          user: userData,
          token: token,
        }),
      );

      console.log("PROTOCOL: Session_Restored", userData);
    } catch (err) {
      console.error("SESSION_EXPIRED", err);
      dispatch(logout());
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
