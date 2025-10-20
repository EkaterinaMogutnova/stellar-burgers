import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient
} from '../../services/slices/constructorSlice/constructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    // Функция для перемещения ингредиента вниз
    const handleMoveDown = () => {
      // Проверяем, что это не последний элемент в списке
      if (index < totalItems - 1) {
        dispatch(moveIngredientDown(index));
      }
    };

    // Функция для перемещения ингредиента вверх
    const handleMoveUp = () => {
      // Проверяем, что это не первый элемент в списке
      if (index > 0) {
        dispatch(moveIngredientUp(index));
      }
    };

    // Функция для удаления ингредиента из конструктора
    const handleClose = () => {
      dispatch(removeIngredient(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
