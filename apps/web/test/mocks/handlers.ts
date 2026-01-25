import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' });
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    if (body.email === 'test@test.com' && body.password === 'password') {
      return HttpResponse.json({
        user: { id: '1', email: 'test@test.com', name: 'Test User' },
        accessToken: 'mock-token',
      });
    }

    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }),
];

