import { rootReducer } from '../services/store';

describe('rootReducer инициализация', () => {
  test('Проверяет правильную инициализацию rootReducer', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initialState).toEqual({
      ingredient: {
        ingredients: [],
        loading: false,
        error: null
      },
      constructorBurger: {
        constructorItems: {
          bun: null,
          ingredients: []
        },
        orderRequest: false,
        orderModalData: null,
        loading: false,
        error: null
      },
      user: {
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      },
      order: {
        orders: [],
        currentOrder: null,
        loading: false,
        error: null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null
      }
    });
  });
});
