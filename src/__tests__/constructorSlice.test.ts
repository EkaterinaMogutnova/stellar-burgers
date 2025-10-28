import reducer, {
  initialState,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown
} from '../services/slices/constructorSlice/constructorSlice';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
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
};

const mockMain: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png'
};

describe('burgerConstructor редьюсер', () => {
  test('Обработка экшена добавления ингредиента', () => {
    const state = reducer(initialState, addIngredient(mockMain));
    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0]._id).toBe(
      '643d69a5c3f7b9001cfa0941'
    );
  });

  test('Обработка экшена удаления ингредиента', () => {
    // Сначала добавляем ингредиент
    let state = reducer(initialState, addIngredient(mockMain));
    const ingredientId = state.constructorItems.ingredients[0].id;

    // Затем удаляем
    state = reducer(state, removeIngredient(ingredientId));
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  test('Обработка экшена изменения порядка ингредиентов в начинке', () => {
    const initialStateWithIngredients = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [
          { _id: '1', name: 'Первый', id: 'id-1' } as TIngredient & {
            id: string;
          },
          { _id: '2', name: 'Второй', id: 'id-2' } as TIngredient & {
            id: string;
          },
          { _id: '3', name: 'Третий', id: 'id-3' } as TIngredient & {
            id: string;
          }
        ]
      }
    };

    // Перемещаем второй ингредиент вверх
    const state = reducer(initialStateWithIngredients, moveIngredientUp(1));
    expect(state.constructorItems.ingredients[0]._id).toBe('2');
    expect(state.constructorItems.ingredients[1]._id).toBe('1');
  });
});
