import { combineReducers, configureStore } from '@reduxjs/toolkit';
import constructorSlice from './slices/constructorSlice/constructorSlice';
import ingredientSlice from './slices/ingredientSlice/ingredientSlice';
import orderReducer from './slices/orderSlice/orderSlice';
import feedReducer from './slices/feedSlice/feedSlice';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import userSlice from './slices/userSlice/userSlice';

export const rootReducer = combineReducers({
  ingredient: ingredientSlice,
  constructorBurger: constructorSlice,
  user: userSlice,
  order: orderReducer,
  feed: feedReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
