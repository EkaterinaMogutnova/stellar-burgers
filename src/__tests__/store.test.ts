import store, { RootState } from '../services/store';

describe('store', () => {
  test('should properly initialize store', () => {
    // Проверка, что стор создан
    expect(store).toBeDefined();

    // Получение состояния
    const state = store.getState() as RootState;

    // Проверка, что состояние существует
    expect(state).toBeDefined();

    // Проверка основных слайсов
    expect(state.ingredient).toBeDefined();
    expect(state.constructorBurger).toBeDefined();
    expect(state.user).toBeDefined();
    expect(state.order).toBeDefined();
    expect(state.feed).toBeDefined();
  });
});
