import React, {createContext, useContext, useEffect, useState} from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import api from "../utils/apiClient";

const stripePromise = loadStripe("pk_test_51PmqG6KG6RDK9K4gUxR1E9XN8qvunE6UUfkM1Y5skfm48UnhrQ4SjHyUM4kAsa4kpJAfQjANu6L8ikSnx6qMu4fY00I6aJBlkG");


interface StripeContextProps {
    clientSecret: string | null,
    fetchClientSecret: (amount: number) => Promise<void>
}

const StripeContext = createContext<StripeContextProps | undefined>(undefined);

export const StripeProvider: React.FC = ({children}) => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    return (
        <StripeContext.Provider value={{clientSecret}}>
            {children}
        </StripeContext.Provider>
    )
}

export const useStripeContext = () => {
    const context = useContext(StripeContext);
    if(!context) {
        throw new Error("useStripeContext must be used within a StripeProvider");
    }
    return context;
}






