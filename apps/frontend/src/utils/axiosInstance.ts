import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
} from 'axios';
import type { AppDispatch, RootState } from './store';
import {
  setAccessToken,
  setAuthenticatedUser,
} from '../features/auth/authSlice';

export interface ApiRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean; // Pour les requêtes qui n'ont pas besoin d'auth
}

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private baseUrl: string;
  private getState: () => RootState;
  private dispatch: AppDispatch;

  constructor(
    baseUrl: string,
    getState: () => RootState,
    dispatch: AppDispatch,
  ) {
    this.baseUrl = baseUrl;
    this.getState = getState;
    this.dispatch = dispatch;

    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      withCredentials: true,
    });
  }

  private getAccessToken(): string | null {
    return this.getState().auth.accessToken;
  }

  private async makeRequest<T = unknown>(
    config: ApiRequestConfig,
  ): Promise<AxiosResponse<T>> {
    // Ajouter le token d'accès si nécessaire
    if (!config.skipAuth) {
      const token = this.getAccessToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    return this.axiosInstance.request<T>(config);
  }

  private async refreshToken(): Promise<string> {
    // à voir
    const response = await axios.post(
      `${this.baseUrl}/auth/refresh`,
      {},
      { withCredentials: true },
    );

    const newToken = response.data.accessToken;
    this.dispatch(setAccessToken({ accessToken: newToken }));
    this.dispatch(setAuthenticatedUser({ user: response.data.user }));

    return newToken;
  }

  async request<T = unknown>(config: ApiRequestConfig): Promise<T> {
    try {
      const response = await this.makeRequest<T>(config);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;

      // Si 401 et pas skip auth, essayer de refresh
      if (axiosError.response?.status === 401 && !config.skipAuth) {
        try {
          const newToken = await this.refreshToken();

          // Retry avec le nouveau token
          const retryConfig: ApiRequestConfig = {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${newToken}`,
            },
          };

          const response = await this.makeRequest<T>(retryConfig);
          return response.data;
        } catch (refreshError) {
          console.log('refresh error in apiClient', refreshError);
          // Le refresh a échoué, propager l'erreur
          // L'AuthGate gèrera la redirection
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
      }

      // Pour toutes les autres erreurs, propager directement
      throw axiosError;
    }
  }

  async get<T = unknown>(
    url: string,
    config?: Omit<ApiRequestConfig, 'method' | 'url'>,
  ): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: Omit<ApiRequestConfig, 'method' | 'url' | 'data'>,
  ): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: Omit<ApiRequestConfig, 'method' | 'url' | 'data'>,
  ): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: Omit<ApiRequestConfig, 'method' | 'url' | 'data'>,
  ): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async delete<T = unknown>(
    url: string,
    config?: Omit<ApiRequestConfig, 'method' | 'url'>,
  ): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }
}

// Singleton pour gérer une instance unique
let apiClientInstance: ApiClient | null = null;

export const createApiClient = (
  baseUrl: string,
  getState: () => RootState,
  dispatch: AppDispatch,
): ApiClient => {
  if (!apiClientInstance) {
    apiClientInstance = new ApiClient(baseUrl, getState, dispatch);
  }
  return apiClientInstance;
};

export const getApiClient = (): ApiClient => {
  if (!apiClientInstance) {
    throw new Error(
      'ApiClient not initialized. Call createApiClient first in your store configuration.',
    );
  }
  return apiClientInstance;
};
