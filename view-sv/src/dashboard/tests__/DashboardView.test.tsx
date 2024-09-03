import React from "react";
import "@testing-library/jest-dom"

import {render, screen, waitFor}  from "@testing-library/react";
import * as AuthContext from "../../components/AuthContext";

import DashboardView from "../DashboardView";

import api from "../../utils/apiClient";
import { vi } from "vitest";

const mockCampaignData = {data: [] };
const mockStatisticsData = {data: {
    status: {
        numberofSetup: 1,
        numberofActive: 1
    },
    statistics: {
        views: {
            lastDay: 100,
            lastWeek: 100
        },
        subscribers: {
            lastDay: 5,
            lastWeek: 25
        }
    }
}};


vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
    login: vi.fn(),
    logout: vi.fn(),
    isAuthenticated: true,
    token: 'test-token',
    email: "samcbride11@gmail.com"
});

describe('Dashboard view',  () => {
    beforeEach( () => {
        vi.clearAllMocks();
    });

    test('renders without crashing ', async () => {
        
        (api.get as vi.Mock).mockResolvedValueOnce(mockCampaignData).mockResolvedValueOnce(mockStatisticsData);

        render(<DashboardView selectedMenu="1" resetCampaignsView={false}
                resetDashboardView={false} setResetCampaignsView={vi.fn()} setResetDashboardView={vi.fn()}/>
         )
         await waitFor( () => {
            //  expect(screen.getByTestId("base-statistics")).toBeInTheDocument();
             expect(screen.getByText(/Notification/i)).toBeInTheDocument();
         }, {timeout: 4000});
    })
        
        
    test('fetches and sets campaign data on load', async() => {
        
        (api.get as vi.Mock).mockResolvedValueOnce(mockCampaignData).mockResolvedValueOnce(mockStatisticsData);
        
        render(<DashboardView selectedMenu="1" resetCampaignsView={false}
                resetDashboardView={false} setResetCampaignsView={vi.fn()} setResetDashboardView={vi.fn()}/>
        )
        await waitFor( () => {
            expect(api.get).toHaveBeenCalledTimes(2);
            expect(screen.getAllByText(/Active/i)[0]).toBeInTheDocument();
            expect(screen.getAllByText(/Setup/i)[0]).toBeInTheDocument();
        }, {
            timeout: 5000
        });
    });
        
    test('shows spinner while loading data', () => {
        // api.get.mockReturnValue(new Promise(()=>{}));
        
        render(<DashboardView selectedMenu="1" resetCampaignsView={false}
            resetDashboardView={false} setResetCampaignsView={vi.fn()} setResetDashboardView={vi.fn()}/>
        )
        
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
        
    })
    
    test('re renders view based on selected menu ', async () => {
        (api.get as vi.Mock).mockResolvedValueOnce(mockCampaignData).mockResolvedValueOnce(mockStatisticsData);
        
        render(<DashboardView selectedMenu="2" resetCampaignsView={false}
            resetDashboardView={false} setResetCampaignsView={vi.fn()} setResetDashboardView={vi.fn()}/>);
        await waitFor( () => {
            expect(screen.getByText(/Start Date/i)).toBeInTheDocument();
        }, {timeout: 5000});
    })

})