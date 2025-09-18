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

export interface TimeSlot {
  date: string; // Date au format YYYY-MM-DD
  time: string; // Heure précise au format HH:MM
  id: string;
  status: string; // Statut du créneau (pending, confirmed, cancelled)
}

export interface ConsultationHours {
  monday: { slots: TimeSlot[]; available: boolean };
  tuesday: { slots: TimeSlot[]; available: boolean };
  wednesday: { slots: TimeSlot[]; available: boolean };
  thursday: { slots: TimeSlot[]; available: boolean };
  friday: { slots: TimeSlot[]; available: boolean };
  saturday: { slots: TimeSlot[]; available: boolean };
  sunday: { slots: TimeSlot[]; available: boolean };
}

export interface DoctorRegistrationData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  specialization: string[];
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

    console.log(`🌐 Requête API: ${options.method || 'GET'} ${url}`, {
      headers: config.headers,
      body: options.body ? JSON.parse(options.body as string) : undefined
    });

    try {
      const response = await fetch(url, config);
      
      console.log(`📡 Réponse API: ${response.status} ${response.statusText}`);
      
      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.error('❌ Erreur API:', errorData);
        } catch (jsonError) {
          console.error('❌ Erreur de parsing JSON:', jsonError);
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
      console.log('✅ Données reçues:', data);
      return data;
    } catch (error) {
      console.error('🚨 Erreur dans makeRequest:', error);
      
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

  // Doctor-related API methods
  async getDoctors(params?: {
    search?: string;
    specialization?: string;
    city?: string;
    available?: boolean;
    per_page?: number;
    page?: number;
  }): Promise<{
    success: boolean;
    data: {
      data: any[];
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
    message: string;
  }> {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.specialization) queryParams.append('specialization', params.specialization);
    if (params?.city) queryParams.append('city', params.city);
    if (params?.available !== undefined) queryParams.append('available', params.available.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    
    const endpoint = `/public/doctors${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest(endpoint);
  }

  async getSpecializations(): Promise<{
    success: boolean;
    data: string[];
    message: string;
  }> {
    return this.makeRequest('/specializations');
  }

  async createAppointment(
    appointmentData: {
      patient_id: number;
      doctor_id: number;
      appointment_date: string;
      appointment_type: 'presentiel' | 'visio' | 'domicile' | 'urgence' | 'suivi';
      reason_for_visit: string;
      duration_minutes?: number;
      notes?: string;
      consultation_fee: number;
      status?: string;
      created_by_user_id: number;
    },
    token: string
  ): Promise<{
    success: boolean;
    data?: any;
    message: string;
    errors?: Record<string, string[]>;
  }> {
    return this.makeRequest('/appointments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });
  }
}

export const apiService = new ApiService();
export default apiService;