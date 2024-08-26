

import { vi } from 'vitest';
import React from "react";

import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from "axios";


vi.mock('axios', async (importOriginal) => {
  const actualAxios = await importOriginal();
  
  return {
    ...actualAxios,
    default: {
      ...actualAxios.default,
      create: vi.fn(() => ({
        interceptors: {
          request: {
            use: vi.fn(),
          },
          response: {
            use: vi.fn(),
          },
        },
        get: vi.fn(),
        post: vi.fn(),
      })),
    },
  };
});

import LoginForm from '../LoginForm';
import { AuthProvider } from "../AuthContext";
import api from '../../utils/apiClient';


test('renders login page and handles login', async () => {
  // Render the LoginPage component inside MemoryRouter to handle routing
  (api.post as vi.Mock).mockResolvedValueOnce({
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
    expect(api.post).toHaveBeenCalledWith(
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
