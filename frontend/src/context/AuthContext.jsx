import { createContext, useState, useEffect } from 'react';

// AuthContext will hold the authentication state and functions.
export const AuthContext = createContext();

// Provider to wrap the app and share auth state globally
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Indicates if user is logged in
  const [loading, setLoading] = useState(true);        // Prevents rendering before auth check completes

  /**
   * Logs in the user with email and password.
   * If successful, sets isLoggedIn = true.
   * Sends credentials via HTTP-only cookie.
   */
  const login = async (email, password) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include', // Send and accept cookies.
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // The login requires email and password.
      });

      if (res.ok) {
        setIsLoggedIn(true);
        return { success: true };
      } else {
        const error = await res.json();
        return { success: false, error: error.message || 'Login failed' };
      }
    } catch (err) {
      return { success: false, error: err.message || 'Request error' };
    }
  };

  /**
   * Logs out the current user by clearing the cookie on the server.
   * Always resets frontend auth-state regardless of backend result.
   */
  const logout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setIsLoggedIn(false);
    }
  };

  /**
   * On initial load, check if a valid session exists.
   * If yes, mark the user as logged in.
   */
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/me', {
        credentials: 'include',
      });
      setIsLoggedIn(res.ok);
    } catch {
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  // Run check once on app startup.
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
