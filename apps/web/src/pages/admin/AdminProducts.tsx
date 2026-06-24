import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Product } from '@arviora/shared';
import { formatPrice } from '@arviora/shared';
import { fetchCategories } from '../../api';
import {
  createCategory,
  createProduct,
  fetchAdminProducts,
  updateProduct,
} from '../../api/admin';
import { useToast } from '../../components/Toast';
import ProductForm, { type ProductFormValues } from './components/ProductForm';

const PRODUCTS_KEY = ['admin-products'];

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [editing, setEditing] = useState<Product | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: fetchAdminProducts,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const handleSave = async (values: ProductFormValues) => {
    try {
      if (editing) {
        await updateProduct(editing.id, values);
        toast('Product updated', 'success');
      } else {
        await createProduct(values);
        toast('Product created', 'success');
      }
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditing(null);
      setShowNewForm(false);
    } catch {
      toast('Couldn’t save the product', 'error');
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await updateProduct(product.id, { isActive: !product.isActive });
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast(
        product.isActive ? 'Product deactivated' : 'Product activated',
        'success',
      );
    } catch {
      toast('Couldn’t update the product', 'error');
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await createCategory({ name: newCategoryName.trim() });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setNewCategoryName('');
      toast('Category created', 'success');
    } catch {
      toast('Couldn’t create the category', 'error');
    }
  };

  if (isLoading) return <p className="text-muted">Loading…</p>;
  if (isError || !products) {
    return <p className="text-red-600">Couldn’t load products.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category name"
            className="rounded-xl border border-line bg-canvas px-3.5 py-2 text-sm outline-none transition focus:border-ink focus:bg-surface"
          />
          <button
            onClick={handleCreateCategory}
            className="rounded-xl bg-surface px-4 py-2 text-sm font-medium ring-1 ring-line transition hover:ring-ink/40"
          >
            Add category
          </button>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          New product
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-canvas text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Active</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted">
                  No products yet.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-3 font-medium">{p.name}</td>
                <td className="px-5 py-3 text-muted">{p.category.name}</td>
                <td className="px-5 py-3">
                  {formatPrice(p.priceInPaise, p.currency)}
                </td>
                <td className="px-5 py-3 text-muted">{p.stock}</td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => handleToggleActive(p)}
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide transition ${
                      p.isActive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {p.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => setEditing(p)}
                    className="text-sm text-muted underline-offset-2 hover:text-ink hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(editing || showNewForm) && (
        <ProductForm
          product={editing ?? undefined}
          categories={categories ?? []}
          onSave={handleSave}
          onClose={() => {
            setEditing(null);
            setShowNewForm(false);
          }}
        />
      )}
    </div>
  );
}
