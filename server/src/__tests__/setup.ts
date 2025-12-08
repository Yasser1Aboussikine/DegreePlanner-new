// Test setup file
import '@jest/globals';

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key";
process.env.JWT_EXPIRES_IN = "1h";
process.env.JWT_REFRESH_EXPIRES_IN = "7d";

// Global test timeout
jest.setTimeout(30000);

beforeAll(async () => {
  // Setup code that runs before all tests
  console.log("🧪 Test suite starting...");
});

afterAll(async () => {
  // Cleanup code that runs after all tests
  console.log("✅ Test suite completed");
});

afterEach(() => {
  // Clear all mocks after each test
  jest.clearAllMocks();
});
