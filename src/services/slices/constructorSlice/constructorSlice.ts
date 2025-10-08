import { orderBurgerApi } from '@api';
import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  nanoid
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

// Тип состояния конструктора бургеров
export type TConstructorState = {
  loading: boolean;
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

// Начальное состояние - пустой конструктор
export const initialState: TConstructorState = {
  loading: false,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  error: null
};

// Асинхронный action для создания заказа
// Принимает массив ID ингредиентов
export const orderBurger = createAsyncThunk(
  'user/order',
  async (data: string[]) => orderBurgerApi(data) // Вызов API функции для создания заказа
);

// Создание slice для управления состоянием конструктора
export const constructorSlice = createSlice({
  name: 'constructorBurger', // Уникальное имя slice
  initialState, // Начальное состояние
  selectors: {
    // Селектор для получения всего состояния конструктора
    getConstructorState: (state) => state
  },
  reducers: {
    // Action для добавления ингредиента в конструктор
    addIngredient: {
      // Функция-редюсер которая изменяет состояние
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          // Если это булка - заменяем текущую булку
          state.constructorItems.bun = action.payload;
        } else {
          // Если это начинка или соус - добавляем в массив
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      // Функция prepare подготавливает данные перед передачей в reducer
      prepare: (ingredient: TIngredient) => {
        // Генерируем уникальный ID для каждого ингредиента в конструкторе

        const id = nanoid();
        // Возвращаем объект с payload и добавляем сгенерированный id
        return { payload: { ...ingredient, id } };
      }
    },
    // Action для удаления ингредиента из конструктора
    removeIngredient: (state, action: PayloadAction<string>) => {
      // Фильтруем массив ингредиентов, оставляя только те, у которых id не совпадает с переданным
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (i) => i.id !== action.payload
        );
    },
    // Action для перемещения ингредиента вверх по списку
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      // Получаем индекс текущего элемента
      const currentIndex = action.payload;
      // Меняем местами текущий элемент с предыдущим
      state.constructorItems.ingredients.splice(
        currentIndex, // На позицию текущего элемента
        0, // Не удаляем элементы
        state.constructorItems.ingredients.splice(currentIndex - 1, 1)[0] // Берем предыдущий элемент
      );
    },
    // Action для перемещения ингредиента вниз по списку
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      // Получаем индекс текущего элемента
      const currentIndex = action.payload;
      // Меняем местами текущий элемент со следующим
      state.constructorItems.ingredients.splice(
        currentIndex, // На позицию текущего элемента
        0, // Не удаляем элементы
        state.constructorItems.ingredients.splice(currentIndex + 1, 1)[0] // Берем следующий элемент
      );
    },
    // Action для установки флага отправки заказа
    setRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },
    // Action для сброса данных модального окна заказа
    resetModal: (state) => {
      state.orderModalData = null;
    }
  },
  // Обработка асинхронных actions
  extraReducers: (builder) => {
    builder
      // Когда заказ начинается
      .addCase(orderBurger.pending, (state) => {
        state.loading = true; // Показываем загрузку
        state.orderRequest = true; // Показываем модальное окно
        state.error = null; // Сбрасываем ошибки
      })
      // Когда заказ завершился ошибкой
      .addCase(orderBurger.rejected, (state, action) => {
        state.loading = false; // Скрываем загрузку
        state.orderRequest = false; // Скрываем модальное окно
        state.error = action.error.message as string; // Сохраняем текст ошибки
      })
      // Когда заказ успешно создан
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.loading = false; // Скрываем загрузку
        state.orderRequest = false; // Скрываем модальное окно загрузки
        state.error = null; // Сбрасываем ошибки
        state.orderModalData = action.payload.order; // Сохраняем данные заказа (номер и т.д.)
        // Очищаем конструктор после успешного заказа
        state.constructorItems = {
          bun: null,
          ingredients: []
        };
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  setRequest,
  resetModal
} = constructorSlice.actions;

export const { getConstructorState } = constructorSlice.selectors;

export default constructorSlice.reducer;
