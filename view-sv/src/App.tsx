import React, { useState } from "react";
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
import { StripeProvider } from "./contexts/StripeContext";

import { AuthProvider, useAuth } from "./components/AuthContext";
import LoginForm from "./components/LoginForm";
import Dashboard from "./pages/Dashboard";
import SignupForm from "./components/SignupForm";
import GetStarted from "./pages/GetStarted";
import LandingPage from "./pages/LandingPage";

const stripePromise = loadStripe("pk_test_51PmqG6KG6RDK9K4gUxR1E9XN8qvunE6UUfkM1Y5skfm48UnhrQ4SjHyUM4kAsa4kpJAfQjANu6L8ikSnx6qMu4fY00I6aJBlkG");

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
          <Route path="/" element={<LandingPage/>}></Route>
        </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <StripeProvider>
        <Elements options={{clientSecret: "pi_3PvEa5KG6RDK9K4g1YATYpG2_secret_CEtDF8DAhArxEPU9kEObtH2Vj"}} stripe={stripePromise}>
          <Router>
            <AuthRoutes/>
          </Router>
        </Elements>
      </StripeProvider>
    </AuthProvider>
  )
}

export default App;
