import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../store/slices/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const { items, totalItems, subtotal, discount, total, isLoading } = useSelector(
    (state) => state.cart
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  return {
    items,
    totalItems,
    subtotal,
    discount,
    total,
    isLoading,
  };
};
