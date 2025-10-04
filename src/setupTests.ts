// jest-setup.ts
import '@testing-library/jest-dom';

Object.defineProperty(global, 'import.meta', {
  value: {
    env: {
      VITE_RAZORPAY_KEY_ID: 'test_key',
      DEV: true,
    },
  },
});
