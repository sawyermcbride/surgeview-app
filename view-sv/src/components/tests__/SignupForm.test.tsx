import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignupForm from '../SignupForm';
import { AuthProvider } from "../AuthContext";



test('renders login page and handles login', () => {
  // Render the LoginPage component inside MemoryRouter to handle routing
  render(
    <AuthProvider>
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    </AuthProvider>
  );

  // Check if the username and password fields are in the document
  const usernameInput = screen.getByPlaceholderText(/Email/i);
  const passwordInput = screen.getAllByPlaceholderText(/Password/i);


  expect(usernameInput).toBeInTheDocument();
  expect(passwordInput).toHaveLength(2);

  // Simulate user input
  fireEvent.change(usernameInput, { target: { value: 'samcbride11@gmail.com' } });
  fireEvent.change(passwordInput[0], { target: { value: 'SurgeView2029' } });
  fireEvent.change(passwordInput[1], { target: { value: 'SurgeView2029' } });

  // Simulate form submission
  const loginButton = screen.getByRole('button', {name:/Sign Up/i});
  fireEvent.click(loginButton);

  // Add your assertions here to check if the login was handled correctly
  // For example, check if a certain function was called or if the page redirects
});
