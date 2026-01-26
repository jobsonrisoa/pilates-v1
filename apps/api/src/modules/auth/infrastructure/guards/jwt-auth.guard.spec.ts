import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    expect(JwtAuthGuard).toBeDefined();
  });

  it('should be instantiable', () => {
    const guard = new JwtAuthGuard();
    expect(guard).toBeDefined();
  });
});

