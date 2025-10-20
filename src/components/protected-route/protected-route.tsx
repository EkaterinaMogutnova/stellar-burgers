import { Navigate, useLocation } from 'react-router-dom';
import { ReactElement } from 'react';
import { useSelector } from '../../services/store';
import { getUserState } from '../../services/slices/userSlice/userSlice';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean; // только для НЕавторизованных
  children: ReactElement;
}

// контролирует доступ к страницам
const ProtectedRoute = ({
  onlyUnAuth = false, // По умолчанию для авторизованных
  children
}: ProtectedRouteProps) => {
  // Получаем текущий путь для сохранения истории навигации
  const location = useLocation();

  // Получаем статус авторизации из Redux store
  const { isAuthenticated } = useSelector(getUserState);

  // Проверяем наличие токена в localStorage
  const token = localStorage.getItem('accessToken');

  // Маршрут только для НЕавторизованных

  if (onlyUnAuth && (isAuthenticated || token)) {
    // Если пользователь УЖЕ авторизован, перенаправляем его:
    const from = location.state?.from || '/'; // Откуда пришел или на главную
    return <Navigate to={from} replace />; // Заменяем текущую запись в истории
  }

  //Маршрут только для авторизованных

  if (!onlyUnAuth && !isAuthenticated && !token) {
    // Если пользователь НЕ авторизован, перенаправляем на страницу логина:
    return <Navigate to='/login' state={{ from: location }} replace />;
    // Сохраняем текущее местоположение в state, чтобы после логина вернуться обратно
  }

  // Если проверки пройдены - рендерим дочерний компонент
  return children;
};

export default ProtectedRoute;
