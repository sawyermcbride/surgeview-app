import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '../LoginForm';
import { AuthProvider } from "../AuthContext";



test('renders login page and handles login', () => {
  // Render the LoginPage component inside MemoryRouter to handle routing
  render(
    <AuthProvider>
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    </AuthProvider>
  );

  // Check if the username and password fields are in the document
  const usernameInput = screen.getByPlaceholderText(/Email/i);
  const passwordInput = screen.getByPlaceholderText(/Password/i);

  expect(usernameInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();

  // Simulate user input
  fireEvent.change(usernameInput, { target: { value: 'samcbride11@gmail.com' } });
  fireEvent.change(passwordInput, { target: { value: 'SurgeView2029' } });

  // Simulate form submission
  const loginButton = screen.getByRole('button', {name:/Login/i});
  fireEvent.click(loginButton);

  // Add your assertions here to check if the login was handled correctly
  // For example, check if a certain function was called or if the page redirects
});
