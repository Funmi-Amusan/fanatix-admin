import type { ChangePasswordRequest, LoginRequest } from "./types/auth";
import type { updateUser } from "./types/users";

const API_BASE_URL = 'https://fanatix.usetend.com/api/v1';

export const httpClient = {
  post: async <T>(endpoint: string, data: LoginRequest| ChangePasswordRequest, token?: string| null): Promise<T> => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
  
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Request failed');
    }

    return response.json();
  },
  
  get: async <T>(endpoint: string, token?: string| null): Promise<T> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Request failed');
    }

    return response.json();
  },

  put: async <T>(endpoint: string, data: LoginRequest | updateUser, token?: string| null): Promise<T> => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
  
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Request failed');
    }

    return response.json();
  },

  patch: async <T>(endpoint: string, token?: string| null): Promise<T> => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
  
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers,
      });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Request failed');
    }

    return response.json();
  },

  delete: async <T>(endpoint: string, token?: string| null): Promise<T> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Request failed');
    }

    return response.json();
  },
};