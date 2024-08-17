import React from "react";
import "@testing-library/jest-dom"

import {render, screen, fireEvent}  from "@testing-library/react";

import { AuthProvider, useAuth } from "../AuthContext";
import axios from "axios";
import { vi } from "vitest";

vi.mock("axios")

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
    afterEach( () => {
        vi.clearAllMocks();
    });

    it("should intialize with correct default values", () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        expect(screen.getByText(/Authenticated: false/i)).toBeInTheDocument();
        expect(screen.getByText(/Email:/i)).toBeInTheDocument();
    });

    it("should handle login correctly", async () => {
        (axios.post as vi.Mock).mockResolvedValue({
            data: {valid: true, message:{ email: "samcbride11@gmail.com"}}
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


    it("should handle logout correctly", async() => {
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

    it("should handle invalid token correctly", async() => {
        (axios.post as vi.Mock).mockResolvedValue({
            status: 401,
            data: {valid: false, message: "expired jwt"}
        });

        render(
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


