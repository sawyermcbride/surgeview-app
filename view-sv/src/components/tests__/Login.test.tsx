import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '../LoginForm';
import { AuthProvider } from "../AuthContext";
import axios from "axios";
import { vi } from 'vitest';

vi.mock("axios");

test('renders login page and handles login', async () => {
  // Render the LoginPage component inside MemoryRouter to handle routing
  (axios.post as vi.Mock).mockResolvedValueOnce({
    data: {token: '10002'},
  });

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
  fireEvent.change(passwordInput, { target: { value: 'SurgeView2025' } });

  // Simulate form submission
  const loginButton = screen.getByRole('button', {name:/Login/i});
  fireEvent.click(loginButton);


  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/login"), 
      expect.objectContaining({
        email: "samcbride11@gmail.com",
        password: "SurgeView2025"
      })
    );
  })  

  // Add your assertions here to check if the login was handled correctly
  // For example, check if a certain function was called or if the page redirects
});
