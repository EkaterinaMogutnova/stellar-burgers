import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

// Тип состояния для ингредиентов
export type TIngredientState = {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
};

// Начальное состояние - ингредиенты не загружены
export const initialState: TIngredientState = {
  ingredients: [],
  loading: false,
  error: null
};

// Асинхронный action для получения списка ингредиентов
export const getIngredients = createAsyncThunk('ingredient/get', async () => {
  try {
    const response = await getIngredientsApi(); // Вызов API функции для получения ингредиентов
    return response;
  } catch (error) {
    // Логируем ошибку для отладки
    console.error('API error:', error);

    throw error;
  }
});

// Создание slice для управления состоянием ингредиентов
export const ingredientSlice = createSlice({
  name: 'ingredient', // Имя slice
  initialState, // Начальное состояние
  reducers: {},
  selectors: {
    // Селектор для получения всего состояния ингредиентов
    getIngredientState: (state) => state
  },
  // Обработка асинхронных actions (getIngredients)
  extraReducers: (builder) => {
    builder
      // Когда запрос на получение ингредиентов начинается
      .addCase(getIngredients.pending, (state) => {
        state.loading = true; // Показываем загрузку
        state.error = null; // Сбрасываем ошибки
      })
      // Когда запрос завершился ошибкой
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false; // Скрываем загрузку
        state.error = action.error.message as string; // Сохраняем текст ошибки
      })
      // Когда запрос успешно завершен
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false; // Скрываем загрузку
        state.error = null; // Сбрасываем ошибки
        state.ingredients = action.payload; // Сохраняем массив ингредиентов
      });
  }
});

export const { getIngredientState } = ingredientSlice.selectors;

export default ingredientSlice.reducer;
