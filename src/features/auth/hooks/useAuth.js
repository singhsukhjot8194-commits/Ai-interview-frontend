import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context.js";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error("Login failed", error);
      return {
        success: false,
        message:
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Unable to log in",
      };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await register({ username, email, password });
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error("Registration failed", error);
      return {
        success: false,
        message:
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Unable to create account",
      };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getMe();
        setUser(data.user);
      } catch (error) {
        console.error("Unable to restore the current user", error);
      } finally {
        setLoading(false);
      }
    };

    getAndSetUser();
  }, [setLoading, setUser]);

  return { user, loading, handleRegister, handleLogin, handleLogout };
};
