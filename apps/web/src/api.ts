import type { Category, Paginated, Product } from '@arviora/shared';
import { apiFetch } from './lib/http';

const get = <T>(path: string) => apiFetch<T>(path);

export function fetchProducts(params: {
  category?: string;
  search?: string;
}): Promise<Paginated<Product>> {
  const qs = new URLSearchParams();
  if (params.category) qs.set('category', params.category);
  if (params.search) qs.set('search', params.search);
  const query = qs.toString();
  return get<Paginated<Product>>(`/products${query ? `?${query}` : ''}`);
}

export function fetchProduct(slug: string): Promise<Product> {
  return get<Product>(`/products/${slug}`);
}

export function fetchCategories(): Promise<Category[]> {
  return get<Category[]>('/categories');
}
