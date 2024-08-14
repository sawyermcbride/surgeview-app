import React, { createContext, useState, useContext, ReactNode, useEffect} from "react";
import axios from "axios";

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
    
    const login = async () => {
        const tokenLocalStorage = localStorage.getItem("token") || "";
        try {

            const result = await axios.post("http://10.0.0.47:3001/auth/validate-token", null, {
                headers: {
                    Authorization: `Bearer ${tokenLocalStorage}`
                }
            });
            console.log("AuthContext checking token:");
            if(result.data.valid) {
                setToken(tokenLocalStorage);
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






