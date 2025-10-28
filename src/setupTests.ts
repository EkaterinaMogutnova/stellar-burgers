import '@testing-library/jest-dom';

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn(),
  getFeedsApi: jest.fn(),
  getOrdersApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

jest.mock('@reduxjs/toolkit', () => ({
  ...jest.requireActual('@reduxjs/toolkit'),
  nanoid: () => 'mock-id-123'
}));
