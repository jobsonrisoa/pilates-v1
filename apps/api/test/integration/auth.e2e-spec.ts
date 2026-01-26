import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/shared/infrastructure/database/prisma.service';
import * as bcrypt from 'bcrypt';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Clean up test data
    await prisma.userRole.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.role.deleteMany({});

    // Create test role
    await prisma.role.create({
      data: {
        name: 'ADMIN',
        description: 'Administrator',
      },
    });
  });

  afterAll(async () => {
    await prisma.userRole.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.role.deleteMany({});
    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      // Arrange: Create a test user
      const passwordHash = await bcrypt.hash('Password123!', 12);
      const role = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          passwordHash,
          isActive: true,
        },
      });

      if (role) {
        await prisma.userRole.create({
          data: {
            userId: user.id,
            roleId: role.id,
          },
        });
      }

      // Act: Make login request
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
        })
        .expect(200);

      // Assert: Check response
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.roles).toContain('ADMIN');
      expect(response.headers['set-cookie']).toBeDefined();
      expect(
        response.headers['set-cookie']?.some((cookie: string) =>
          cookie.startsWith('refreshToken='),
        ),
      ).toBe(true);
    });

    it('should return 401 for invalid email', async () => {
      // Act & Assert
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toContain('Invalid credentials');
        });
    });

    it('should return 401 for invalid password', async () => {
      // Arrange: Create a test user
      const passwordHash = await bcrypt.hash('Password123!', 12);
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          passwordHash,
          isActive: true,
        },
      });

      // Act & Assert
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword123!',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toContain('Invalid credentials');
        });
    });

    it('should return 401 for inactive user', async () => {
      // Arrange: Create an inactive user
      const passwordHash = await bcrypt.hash('Password123!', 12);
      await prisma.user.create({
        data: {
          email: 'inactive@example.com',
          passwordHash,
          isActive: false,
        },
      });

      // Act & Assert
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'inactive@example.com',
          password: 'Password123!',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toContain('Invalid credentials');
        });
    });

    it('should return 400 for invalid email format', async () => {
      // Act & Assert
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'invalid-email',
          password: 'Password123!',
        })
        .expect(400);
    });

    it('should return 400 for missing fields', async () => {
      // Act & Assert
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
        })
        .expect(400);
    });

    it('should enforce rate limiting (5 requests per minute)', async () => {
      // Arrange: Create a test user
      const passwordHash = await bcrypt.hash('Password123!', 12);
      await prisma.user.create({
        data: {
          email: 'ratelimit@example.com',
          passwordHash,
          isActive: true,
        },
      });

      // Act: Make 6 requests rapidly
      const requests = Array.from({ length: 6 }, () =>
        request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'ratelimit@example.com',
            password: 'WrongPassword123!', // Wrong password to avoid success
          }),
      );

      const responses = await Promise.all(requests);

      // Assert: 6th request should be rate limited (429)
      const rateLimitedResponse = responses.find((res) => res.status === 429);
      expect(rateLimitedResponse).toBeDefined();
    }, 30000); // Increased timeout for rate limiting test
  });
});

