import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeeds,
  getFeedState
} from '../../services/slices/feedSlice/feedSlice';

// Компонент страницы ленты заказов
export const Feed: FC = () => {
  const dispatch = useDispatch();

  // Получаем данные о заказах из Redux store
  const { orders, loading } = useSelector(getFeedState);

  // Эффект для загрузки заказов
  useEffect(() => {
    dispatch(getFeeds()); // Запускаем запрос на получение ленты заказов
  }, [dispatch]); // Эффект срабатывает при изменении dispatch

  // Показываем прелоадер если данные загружаются или заказов нет
  if (loading || !orders.length) {
    return <Preloader />;
  }

  // Рендерим UI компонент ленты заказов
  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeeds())} />;
};
