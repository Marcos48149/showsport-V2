"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  phone?: string;
  birthDate?: string;
  dni?: string;
  role: 'user' | 'admin';
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
}

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
} | null>(null);

export interface SignupData {
  email: string;
  password: string;
  name: string;
  lastName: string;
  phone?: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Mock users database
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'juan.perez@email.com',
      name: 'Juan',
      lastName: 'Pérez',
      phone: '+54 11 1234-5678',
      birthDate: '1990-01-15',
      dni: '12.345.678',
      role: 'user',
      addresses: [
        {
          id: '1',
          name: 'Casa',
          address: 'Av. Corrientes 1234, CABA',
          city: 'Buenos Aires',
          postalCode: '1043',
          isDefault: true
        }
      ],
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      email: 'admin@showsport.com',
      name: 'Admin',
      lastName: 'Showsport',
      role: 'admin',
      addresses: [],
      createdAt: '2024-01-01T00:00:00Z'
    }
  ];

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('showsport_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error) {
        localStorage.removeItem('showsport_user');
      }
    }
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    // Mock authentication - in real app, this would be an API call
    const user = mockUsers.find(u => u.email === email);

    if (user && password === 'password123') {
      localStorage.setItem('showsport_user', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
      return true;
    }

    dispatch({ type: 'SET_LOADING', payload: false });
    return false;
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      lastName: userData.lastName,
      phone: userData.phone,
      role: 'user',
      addresses: [],
      createdAt: new Date().toISOString()
    };

    mockUsers.push(newUser);
    localStorage.setItem('showsport_user', JSON.stringify(newUser));
    dispatch({ type: 'SET_USER', payload: newUser });
    return true;
  };

  const logout = () => {
    localStorage.removeItem('showsport_user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
