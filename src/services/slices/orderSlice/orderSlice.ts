import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi, getOrderByNumberApi } from '@api';

// Тип состояния для заказов пользователя
type TOrderState = {
  orders: TOrder[];
  currentOrder: TOrder | null;
  loading: boolean;
  error: string | null;
};

// Начальное состояние - пустая история заказов
export const initialState: TOrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null
};

// Асинхронный action для получения всех заказов пользователя
export const getOrders = createAsyncThunk('order/getAll', async () => {
  const response = await getOrdersApi(); // API запрос для получения заказов пользователя
  return response; // Возвращаем массив заказов
});

// Асинхронный action для получения конкретного заказа по номеру
export const getOrderByNumber = createAsyncThunk(
  'order/getByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number); // API запрос для получения заказа по номеру
    return response.orders[0]; // Извлекаем первый заказ из массива
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  selectors: {
    getOrderState: (state) => state
  },
  extraReducers: (builder) => {
    builder
      // Загрузка всех заказов началась
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Все заказы успешно загружены
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      // Загрузка всех заказов завершилась ошибкой
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      // Загрузка конкретного заказа по номеру началась
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentOrder = null; // Сбрасываем предыдущий заказ при новой загрузке
      })
      // Конкретный заказ по номеру успешно загружен
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      // Загрузка конкретного заказа по номеру завершилась ошибкой
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
        state.currentOrder = null; // Гарантируем что currentOrder будет null при ошибке
      });
  }
});

export const { getOrderState } = orderSlice.selectors;

export default orderSlice.reducer;
