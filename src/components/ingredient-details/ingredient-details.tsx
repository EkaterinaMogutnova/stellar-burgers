import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { getIngredientState } from '../../services/slices/ingredientSlice/ingredientSlice';

// Компонент для отображения детальной информации об ингредиенте
export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { ingredients, loading } = useSelector(getIngredientState);

  // Если данные еще загружаются
  if (loading) {
    return <Preloader />;
  }

  // Находим ингредиент по ID из URL
  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
