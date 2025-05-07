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

function App() {
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
          path="/profile/:UserId"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <FriendPage />
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

        {/* Fallback route for any unmatched paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
