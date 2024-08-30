import { describe, it, expect, beforeEach } from 'vitest';
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {vi} from "vitest";
import { AuthProvider } from "../../components/AuthContext";
// import { mockMatchMedia } from './matchMedia.mock';
import GetStarted from '../GetStarted';
import api from '../../utils/apiClient';

vi.mock('@stripe/react-stripe-js', () => ({
    __esModule: true,
    CardElement: () => <div data-testid="mock-card-element" />,
    useStripe: () => ({ /* mock implementation */ }),
    useElements: () => ({ /* mock implementation */ }),
    Elements: ({ children }) => <div>{children}</div>,  // Mocking the Elements provider
  }));

describe('GetStarted', () => {
    test('matchMedia is mocked', () => {
        
        expect(window.matchMedia).toBeDefined();
        expect(window.matchMedia('(min-width: 600px)').matches).toBe(false);
    });
    test('Check for getting started component ', () => {
        render(
            <AuthProvider>
                <MemoryRouter>
                    <GetStarted />
                </MemoryRouter>
            </AuthProvider>
        );
        const component = screen.getByTestId("getting-started-component");
        expect(component).toBeInTheDocument();
    })
    
    test('renders initial signup video form', async() => {
        render(
            <AuthProvider>
                <MemoryRouter>
                    <GetStarted />
                </MemoryRouter>
            </AuthProvider>
        );
        const titleOne = screen.getByText('1. Select the Video to Recieve Views in Your Campaign');
        
        
        expect(titleOne).toBeInTheDocument();
        
        
        
        
    })
    
    test("renders second step after input of link", async () => {
        render(
            <AuthProvider>
                <MemoryRouter>
                    <GetStarted />
                </MemoryRouter>
            </AuthProvider>
        );
        const textFieldOne = screen.getByLabelText(/YouTube URL/i);
        const button = screen.getByText(/Submit/i);
        
        fireEvent.change(textFieldOne, { target: { value: 'youtube.com/trump' } });
        
        fireEvent.click(button);

        

        await waitFor( () => {
            screen.debug();
            const titleTwo = screen.getByText(/2. Select a Plan/i);
            const planOne = screen.getByText("$99 / month");
            expect(titleTwo).toBeInTheDocument();
            expect(planOne).toBeInTheDocument();

        }, {timeout: 4000});
    })
    
    test("check payment form rendered correctly", async () => {
        render(
            <AuthProvider>
                <MemoryRouter>
                    <GetStarted />
                </MemoryRouter>
            </AuthProvider>
        );
        const textFieldOne = screen.getByLabelText(/YouTube URL/i);
        const button = screen.getByText(/Submit/i);
        
        fireEvent.change(textFieldOne, { target: { value: 'youtube.com/trump' } });
        
        fireEvent.click(button);
    
        
    
        await waitFor( () => {
            const planSelectButton = screen.getAllByText(/Start 7 Day Free Trial/i)[0];
            fireEvent.click(planSelectButton);
            
        }, {timeout: 4000});

        await waitFor( () => {
            const titleThree = screen.getByText(/3. Add Your Card Details/i);
            expect(titleThree).toBeInTheDocument();

            const submitButton = screen.getByText(/Submit/i);
            fireEvent.click(submitButton);


        }, {timeout: 4000});

        await waitFor ( () => {
            expect(api.post).toHaveBeenCalledWith(
                expect.stringContaining("/campaign/add")
            );
        });



    })

});


// describe("Get started sequence: ", () => {
    


//     test('renders second screen with plan options', async() => {
//         const titleTwo = screen.getByText(/2. Select a Plan/i);

//         expect(titleTwo).toBeInTheDocument();
//         const planSelectButton = screen.getAllByText(/Start 7 Day Free Trial/i)[0];

//         fireEvent.click(planSelectButton);
//     })

//     test('renders third screen with payment details', async() => {
//         const titleThree = screen.getByText(/3. Add Your Card Details/i);
        
//         expect(titleThree).toBeInTheDocument();
//     })

// })

