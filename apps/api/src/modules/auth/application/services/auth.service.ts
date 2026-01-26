import { Injectable } from '@nestjs/common';
import { Either } from '@/shared/domain/either';
import { LoginUseCase } from '../use-cases/login.use-case';
import { LoginResult } from '../use-cases/login.use-case';

@Injectable()
export class AuthService {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  async login(email: string, password: string): Promise<Either<Error, LoginResult>> {
    return this.loginUseCase.execute(email, password);
  }
}

