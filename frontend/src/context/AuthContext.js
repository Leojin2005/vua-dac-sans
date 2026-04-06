import { createContext, useContext, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    return data; // có trường isEmailVerified
  };

  const register = async (name, email, phone, password) => {
    const { data } = await API.post("/auth/register", { name, email, phone, password });
    return data;
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    setUser(null);
  };

  const updateProfile = async (info) => {
    const { data } = await API.put("/auth/profile", info);
    const updated = { ...user, ...data };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
