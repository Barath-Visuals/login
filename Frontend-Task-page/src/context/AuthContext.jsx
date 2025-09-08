import { Children, createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({childer}) => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    useEffect(() => {
        if(token) {
            localStorage.setItem("token", token)
        } else {
            localStorage.removeItem("token")
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{token, setToken}}>
            {Children}
        </AuthContext.Provider>
    )
}