import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import ProtectedRoute from '../protected-route/protected-route';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { getIngredients } from '../../services/slices/ingredientSlice/ingredientSlice';
import { getUser } from '../../services/slices/userSlice/userSlice';

const App = () => {
  const location = useLocation(); // Текущий путь и состояние
  const navigate = useNavigate(); // Функция для перехода по страницам
  const dispatch = useDispatch(); // Функция для отправки действий в Redux

  const background = location.state?.background;

  useEffect(() => {
    // Загружаем список ингредиентов при запуске приложения
    dispatch(getIngredients());
    // Проверяем авторизацию пользователя (есть ли токен)
    dispatch(getUser());
  }, [dispatch]);

  const handleModalClose = () => {
    // Возвращаемся на предыдущую страницу
    navigate(-1);
  };

  return (
    // Шапка приложения на всех страницах
    <div className={styles.app}>
      <AppHeader />

      {/* Основные маршруты */}
      <Routes location={background || location}>
        {/* Публичные маршруты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* Маршруты с отдельными страницами */}
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />

        {/* Маршруты только для неавторизованных */}
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* Маршруты только для авторизованных */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute onlyUnAuth={false}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute onlyUnAuth={false}>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute onlyUnAuth={false}>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна */}
      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Детали ингредиента'} onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={`#${location.pathname.split('/').pop()}`}
                onClose={handleModalClose}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title={`#${location.pathname.split('/').pop()}`}
                onClose={handleModalClose}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
