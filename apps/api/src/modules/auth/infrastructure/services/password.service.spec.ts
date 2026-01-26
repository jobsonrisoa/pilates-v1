import { PasswordService } from './password.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('PasswordService', () => {
  let passwordService: PasswordService;

  beforeEach(() => {
    passwordService = new PasswordService();
    jest.clearAllMocks();
  });

  describe('hash', () => {
    it('should hash password with bcrypt', async () => {
      const password = 'Password123!';
      const hashedPassword = 'hashed-password';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await passwordService.hash(password);

      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 12);
    });
  });

  describe('compare', () => {
    it('should compare password with hash', async () => {
      const password = 'Password123!';
      const hash = 'hashed-password';

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await passwordService.compare(password, hash);

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
    });

    it('should return false when password does not match', async () => {
      const password = 'WrongPassword123!';
      const hash = 'hashed-password';

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await passwordService.compare(password, hash);

      expect(result).toBe(false);
    });
  });
});

