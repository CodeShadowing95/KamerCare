import { useState, useEffect } from 'react';
import { apiService, type LoginCredentials, type ApiError } from '@/lib/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  speciality?: string;
  doctor?: {
    specialization: string;
    hospital?: string;
    license_number: string;
    phone: string;
    bio?: string;
    years_of_experience: string;
    consultation_fee: number;
    is_available: boolean;
    [key: string]: any;
  };
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
      // Ensure we're on the client side before accessing localStorage
      if (typeof window === 'undefined') {
        setState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        });
        return;
      }
      
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
        const { user: userData, token } = response.data;
        
        // Map doctor specialization to user speciality and preserve doctor relation
        const user = {
          ...userData,
          speciality: userData.doctor?.specialization || undefined,
          doctor: userData.doctor || undefined
        };
        
        // Store in localStorage
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        
        // Store token in cookie for middleware access
        document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        
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
        constructor: error?.constructor?.name,
        keys: error && typeof error === 'object' ? Object.keys(error) : [],
        stringified: (() => {
          try {
            return JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
          } catch (e) {
            return 'Cannot stringify error';
          }
        })()
      });
      
      // Log specific error details if it's an API error
      if (error && typeof error === 'object' && 'message' in error) {
        console.error('API Error details:', {
          message: (error as any).message,
          errors: (error as any).errors,
          status: (error as any).status
        });
      }
      
      // Don't throw the error, just log it since we want to clear local state anyway
    } finally {
      // Clear localStorage, cookies and state regardless of API call result
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem('activeTab');
      localStorage.removeItem('activeView');
      
      // Clear auth cookie
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      setState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });

      // Rediriger vers la page d'accueil après la déconnexion
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  };

  return {
    ...state,
    login,
    logout,
    checkAuth,
  };
}