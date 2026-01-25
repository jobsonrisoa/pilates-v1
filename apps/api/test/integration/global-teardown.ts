import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

export default async function globalTeardown() {
  console.log('\nCleaning up test containers...');

  // Find project root (go up from apps/api to root)
  const projectRoot = join(__dirname, '../../../../');
  const dockerComposeTestFile = join(projectRoot, 'docker-compose.test.yml');

  if (!existsSync(dockerComposeTestFile)) {
    console.log('docker-compose.test.yml not found, skipping container cleanup');
    return;
  }

  try {
    // Stop and remove test containers (with volumes)
    execSync('docker compose -f docker-compose.test.yml down -v', {
      stdio: 'inherit',
      cwd: projectRoot,
    });

    console.log('Test containers cleaned up!\n');
  } catch (error) {
    console.error('Failed to cleanup test containers:', error);
    // Don't throw - teardown should not fail the test suite
  }
}

