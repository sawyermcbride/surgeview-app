import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import "antd/dist/reset.css";
import AuthLayout from "./components/AuthLayout";
import LoginForm from "./components/LoginForm";
import Dashboard from "./dashboard/Dashboard";
import SignupForm from "./components/SignupForm";
import GetStarted from "./pages/GetStarted";
const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginForm />
            </AuthLayout>
          }
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={
            <AuthLayout>
              <SignupForm />
            </AuthLayout>
          }
        />
        <Route path="/get-started" element={<GetStarted />} />
      </Routes>
    </Router>
  );
};

export default App;
