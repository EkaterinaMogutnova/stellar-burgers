import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  getConstructorState,
  orderBurger,
  setRequest,
  resetModal
} from '../../services/slices/constructorSlice/constructorSlice';
import { getUserState } from '../../services/slices/userSlice/userSlice';

// Компонент конструктора бургера - отвечает за логику сборки бургера и оформления заказа
export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const { constructorItems, orderModalData, orderRequest } =
    useSelector(getConstructorState);
  const isAuth = useSelector(getUserState).isAuthenticated; // Проверка авторизации пользователя

  const dispatch = useDispatch();
  // Формируем массив ID ингредиентов для отправки на сервер
  let arr: string[] = [];
  const ingredients: string[] | void = constructorItems.ingredients.map(
    (i) => i._id
  );
  // Добавляем булку в начало и конец массива
  if (constructorItems.bun) {
    const bun = constructorItems.bun?._id;
    arr = [bun, ...ingredients, bun];
  }
  // Обработчик клика по кнопке "Оформить заказ"
  const onOrderClick = () => {
    if (isAuth && constructorItems.bun) {
      dispatch(setRequest(true)); // Показываем лоадер
      dispatch(orderBurger(arr)); // Отправляем заказ на сервер
    } else if (isAuth && !constructorItems.bun) {
      return;
      // Если не авторизован - переходим на страницу логина
    } else if (!isAuth) {
      navigate('/login');
    }
  };

  const closeOrderModal = () => {
    dispatch(setRequest(false));
    dispatch(resetModal());
  };
  // Расчет общей стоимости бургера
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );
  // Рендерим UI
  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
