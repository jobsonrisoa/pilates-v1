import { UseCase } from '@/shared/application/use-case.base';

type Request = { value: number };

class EchoUseCase extends UseCase<Request, number> {
  async execute(request: Request): Promise<number> {
    return request.value;
  }
}

describe('UseCase Base', () => {
  it('should allow implementing and executing a use case', async () => {
    const useCase = new EchoUseCase();

    await expect(useCase.execute({ value: 42 })).resolves.toBe(42);
  });
});
