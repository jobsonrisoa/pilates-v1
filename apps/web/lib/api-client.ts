const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_VERSION = '/api/v1';

export interface ApiError {
  message: string;
  statusCode: number;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryOn401 = true,
  ): Promise<T> {
    // Ensure endpoint starts with / and add API version prefix
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${API_VERSION}${normalizedEndpoint}`;
    // Access token is now in httpOnly cookie, no need to read from localStorage
    // Fallback to localStorage for backward compatibility during migration
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    // Use a mutable headers object so we can safely add Authorization
    const baseHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const headers: HeadersInit = {
      ...baseHeaders,
      ...(options.headers ?? {}),
    };

    // Only add Authorization header if token exists in localStorage (fallback)
    // In production, token should come from httpOnly cookie automatically
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Include cookies (accessToken and refreshToken)
    });

    if (response.ok) {
      return response.json() as Promise<T>;
    }

    // Try automatic refresh on 401 (except when already calling refresh)
    if (response.status === 401 && retryOn401 && !normalizedEndpoint.startsWith('/auth/refresh')) {
      try {
        const refreshResult = await this.request<{ accessToken: string }>(
          '/auth/refresh',
          { method: 'POST' },
          false,
        );

        if (typeof window !== 'undefined' && refreshResult?.accessToken) {
          localStorage.setItem('accessToken', refreshResult.accessToken);
        }

        const retryResponse = await this.request<T>(endpoint, options, false);
        return retryResponse;
      } catch (refreshError) {
        const error: ApiError =
          refreshError && typeof refreshError === 'object' && 'statusCode' in (refreshError as any)
            ? (refreshError as ApiError)
            : {
                message: 'Unauthorized',
                statusCode: 401,
              };
        throw error;
      }
    }

      const error: ApiError = await response.json().catch(() => ({
        message: 'An error occurred',
        statusCode: response.status,
      }));
      throw error;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T, TBody = unknown>(endpoint: string, data?: TBody): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T, TBody = unknown>(endpoint: string, data?: TBody): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

