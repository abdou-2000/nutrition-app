import { registerSchema } from '../src/validators/authValidator.js';

async function run() {
  try {
    await registerSchema.validateAsync({ name: 'Test', email: 'test@test.com', password: '123456' });
    console.log('Validation OK');
  } catch (e) {
    console.error('Validation failed', e);
    process.exit(1);
  }
}

run();
