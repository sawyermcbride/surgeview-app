import React, { createContext, useState, useContext, ReactNode, useEffect} from "react";
import axios from "axios";

interface AuthContextType {
    isAuthenticated: boolean;
    email: String;
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
    
    const login = async () => {

        const result = await axios.post("http://10.0.0.47:3001/auth/validate-token", null, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
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
        

    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        setIsAuthenticated(false);
    }
    

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, email}}>
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




