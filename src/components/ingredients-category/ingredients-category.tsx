import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import { getConstructorState } from '../../services/slices/constructorSlice/constructorSlice';

// Компонент категории ингредиентов (Булки, Соусы, Начинки)
export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  // Берем данные конструктора из store
  const { constructorItems } = useSelector(getConstructorState);

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients: constructorIngredients } = constructorItems;
    const counters: { [key: string]: number } = {};

    // Считаем начинки
    constructorIngredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });

    // Считаем булку (всегда 2)
    if (bun) counters[bun._id] = 2;

    return counters;
  }, [constructorItems]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
