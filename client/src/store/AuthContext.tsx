import React, { createContext, useState, useContext, ReactNode } from 'react';


interface AuthContextType {
    token: string;
    setToken: (token: string) => void;
    userid: string;
    setUserId: (userid: string) => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string>('');
    const [userid, setUserId] = useState<string>('');

    const value = React.useMemo(
        () => ({
            token,
            setToken,
            userid,
            setUserId,
        }),
        [token, userid]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

export { AuthContext };