import React, { useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import AuthLayout from "./components/AuthLayout";
import { StripeProvider } from "./contexts/StripeContext";

import { AuthProvider, useAuth } from "./components/AuthContext";
import LoginForm from "./components/LoginForm";
import DashboardContainer from "./dashboard/DashboardContainer";
import SignupForm from "./components/SignupForm";
import SignupContainer from "./pages/SignupContainer";
import LandingPage from "./pages/LandingPage";
import { AppMainProvider } from "./contexts/AppMainContext";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const AuthRoutes: React.FC = () => {

// I am getting an error in the browser  for AppContextProvider is not defined, 
// It appears that is is imported. Can you check the reason why?

  const {isAuthenticated} = useAuth();
  return (
    <AppMainProvider>
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
          element={isAuthenticated ? <DashboardContainer /> : <Navigate to="/login" />}
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
      </AppMainProvider>
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
