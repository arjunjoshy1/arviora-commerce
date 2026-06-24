import { useState } from 'react';
import type { Category, Product } from '@arviora/shared';
import CloseIcon from '../../../components/icons/CloseIcon';
import Spinner from '../../../components/Spinner';

export interface ProductFormValues {
  name: string;
  description: string;
  priceInPaise: number;
  imageUrl?: string;
  images: string[];
  color?: string;
  stock: number;
  categorySlug: string;
}

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  onSave: (values: ProductFormValues) => Promise<void>;
  onClose: () => void;
}

const ProductForm = ({
  product,
  categories,
  onSave,
  onClose,
}: ProductFormProps) => {
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(
    product ? (product.priceInPaise / 100).toFixed(2) : '',
  );
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? '');
  const [imagesText, setImagesText] = useState(
    (product?.images ?? []).join('\n'),
  );
  const [color, setColor] = useState(product?.color ?? '#1C1C1A');
  const [stock, setStock] = useState(String(product?.stock ?? 0));
  const [categorySlug, setCategorySlug] = useState(
    product?.category.slug ?? categories[0]?.slug ?? '',
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await onSave({
        name,
        description,
        priceInPaise: Math.round(parseFloat(price) * 100),
        imageUrl: imageUrl || undefined,
        images: imagesText
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        color: color || undefined,
        stock: parseInt(stock, 10) || 0,
        categorySlug,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/30 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-y-auto rounded-2xl bg-canvas p-7 shadow-xl ring-1 ring-line">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">
            {product ? 'Edit product' : 'New product'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 grid h-8 w-8 place-items-center rounded-full text-muted transition hover:bg-surface hover:text-ink"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Price (₹)
              </label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Stock</label>
              <input
                required
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Category</label>
            <select
              required
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Cover image URL
            </label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://…"
              className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Gallery images (one URL per line)
            </label>
            <textarea
              rows={3}
              value={imagesText}
              onChange={(e) => setImagesText(e.target.value)}
              placeholder="https://…"
              className="w-full resize-none rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Colour swatch
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-16 rounded-lg border border-line bg-canvas"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !categorySlug}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {submitting && <Spinner />}
            {submitting
              ? 'Saving…'
              : product
                ? 'Save changes'
                : 'Create product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
