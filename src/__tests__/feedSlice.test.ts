import reducer, {
  initialState,
  getFeeds
} from '../services/slices/feedSlice/feedSlice';
import { TOrder } from '@utils-types';

const mockOrders: TOrder[] = [
  {
    _id: '1',
    status: 'done',
    name: 'Feed Order 1',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    number: 1,
    ingredients: ['643d69a5c3f7b9001cfa093c']
  }
];

const mockFeedsResponse = {
  success: true,
  orders: mockOrders,
  total: 100,
  totalToday: 10
};

describe('feedSlice редьюсер', () => {
  test('При вызове экшена getFeeds Request loading меняется на true', () => {
    const state = reducer(initialState, getFeeds.pending('requestId'));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('При вызове экшена getFeeds Success данные записываются в стор и loading меняется на false', () => {
    const state = reducer(
      initialState,
      getFeeds.fulfilled(mockFeedsResponse, 'requestId')
    );
    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(10);
    expect(state.error).toBeNull();
  });

  test('При вызове экшена getFeeds Failed ошибка записывается в стор и loading меняется на false', () => {
    const state = reducer(
      initialState,
      getFeeds.rejected(new Error('Ошибка загрузки ленты'), 'requestId')
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки ленты');
  });
});
