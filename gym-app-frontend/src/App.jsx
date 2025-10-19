import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import LandingPage from "./pages/Landing";
import { LanguageProvider } from "./context/LanguageContext";
import { LoaderProvider } from "./context/LoaderContext";
import Loader from "./components/Loader"; // ✅ import your loader

function ProtectedRoute({ user, children }) {
  // Only allow access if user exists AND status is active
  if (!user || user.status !== "active") {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  return (
    <LanguageProvider>
      <LoaderProvider>
        <Router>
          <Navbar user={user} setUser={setUser} />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login setUser={setUser} />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute user={user}>
                  <Dashboard user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute user={user}>
                  <Profile user={user} setUser={setUser} />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Loader />
      </LoaderProvider>
    </LanguageProvider>
  );
}

export default App;
