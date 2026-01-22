export default async function globalTeardown() {
  // This runs once after all integration tests
  // In a real scenario, you might want to:
  // 1. Stop test containers
  // 2. Clean up test data
  
  // For now, we'll just log that teardown is complete
  // The actual containers should be managed by docker-compose.test.yml
  console.log('Integration test teardown complete');
}

