import "./App.css";
import { Toaster } from "react-hot-toast";
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MainLayout from "./components/MainLayout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./middleware/ProtectedRoute";
import AuthRoute from "./middleware/AuthRoute";
import FriendPage from "./pages/FriendPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";
import DetailPostPage from "./pages/DetailPostPage";

function App() {
  const { theme, loadUser } = useAuthStore();
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    loadUser();
  }, [loadUser]); // Load user on app start or theme change
  return (
    <>
      <Routes>
        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout Element={HomePage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts/:postId"
          element={
            <ProtectedRoute>
              <MainLayout Element={DetailPostPage} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:UserId"
          element={
            <ProtectedRoute>
              <MainLayout Element={ProfilePage} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <MainLayout Element={FriendPage} />
            </ProtectedRoute>
          }
        />

        {/* Auth routes - redirect to home if already logged in */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute>
              <SignupPage />
            </AuthRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <AuthRoute>
              <VerifyEmailPage />
            </AuthRoute>
          }
        />

        {/* Fallback route for any unmatched paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
