import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer'; // Хук для отслеживания видимости элементов в viewport
import { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';
import { getIngredientState } from '../../services/slices/ingredientSlice/ingredientSlice';

export const BurgerIngredients: FC = () => {
  // Получаем все ингредиенты
  const { ingredients } = useSelector(getIngredientState);

  // Фильтруем ингредиенты по типам
  const buns = ingredients.filter((i) => i.type === 'bun'); // Булки
  const mains = ingredients.filter((i) => i.type === 'main'); // Начинки
  const sauces = ingredients.filter((i) => i.type === 'sauce'); // Соусы

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  // Refs для для прокрутки
  const titleBunRef = useRef<HTMLHeadingElement>(null); //"Булки"
  const titleMainRef = useRef<HTMLHeadingElement>(null); //"Начинки"
  const titleSaucesRef = useRef<HTMLHeadingElement>(null); //"Соусы"

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun'); // Если видим булки - активируем таб "Булки"
    } else if (inViewSauces) {
      setCurrentTab('sauce'); // Если видим соусы - активируем таб "Соусы"
    } else if (inViewFilling) {
      setCurrentTab('main'); // Если видим начинки - активируем таб "Начинки"
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  // Обработчик клика по табу
  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);

    // Прокручиваем к соответствующей секции при клике на таб
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Рендерим UI компонент
  return (
    <BurgerIngredientsUI
      currentTab={currentTab} // Текущий активный таб
      buns={buns} // Отфильтрованный список булок
      mains={mains} // Отфильтрованный список начинок
      sauces={sauces} // Отфильтрованный список соусов
      titleBunRef={titleBunRef} // Ref для булок
      titleMainRef={titleMainRef} // Ref для начинок
      titleSaucesRef={titleSaucesRef} // Ref для соусов
      bunsRef={bunsRef} // Ref для отслеживания видимости секции булок
      mainsRef={mainsRef} // Ref для отслеживания видимости секции начинок
      saucesRef={saucesRef} // Ref для отслеживания видимости секции соусов
      onTabClick={onTabClick} // Обработчик клика по табам
    />
  );
};
