import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./components/Home";
import DiaryEntry from "./components/DiaryEntry";
import Calendar from "./components/Calendar";
import Settings from "./components/Settings";
import TutorialComponent from "./components/TutorialComponent";
import WorkerSurvey from "./components/WorkerSurvey";
import DynamicHomeScreen from "./components/DynamicHome";

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/tutorial" element={<TutorialComponent />} />
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginForm />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <RegisterForm />}
      />
      <Route
        path="/forgot-password"
        element={user ? <Navigate to="/" replace /> : <ForgotPassword />}
      />
      <Route
        path="/diary"
        element={user ? <DiaryEntry /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/calendar"
        element={user ? <Calendar /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/settings"
        element={user ? <Settings /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/home"
        element={user ? <Home /> : <Navigate to="/login" replace />}
      />
      <Route path="/worker-survey" element={<WorkerSurvey />} />
      <Route
        path="/"
        element={
          user ? <DynamicHomeScreen /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
};

export default App;
