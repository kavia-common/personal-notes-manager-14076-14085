import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import "./App.css";
import "./custom.css";
import useAuth from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotesPage from "./pages/NotesPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

// PUBLIC_INTERFACE
function App() {
  // Theme toggling
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // Auth hook
  const { user, status, error, login, register, logout } = useAuth();

  // Route protection component
  function RequireAuth({ children }) {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }

  // Login/Register redirect if already logged in
  function RedirectIfAuth({ children }) {
    if (user) return <Navigate to="/notes" replace />;
    return children;
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={logout} />
        {/* Theme toggle fab (corner) */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          style={{ position: "fixed" }}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              <RedirectIfAuth>
                <LoginPage onLogin={login} errorText={error} loading={status === "loading"} />
              </RedirectIfAuth>
            }
          />
          <Route
            path="/register"
            element={
              <RedirectIfAuth>
                <RegisterPage
                  onRegister={register}
                  errorText={error}
                  loading={status === "loading"}
                />
              </RedirectIfAuth>
            }
          />
          <Route
            path="/notes"
            element={
              <RequireAuth>
                <NotesPage user={user} />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
