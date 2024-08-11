import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import "antd/dist/reset.css";
import AuthLayout from "./components/AuthLayout";
import { AuthProvider, useAuth } from "./components/AuthContext";
import LoginForm from "./components/LoginForm";
import Dashboard from "./pages/Dashboard";
import SignupForm from "./components/SignupForm";
import GetStarted from "./pages/GetStarted";
const AuthRoutes: React.FC = () => {

  const {isAuthenticated} = useAuth();
  return (
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
          <Route path="/get-started" element={isAuthenticated ? <GetStarted /> : <Navigate to="/signup"/> } />
        </Routes>
  );
};

const App: React.FC = () => {

  return (
    <AuthProvider>
      <Router>
        <AuthRoutes/>
      </Router>
    </AuthProvider>
  )
}

export default App;
