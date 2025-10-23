"use client"

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import axios from 'axios'
import { storage } from '@/lib/utils';

interface AppState {
    theme: "light" | "dark" | "system";
    isLoading: boolean;
    error: string | null
}

type AppAction =
    | { type: 'SET_THEME'; payload: "light" | "dark" | "system" }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'CLEAR_ERROR' }
    | { type: 'RESET_STATE' };

const initialState: AppState = {
    theme: "system",
    isLoading: false,
    error: null,
}

const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'SET_THEME':
            return {
                ...state,
                theme: action.payload,
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        case 'RESET_STATE':
            return initialState;
        default:
            return state;
    }
}

interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
    actions: {
        setTheme: (theme: "light" | "dark" | "system") => void;
        setLoading: (isLoading: boolean) => void;
        setError: (error: string | null) => void;
        clearError: () => void;
        resetState: () => void;
    }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    useEffect(() => {
        const persistedTheme = storage.get<"light" | "dark" | "system">('theme', 'system');
        if (persistedTheme) {
            dispatch({ type: 'SET_THEME', payload: persistedTheme });
        }
    }, [])

    // Persist theme to localStorage
    useEffect(() => {
        storage.set('theme', state.theme);

        // Apply theme to document
        const root = document.documentElement;
        if (state.theme === 'dark') {
            root.classList.add('dark');
        } else if (state.theme === 'light') {
            root.classList.remove('dark');
        } else {
            // System theme
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (systemPrefersDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    }, [state.theme]);
    const actions = {
        setTheme: (theme: 'light' | 'dark' | 'system') => dispatch({ type: 'SET_THEME', payload: theme }),
        setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
        setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
        clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
        resetState: () => dispatch({ type: 'RESET_STATE' }),
    };

    return (
        <AppContext.Provider value={{ state, dispatch, actions }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp(): AppContextType {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}