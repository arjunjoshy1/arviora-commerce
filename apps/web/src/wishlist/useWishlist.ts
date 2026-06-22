import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Product, WishlistItem } from '@arviora/shared';
import {
  addToWishlist,
  fetchWishlist,
  removeFromWishlist,
} from '../api/wishlist';
import { useAuth } from '../auth/useAuth';

const WISHLIST_KEY = ['wishlist'];

/** Ergonomic wrapper around the wishlist API + an auth-gate for guests. */
export const useWishlist = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);

  const query = useQuery({
    queryKey: WISHLIST_KEY,
    queryFn: fetchWishlist,
    enabled: isAuthenticated,
  });

  const items = query.data ?? [];
  const isWishlisted = (productId: string) =>
    items.some((item) => item.product.id === productId);

  const settle = () =>
    queryClient.invalidateQueries({ queryKey: WISHLIST_KEY });

  const addMutation = useMutation({
    mutationFn: (product: Product) => addToWishlist(product.id),
    onMutate: async (product) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_KEY });
      const previous = queryClient.getQueryData<WishlistItem[]>(WISHLIST_KEY);
      const optimisticItem: WishlistItem = {
        id: `optimistic-${product.id}`,
        product,
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueryData<WishlistItem[]>(WISHLIST_KEY, (current) => [
        optimisticItem,
        ...(current ?? []),
      ]);
      return { previous };
    },
    onError: (_err, _product, context) => {
      if (context?.previous) {
        queryClient.setQueryData(WISHLIST_KEY, context.previous);
      }
    },
    onSettled: settle,
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => removeFromWishlist(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_KEY });
      const previous = queryClient.getQueryData<WishlistItem[]>(WISHLIST_KEY);
      queryClient.setQueryData<WishlistItem[]>(WISHLIST_KEY, (current) =>
        (current ?? []).filter((item) => item.product.id !== productId),
      );
      return { previous };
    },
    onError: (_err, _productId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(WISHLIST_KEY, context.previous);
      }
    },
    onSettled: settle,
  });

  /** Toggle a product's wishlist state. Prompts sign-in first if needed. */
  const toggle = (product: Product) => {
    if (!isAuthenticated) {
      setPendingProduct(product);
      return;
    }
    if (isWishlisted(product.id)) {
      removeMutation.mutate(product.id);
    } else {
      addMutation.mutate(product);
    }
  };

  /** Called once the auth prompt modal completes a successful sign-in. */
  const resumePendingToggle = () => {
    if (pendingProduct) addMutation.mutate(pendingProduct);
    setPendingProduct(null);
  };

  return {
    items,
    isLoading: query.isLoading,
    isWishlisted,
    toggle,
    pendingProduct,
    dismissAuthPrompt: () => setPendingProduct(null),
    resumePendingToggle,
  };
};
