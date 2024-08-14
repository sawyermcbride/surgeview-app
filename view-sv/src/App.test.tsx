// import React from 'react';
// import { describe, it, expect } from 'vitest';
// import { render, screen } from '@testing-library/react';

// import LandingPage from './pages/LandingPage';
// import {MemoryRouter} from "react-router-dom";
// //import {AuthProvider} from "./components/AuthContext";



// test('renders homepage', () => {
//    // Provide a mock context value
//   render(
//     <MemoryRouter>
//       <LandingPage />
//     </MemoryRouter>
//     );

//   // Check if the Landing Page is rendered correctly
//   const headingElement = screen.getByText(/Promote Your Videos With the #1 YouTube Growth Platform/);
//   expect(headingElement).toBeInTheDocument();
// });
import '@testing-library/jest-dom'

describe('test code', () => {
  it('3 + 5 should be 8', () => {
    expect(3 + 5).toBe(8);
  });
});
