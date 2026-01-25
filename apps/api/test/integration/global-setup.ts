import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

export default async function globalSetup() {
  console.log('\n🔧 Setting up integration test environment...');

  // Find project root (go up from apps/api to root)
  const projectRoot = join(__dirname, '../../../../');
  const dockerComposeTestFile = join(projectRoot, 'docker-compose.test.yml');

  // Check if we can access Docker (Docker-in-Docker or host socket)
  let canUseDocker = false;
  try {
    execSync('docker --version', { stdio: 'ignore' });
    canUseDocker = true;
  } catch {
    console.log('💡 Docker not available in container, assuming test containers are already running');
  }

  try {
    // Start test containers only if Docker is available and docker-compose.test.yml exists
    if (canUseDocker && existsSync(dockerComposeTestFile)) {
      console.log('🐳 Starting test containers...');
      execSync('docker compose -f docker-compose.test.yml up -d mysql-test redis-test', {
        stdio: 'inherit',
        cwd: projectRoot,
      });

      // Wait for containers to be healthy
      console.log('⏳ Waiting for containers to be ready...');
      await new Promise((resolve) => setTimeout(resolve, 10000));
    } else {
      console.log('⏳ Waiting for test containers to be ready...');
      // Wait a bit for containers that might be starting externally
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    // Generate Prisma client (always needed)
    console.log('🔧 Generating Prisma client...');
    execSync('pnpm --filter @pilates/api prisma:generate', {
      stdio: 'inherit',
      cwd: projectRoot,
    });

    // Run migrations on test database
    console.log('📦 Running migrations on test database...');
    const testDatabaseUrl = process.env.DATABASE_URL || 'mysql://root:test@localhost:3307/pilates_test';
    execSync('pnpm --filter @pilates/api prisma migrate deploy', {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: testDatabaseUrl,
      },
      cwd: projectRoot,
    });

    console.log('✅ Test environment ready!\n');
  } catch (error) {
    console.error('❌ Failed to setup test environment:', error);
    throw error;
  }
}

