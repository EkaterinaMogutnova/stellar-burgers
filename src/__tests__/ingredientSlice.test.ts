import reducer, {
  initialState,
  getIngredients
} from '../services/slices/ingredientSlice/ingredientSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
  }
];

describe('ingredientSlice редьюсер', () => {
  test('При вызове экшена Request loading меняется на true', () => {
    const state = reducer(initialState, getIngredients.pending('requestId'));
    expect(state.loading).toBe(true);
  });

  test('При вызове экшена Success данные записываются в стор и loading меняется на false', () => {
    const state = reducer(
      initialState,
      getIngredients.fulfilled(mockIngredients, 'requestId')
    );
    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  test('При вызове экшена Failed ошибка записывается в стор и loading меняется на false', () => {
    const state = reducer(
      initialState,
      getIngredients.rejected(new Error('Ошибка загрузки'), 'requestId')
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
