import React from "react";
import "@testing-library/jest-dom"

import {render, screen, fireEvent}  from "@testing-library/react";


import { AuthProvider, useAuth } from "../AuthContext";
import axios from "axios";
import api from "../../utils/apiClient";
import { vi } from "vitest";


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

const TestComponent = () => {
    const {isAuthenticated, login, logout, email, token} = useAuth();

    return (
        <div>
            <div>Authenticated: {isAuthenticated.toString()}</div>
            <div>Email: {email} </div>
            <button onClick={login}>Login</button>
            <button onClick={logout}>Logout</button>
        </div>
    )
}

describe("Auth Provider", () => {

    test('matchMedia is mocked', () => {
        expect(window.matchMedia).toBeDefined();
        expect(window.matchMedia('(min-width: 600px)').matches).toBe(false);
    });
      
    afterEach( () => {
        vi.clearAllMocks();
    });

    test("should intialize with correct default values", () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        expect(screen.getByText(/Authenticated: true/i)).toBeInTheDocument();
        expect(screen.getByText(/Email:/i)).toBeInTheDocument();
    });

    test("should handle login correctly", async () => {
        (api.post as vi.Mock).mockResolvedValue({
            data: {valid: true, email: "samcbride11@gmail.com"}
        });

        render(
            <AuthProvider>
                <TestComponent/>
            </AuthProvider>
        )

        const loginButton = screen.getByText(/Login/i);

        fireEvent.click(loginButton);

        await screen.findByText(/Authenticated: true/i);

        expect(screen.getByText(/Authenticated: true/i)).toBeInTheDocument();
        expect(screen.getByText(/Email: samcbride11@gmail.com/i)).toBeInTheDocument();
        

    });


    test("should handle logout correctly", async() => {
        render(
            <AuthProvider>
                <TestComponent/>
            </AuthProvider>
        )

        const logoutButton = screen.getByText(/Logout/i);

        fireEvent.click(logoutButton);

        await screen.findByText(/Authenticated: false/i);

        expect(screen.getByText(/Authenticated: false/i)).toBeInTheDocument();
        expect(screen.getByText(/Email:/i)).toBeInTheDocument();


    })

    test("should handle invalid token correctly", async() => {
        (api.post as vi.Mock).mockResolvedValue({
            status: 401,
            data: {valid: false, message: "expired jwt"}
        });

        render (
            <AuthProvider>
                <TestComponent/>
            </AuthProvider>
        )

        const loginButton = screen.getByText(/Login/i);

        fireEvent.click(loginButton);

        await screen.findByText(/Authenticated: false/i);

        expect(screen.getByText(/Authenticated: false/i)).toBeInTheDocument();
        expect(screen.getByText(/Email/i)).toBeInTheDocument();

    })

})


