import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TLoginData,
  TRegisterData
} from '@api';
import { setCookie, deleteCookie, getCookie } from '../../../utils/cookie'; // Добавьте getCookie

// Тип состояния для пользователя
type TUserState = {
  isAuthenticated: boolean;
  user: TUser | null;
  loading: boolean;
  error: string | null;
};

// Начальное состояние - пользователь не авторизован
export const initialState: TUserState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null
};

// Вход пользователя в систему
export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);

    // Сохраняем токены для последующих авторизованных запросов
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);

    return response;
  }
);

// Регистрация нового пользователя
export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);

    // Сохраняем токены
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);

    return response;
  }
);

// Получение данных пользователя - ИСПРАВЛЕННАЯ ВЕРСИЯ
export const getUser = createAsyncThunk(
  'user/get',
  async (_, { rejectWithValue }) => {
    const accessToken = getCookie('accessToken'); // Проверяем наличие токена
    const refreshToken = localStorage.getItem('refreshToken');

    // Если нет токенов - не делаем запрос
    if (!accessToken || !refreshToken) {
      return rejectWithValue('No tokens');
    }

    try {
      return await getUserApi();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Обновление данных пользователя
export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => updateUserApi(data)
);

// Выход пользователя из системы
export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();

  // Удаляем токены на клиенте
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Синхронный action для очистки ошибок
    clearError: (state) => {
      state.error = null;
    }
  },
  selectors: {
    // Селектор для получения всего состояния пользователя
    getUserState: (state) => state
  },
  // Обработка асинхронных actions
  extraReducers: (builder) => {
    builder
      // Логин - начало
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Логин - успех
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      // Логин - ошибка
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      // Регистрация - начало
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Регистрация - успех (пользователь автоматически логинится)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      // Регистрация - ошибка
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      // Получение пользователя - начало (проверка авторизации)
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      // Получение пользователя - успех (токен валиден)
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      // Получение пользователя - ошибка (включая случай когда нет токенов)
      .addCase(getUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      // Обновление пользователя - начало
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Обновление пользователя - успех
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // Обновляем данные пользователя
        state.error = null;
      })
      // Обновление пользователя - ошибка
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      // Выход - начало
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      // Выход - успех
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      // Выход - ошибка
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      });
  }
});

export const { clearError } = userSlice.actions;

export const { getUserState } = userSlice.selectors;

export default userSlice.reducer;
