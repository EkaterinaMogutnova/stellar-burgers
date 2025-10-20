import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';
import { getFeedsApi } from '@api';

// Тип состояния для ленты заказов
type TFeedState = {
  orders: TOrder[]; // Массив всех заказов в ленте
  total: number; // Общее количество заказов за все время
  totalToday: number; // Количество заказов за сегодня
  loading: boolean; // Флаг загрузки данных
  error: string | null; // Текст ошибки если
};

// Начальное состояние - пустая лента заказов
export const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

// Асинхронный action для получения ленты заказов
export const getFeeds = createAsyncThunk('feed/getAll', async () => {
  const response = await getFeedsApi(); // Вызов API функции для получения заказов
  return response;
});

// Создание slice для управления состоянием ленты заказов
export const feedSlice = createSlice({
  name: 'feed', // Имя slice
  initialState, // Начальное состояние
  reducers: {},
  selectors: {
    // Селектор для получения всего состояния ленты заказов
    getFeedState: (state) => state
  },
  // Обработка асинхронных actions
  extraReducers: (builder) => {
    builder
      // Когда запрос на получение заказов начинается
      .addCase(getFeeds.pending, (state) => {
        state.loading = true; // Показываем загрузку
        state.error = null; // Сбрасываем ошибки
      })
      // Когда запрос успешно завершен
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.loading = false; // Скрываем загрузку
        // Сохраняем данные с сервера в состояние
        state.orders = action.payload.orders; // Массив заказов
        state.total = action.payload.total; // Общее количество заказов
        state.totalToday = action.payload.totalToday; // Заказов за сегодня
      })
      // Когда запрос завершился ошибкой
      .addCase(getFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      });
  }
});

export const { getFeedState } = feedSlice.selectors;

export default feedSlice.reducer;
