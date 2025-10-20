import { FC } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import { getFeedState } from '../../services/slices/feedSlice/feedSlice';

// Возвращает массив номеров заказов с указанным статусом
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

// Компонент для отображения статистики и списков заказов в ленте заказов
export const FeedInfo: FC = () => {
  const { orders, total, totalToday } = useSelector(getFeedState);

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }}
    />
  );
};
