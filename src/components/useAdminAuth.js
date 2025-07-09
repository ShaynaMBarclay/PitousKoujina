import { useState, useEffect } from "react";

const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE;
const EXPIRATION_HOURS = 3;

export default function useAdminAuth() {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const storedTime = localStorage.getItem("admin-login-time");
    const now = Date.now();

    if (storedTime && now - storedTime < EXPIRATION_HOURS * 60 * 60 * 1000) {
      setAuthorized(true);
    }
  }, []);

  const login = (passcode) => {
    if (passcode === ADMIN_PASSCODE) {
      localStorage.setItem("admin-login-time", Date.now());
      setAuthorized(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("admin-login-time");
    setAuthorized(false);
  };

  return { authorized, login, logout };
}
