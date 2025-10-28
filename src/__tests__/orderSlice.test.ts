import reducer, {
  initialState,
  getOrders,
  getOrderByNumber
} from '../services/slices/orderSlice/orderSlice';
import { TOrder } from '@utils-types';

const mockOrders: TOrder[] = [
  {
    _id: '1',
    status: 'done',
    name: 'Order 1',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    number: 1,
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941']
  }
];

const mockOrder: TOrder = {
  _id: '2',
  status: 'pending',
  name: 'Order 2',
  createdAt: '2023-01-02T00:00:00.000Z',
  updatedAt: '2023-01-02T00:00:00.000Z',
  number: 2,
  ingredients: ['643d69a5c3f7b9001cfa0942']
};

describe('orderSlice редьюсер', () => {
  test('При вызове экшена getOrders Request loading меняется на true', () => {
    const state = reducer(initialState, getOrders.pending('requestId'));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('При вызове экшена getOrders Success данные записываются в стор и loading меняется на false', () => {
    const state = reducer(
      initialState,
      getOrders.fulfilled(mockOrders, 'requestId')
    );
    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.error).toBeNull();
  });

  test('При вызове экшена getOrders Failed ошибка записывается в стор и loading меняется на false', () => {
    const state = reducer(
      initialState,
      getOrders.rejected(new Error('Ошибка загрузки заказов'), 'requestId')
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки заказов');
  });

  test('При вызове экшена getOrderByNumber Success currentOrder записывается в стор', () => {
    const state = reducer(
      initialState,
      getOrderByNumber.fulfilled(mockOrder, 'requestId', 2)
    );
    expect(state.currentOrder).toEqual(mockOrder);
    expect(state.loading).toBe(false);
  });
});
