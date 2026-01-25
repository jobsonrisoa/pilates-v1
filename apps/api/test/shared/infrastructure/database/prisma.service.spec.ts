describe('PrismaService', () => {
  const connectMock = jest.fn(async () => {});
  const disconnectMock = jest.fn(async () => {});

  beforeEach(() => {
    connectMock.mockClear();
    disconnectMock.mockClear();

    // `test/setup.ts` mocks PrismaService globally; reset module registry and unmock it here
    // so this spec can cover the real implementation.
    jest.resetModules();
    jest.unmock('@/shared/infrastructure/database/prisma.service');

    // Avoid loading/using the real Prisma runtime in unit tests.
    jest.doMock('@prisma/client', () => {
      class PrismaClient {
        public $connect = connectMock;
        public $disconnect = disconnectMock;
      }
      return { PrismaClient };
    });
  });

  it('onModuleInit should call $connect', async () => {
    const { PrismaService: PrismaServiceClass } = await import('@/shared/infrastructure/database/prisma.service');
    const service = new PrismaServiceClass();

    await service.onModuleInit();

    expect(connectMock).toHaveBeenCalledTimes(1);
  });

  it('onModuleDestroy should call $disconnect', async () => {
    const { PrismaService: PrismaServiceClass } = await import('@/shared/infrastructure/database/prisma.service');
    const service = new PrismaServiceClass();

    await service.onModuleDestroy();

    expect(disconnectMock).toHaveBeenCalledTimes(1);
  });
});


