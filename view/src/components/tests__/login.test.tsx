import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Login from '../LoginForm'; // Adjust the path to your Login component

describe('Login Page', () => {
  test('renders the login form', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('shows error message on invalid submission', async () => {
    render(<Login />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
  });

  // Add more tests to cover different scenarios
});
