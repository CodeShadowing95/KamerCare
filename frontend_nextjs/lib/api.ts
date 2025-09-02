const API_BASE_URL = 'http://localhost:8000/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
      status: string;
      doctor?: {
        specialization: string;
        hospital?: string;
        license_number: string;
        phone: string;
        bio?: string;
        years_of_experience: string;
        consultation_fee: number;
        is_available: boolean;
      };
    };
    token: string;
  };
  errors?: Record<string, string[]>;
}

export interface ConsultationHours {
  monday: { start: string; end: string; available: boolean };
  tuesday: { start: string; end: string; available: boolean };
  wednesday: { start: string; end: string; available: boolean };
  thursday: { start: string; end: string; available: boolean };
  friday: { start: string; end: string; available: boolean };
  saturday: { start: string; end: string; available: boolean };
  sunday: { start: string; end: string; available: boolean };
}

export interface DoctorRegistrationData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  specialization: string;
  hospital?: string;
  license_number: string;
  phone: string;
  bio?: string;
  qualifications?: string[];
  education?: string[];
  certifications?: string[];
  references?: string[];
  years_of_experience: string;
  office_address?: string;
  consultation_fee: number;
  is_available?: boolean;
  consultation_hours?: ConsultationHours;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          // If JSON parsing fails, create a generic error
          throw {
            message: `HTTP ${response.status}: ${response.statusText}`,
            errors: {},
          } as ApiError;
        }
        
        throw {
          message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          errors: errorData.errors || {},
        } as ApiError;
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError) {
        // Network error
        throw {
          message: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
          errors: {},
        } as ApiError;
      }
      
      // If it's already an ApiError, re-throw it
      if (error && typeof error === 'object' && 'message' in error) {
        throw error;
      }
      
      // For any other error, wrap it in an ApiError
      throw {
        message: error instanceof Error ? error.message : 'Une erreur inconnue est survenue',
        errors: {},
      } as ApiError;
    }
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return this.makeRequest<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(token: string): Promise<{ success: boolean; message: string }> {
    return this.makeRequest('/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getUser(token: string): Promise<any> {
    return this.makeRequest('/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async registerDoctor(doctorData: DoctorRegistrationData): Promise<RegistrationResponse> {
    return this.makeRequest<RegistrationResponse>('/doctors', {
      method: 'POST',
      body: JSON.stringify(doctorData),
    });
  }
}

export const apiService = new ApiService();
export default apiService;