import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../cart/useCart';
import { useToast } from '../../components/Toast';
import { placeOrder } from '../../api/orders';
import TopBar from '../../components/TopBar';
import CartButton from '../../components/CartButton';
import ShippingForm, { type ShippingFields } from './components/ShippingForm';
import OrderSummary from './components/OrderSummary';

const EMPTY_ADDRESS: ShippingFields = {
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
};

const Checkout = () => {
  const { items, subtotalInPaise, clear } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const [address, setAddress] = useState<ShippingFields>(EMPTY_ADDRESS);
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);

  const setField = (field: keyof ShippingFields, value: string) =>
    setAddress((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || items.length === 0) return;
    setSubmitting(true);
    try {
      const order = await placeOrder({
        items: items.map((i) => ({
          productId: i.productId,
          size: i.size,
          quantity: i.quantity,
        })),
        shipping: {
          ...address,
          line2: address.line2 || undefined,
        },
      });
      setPlaced(true);
      clear();
      toast('Order placed successfully!', 'success');
      navigate(`/orders/${order.id}`, { state: { justPlaced: true } });
    } catch (err) {
      toast(
        err instanceof Error ? err.message : 'Could not place the order',
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Empty cart (and not mid-redirect after placing) → nudge back to shopping.
  if (items.length === 0 && !placed) {
    return (
      <div className="min-h-screen">
        <TopBar>
          <CartButton />
        </TopBar>
        <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
          <h1 className="font-display text-2xl font-semibold">
            Your cart is empty
          </h1>
          <p className="mt-2 text-sm text-muted">
            Add a few things before heading to checkout.
          </p>
          <Link
            to="/"
            className="mt-6 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopBar>
        <CartButton />
      </TopBar>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Checkout
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem]"
        >
          <section>
            <h2 className="mb-4 font-display text-lg font-semibold">
              Shipping address
            </h2>
            <ShippingForm values={address} onChange={setField} />
          </section>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <OrderSummary
              items={items}
              subtotalInPaise={subtotalInPaise}
              submitting={submitting}
            />
          </aside>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
