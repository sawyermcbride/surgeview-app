import React, { createContext, useState, useContext,
                ReactNode, useEffect} from "react";

import api from "../utils/apiClient";

interface AuthContextType {
    isAuthenticated: boolean;
    email: string | null;
    token: string | null;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}



export const AuthProvider: React.FC<AuthProviderProps>  = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem("token"));

    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");

    useEffect( () => {
        const tokenLocalStorage = localStorage.getItem("token");
        if(!tokenLocalStorage) {
            logout();
        } else {
            setToken(tokenLocalStorage);
            login();
        }

    }, [])
    
    const login = async () => {

        try {

            const result = await api.post("http://10.0.0.47:3001/auth/validate-token", null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("AuthContext checking token:");
            if(result.data.valid) {
                console.log("AuthContext token valid");
                setEmail(result.data.message.email!);
                setIsAuthenticated(true);
            } else {
                console.log("AuthContext token invalid");
                logout();
            }
            console.log(result.data.valid);
        } catch(err) {
            logout();
        }
        

    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("refreshToken");
        setToken("");
        setIsAuthenticated(false);
        
    }
    

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, email, token}}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};






