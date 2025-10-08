import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  updateUser,
  getUserState
} from '../../services/slices/userSlice/userSlice';

// Компонент страницы профиля пользователя
export const Profile: FC = () => {
  // Получаем данные пользователя
  const { user } = useSelector(getUserState);
  const dispatch = useDispatch();

  // Локальное состояние формы
  const [formValue, setFormValue] = useState({
    name: user?.name || '', // Имя пользователя
    email: user?.email || '', // Email пользователя
    password: '' // Пароль
  });

  // Эффект для синхронизации формы с данными пользователя
  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState, // Сохраняем текущий пароль
      name: user?.name || '', // Обновляем имя из данных пользователя
      email: user?.email || '' // Обновляем email из данных пользователя
    }));
  }, [user]);

  // Проверяем, были ли изменения в форме
  const isFormChanged =
    formValue.name !== user?.name || // Изменилось имя
    formValue.email !== user?.email || // Изменился email
    !!formValue.password; // Был введен пароль

  // Обработчик отправки формы
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUser(formValue));
  };

  // Обработчик отмены изменений
  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    // Сбрасываем форму к исходным значениям пользователя
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  // Обработчик изменения полей ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  // Рендерим UI компонент профиля
  return (
    <ProfileUI
      formValue={formValue} // Текущие значения формы
      isFormChanged={isFormChanged} // Флаг изменений формы
      handleCancel={handleCancel} // Функция отмены изменений
      handleSubmit={handleSubmit} // Функция сохранения изменений
      handleInputChange={handleInputChange} // Функция изменения полей
    />
  );
};
