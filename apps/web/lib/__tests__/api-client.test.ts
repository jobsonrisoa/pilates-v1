import { apiClient, ApiClient } from '../api-client';

// Mock fetch
global.fetch = jest.fn();

describe('ApiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('get', () => {
    it('should make GET request with correct headers', async () => {
      const mockResponse = { data: 'test' };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiClient.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          credentials: 'include',
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('post', () => {
    it('should make POST request with body', async () => {
      const mockResponse = { success: true };
      const requestData = { email: 'test@example.com', password: 'password' };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiClient.post('/auth/login', requestData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestData),
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when response is not ok', async () => {
      const errorResponse = { message: 'Error', statusCode: 401 };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => errorResponse,
      });

      await expect(apiClient.post('/auth/login', {})).rejects.toEqual(errorResponse);
    });
  });

  describe('with token', () => {
    beforeEach(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', 'test-token');
      }
    });

    afterEach(() => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
      }
    });

    it('should include Authorization header when token exists', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await apiClient.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        }),
      );
    });
  });
});

