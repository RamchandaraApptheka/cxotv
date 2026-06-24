'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial check for auth state (placeholder for future implementation)
    useEffect(() => {
        try {
            // Logic to check local storage or session cookies would go here
            setLoading(false);
        } catch (error) {
            console.error('AuthProvider initialization failed:', error);
            setLoading(false);
        }
    }, []);

    // Null-safe values for the provider
    const value = {
        user: user || null,
        loading: !!loading,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook with null-safe guard
export function useAuth() {
    const context = useContext(AuthContext);
    
    // If context is used outside of provider, return safe defaults instead of crashing
    if (!context) {
        return {
            user: null,
            loading: false,
            isAuthenticated: false,
        };
    }
    
    return context;
}
