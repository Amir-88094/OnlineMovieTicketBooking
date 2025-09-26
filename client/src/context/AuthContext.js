import { createContext, useState, useEffect } from "react";

// Create the context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // {token, role, email, firstName, ...}

  // On refresh, restore from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (data) => {
    // data: {token, role, ...}
    setUser(data);
    localStorage.setItem("authUser", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
