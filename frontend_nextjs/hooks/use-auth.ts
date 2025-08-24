import { useState, useEffect } from 'react';
import { apiService, type LoginCredentials, type ApiError } from '@/lib/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function useAuth(): AuthState & AuthActions {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Check for existing authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const userStr = localStorage.getItem(USER_KEY);
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        setState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await apiService.login(credentials);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Store in localStorage
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        
        setState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
        
        return { success: true };
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
        return { 
          success: false, 
          error: response.message || 'Échec de la connexion' 
        };
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      const apiError = error as ApiError;
      
      // Handle validation errors
      if (apiError.errors) {
        const errorMessages = Object.values(apiError.errors).flat();
        return { 
          success: false, 
          error: errorMessages.join(', ') || apiError.message 
        };
      }
      
      return { 
        success: false, 
        error: apiError.message || 'Une erreur est survenue lors de la connexion' 
      };
    }
  };

  const logout = async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      if (state.token) {
        await apiService.logout(state.token);
        console.log('Logout successful');
      }
    } catch (error) {
      // Enhanced error logging for better debugging
      console.error('Error during logout:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        error: error,
        stack: error instanceof Error ? error.stack : undefined,
        type: typeof error,
        stringified: JSON.stringify(error, null, 2)
      });
      
      // Don't throw the error, just log it since we want to clear local state anyway
    } finally {
      // Clear localStorage and state regardless of API call result
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      
      setState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  return {
    ...state,
    login,
    logout,
    checkAuth,
  };
}