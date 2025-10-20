import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink, useLocation } from 'react-router-dom';
// UI компонент шапки приложения
export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();
  // Функция для определения типа иконки
  const getIconType = (path: string) =>
    location.pathname === path ? 'primary' : 'secondary';

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            <BurgerIcon type={getIconType('/')} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </NavLink>
          <NavLink
            to='/feed'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            <ListIcon type={getIconType('/feed')} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </NavLink>
        </div>
        <div className={styles.logo}>
          <NavLink to='/'>
            <Logo className='' />
          </NavLink>
        </div>
        <div className={styles.link_position_last}>
          <NavLink
            to='/profile'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            <ProfileIcon type={getIconType('/profile')} />
            <p className='text text_type_main-default ml-2'>
              {/* Показываем имя пользователя если авторизован, иначе "Личный кабинет" */}
              {userName || 'Личный кабинет'}
            </p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
