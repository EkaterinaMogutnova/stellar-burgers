import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';

// Компонент страницы входа в систему
export const Login: FC = () => {
  // Локальное состояние для полей формы
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Получаем состояние загрузки и ошибки из Redux store
  const { loading, error } = useSelector((state) => state.user);

  // Определяем откуда пришел пользователь
  const from = location.state?.from || '/';

  // Обработчик отправки формы входа
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Диспатчим действие входа пользователя
    dispatch(loginUser({ email, password }))
      .unwrap() // Преобразуем результат в обычный Promise
      .then(() => {
        navigate(from, { replace: true });
      });
  };

  // Рендерим UI компонент входа
  return (
    <LoginUI
      errorText={error || ''} // Передаем текст ошибки (или пустую строку если нет ошибки)
      email={email} // Текущее значение email
      setEmail={setEmail} // Функция для обновления email
      password={password} // Текущее значение пароля
      setPassword={setPassword} // Функция для обновления пароля
      handleSubmit={handleSubmit} // Обработчик отправки формы
    />
  );
};
