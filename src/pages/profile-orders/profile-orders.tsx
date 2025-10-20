import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrders,
  getOrderState
} from '../../services/slices/orderSlice/orderSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector(getOrderState);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
