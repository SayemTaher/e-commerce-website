import React from 'react';
import { createContext } from 'react';
const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
    const infos = {
        
    }
    return (
        <AuthContext.Provider value={infos}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;