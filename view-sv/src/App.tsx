import React, { useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";


import "antd/dist/reset.css";
import AuthLayout from "./components/AuthLayout";
import { StripeProvider, useStripeContext } from "./contexts/StripeContext";

import { AuthProvider, useAuth } from "./components/AuthContext";
import LoginForm from "./components/LoginForm";
import Dashboard from "./pages/Dashboard";
import SignupForm from "./components/SignupForm";
import SignupContainer from "./pages/SignupContainer";
import LandingPage from "./pages/LandingPage";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

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
          <Route path="/get-started" element={isAuthenticated ? <SignupContainer /> : <Navigate to="/signup"/> } />
          <Route path="/" element={<LandingPage/>}></Route>
        </Routes>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StripeProvider>
          <Router>
            <AuthRoutes/>
          </Router>
        </StripeProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App;
