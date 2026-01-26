import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

export default async function globalSetup() {
  console.log('\nStarting test containers...');

  // Check if docker is available
  try {
    execSync('docker --version', { stdio: 'ignore' });
  } catch {
    console.warn('Docker not available in test environment, skipping container setup');
    console.log('Make sure test containers (mysql, redis) are running via docker-compose');
    return;
  }

  // Find project root (go up from apps/api to root)
  const projectRoot = join(__dirname, '../../../../');
  const dockerComposeTestFile = join(projectRoot, 'docker-compose.test.yml');

  if (!existsSync(dockerComposeTestFile)) {
    console.warn('docker-compose.test.yml not found, skipping container setup');
    console.log('Make sure test containers are running manually or use docker-compose.test.yml');
    return;
  }

  try {
    // Start test containers
    execSync('docker compose -f docker-compose.test.yml up -d mysql-test redis-test', {
      stdio: 'inherit',
      cwd: projectRoot,
    });

    // Wait for containers to be healthy
    console.log('Waiting for containers to be ready...');
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // Generate Prisma client for test database
    console.log('Generating Prisma client...');
    execSync('pnpm --filter @pilates/api prisma:generate', {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: 'mysql://root:test@localhost:3307/pilates_test',
      },
      cwd: projectRoot,
    });

    // Run migrations on test database
    console.log('Running migrations on test database...');
    execSync('pnpm --filter @pilates/api prisma migrate deploy', {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: 'mysql://root:test@localhost:3307/pilates_test',
      },
      cwd: projectRoot,
    });

    console.log('Test environment ready!\n');
  } catch (error) {
    console.error('Failed to setup test containers:', error);
    console.warn('Continuing without test containers - ensure mysql and redis are running');
  }
}
