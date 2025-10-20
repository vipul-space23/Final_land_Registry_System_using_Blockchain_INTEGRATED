// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // Load from localStorage on mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const storedToken = localStorage.getItem("token");
//     if (storedUser && storedToken) {
//       setUser(JSON.parse(storedUser));
//       setToken(storedToken);
//       setIsAuthenticated(true);
//     }
//   }, []);

//   const login = (data) => {
//     if (!data.email) data.email = "N/A";

//     setUser(data);
//     setIsAuthenticated(true);

//     if (data.token) setToken(data.token);

//     localStorage.setItem("user", JSON.stringify(data));
//     if (data.token) localStorage.setItem("token", data.token);
//   };

//   const logout = async () => {
//     try {
//       await fetch("http://localhost:5000/api/auth/logout", {
//         method: "POST",
//         credentials: "include",
//       });
//       setUser(null);
//       setToken(null);
//       setIsAuthenticated(false);
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   const updateUser = (updatedData) => {
//     setUser((prev) => {
//       const newUser = { ...prev, ...updatedData };
//       localStorage.setItem("user", JSON.stringify(newUser));
//       return newUser;
//     });
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, updateUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);












import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Check authentication on mount by calling a protected endpoint
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Try to fetch user profile using cookie
      const response = await fetch('http://localhost:5000/api/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Login function now works with the backend response structure
  const login = (data) => {
    console.log('Login data received:', data);
    
    // Handle both formats: data.user or direct data
    const userData = data.user || data;
    
    setUser(userData);
    setIsAuthenticated(true);
    
    // Store minimal user info in localStorage (optional, for UI purposes only)
    localStorage.setItem("user", JSON.stringify(userData));
    
    // ✅ NO TOKEN STORAGE - token is in HTTP-only cookie
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      
      // Optionally redirect to login
      window.location.href = '/login';
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUser, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);