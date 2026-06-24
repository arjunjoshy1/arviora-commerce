import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCart } from '../../cart/useCart';
import { useToast } from '../../components/Toast';
import { placeOrder } from '../../api/orders';
import * as addressApi from '../../api/addresses';
import TopBar from '../../components/TopBar';
import CartButton from '../../components/CartButton';
import ShippingForm, { type ShippingFields } from './components/ShippingForm';
import AddressSelector from './components/AddressSelector';
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

const ADDRESSES_KEY = ['addresses'];

const Checkout = () => {
  const { items, subtotalInPaise, clear } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: addresses } = useQuery({
    queryKey: ADDRESSES_KEY,
    queryFn: addressApi.fetchAddresses,
  });

  // null = not decided yet (waiting on the addresses query to settle).
  const [selectedId, setSelectedId] = useState<string | 'new' | null>(null);
  const [address, setAddress] = useState<ShippingFields>(EMPTY_ADDRESS);
  const [saveAddress, setSaveAddress] = useState(false);
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);

  // Preselect the default saved address once the list loads; fall back to
  // the "new address" form when there are none saved yet.
  useEffect(() => {
    if (selectedId !== null || !addresses) return;
    const defaultAddress = addresses.find((a) => a.isDefault);
    setSelectedId(defaultAddress?.id ?? addresses[0]?.id ?? 'new');
  }, [addresses, selectedId]);

  const setField = (field: keyof ShippingFields, value: string) =>
    setAddress((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || items.length === 0) return;
    setSubmitting(true);
    try {
      const selectedSaved =
        selectedId && selectedId !== 'new'
          ? addresses?.find((a) => a.id === selectedId)
          : undefined;

      let shipping: ShippingFields;
      if (selectedSaved) {
        shipping = {
          name: selectedSaved.name,
          phone: selectedSaved.phone,
          line1: selectedSaved.line1,
          line2: selectedSaved.line2 ?? '',
          city: selectedSaved.city,
          state: selectedSaved.state,
          postalCode: selectedSaved.postalCode,
        };
      } else {
        shipping = address;
        if (saveAddress) {
          await addressApi.createAddress({
            label: 'Home',
            name: address.name,
            phone: address.phone,
            line1: address.line1,
            line2: address.line2 || null,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            isDefault: setAsDefault,
          });
          await queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY });
        }
      }

      const order = await placeOrder({
        items: items.map((i) => ({
          productId: i.productId,
          size: i.size,
          quantity: i.quantity,
        })),
        shipping: {
          ...shipping,
          line2: shipping.line2 || undefined,
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

            {addresses && addresses.length > 0 && (
              <AddressSelector
                addresses={addresses}
                selectedId={selectedId ?? 'new'}
                onSelect={setSelectedId}
              />
            )}

            {selectedId === 'new' && (
              <div className={addresses && addresses.length > 0 ? 'mt-4' : ''}>
                <ShippingForm values={address} onChange={setField} />

                <label className="mt-4 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="h-4 w-4 rounded border-line"
                  />
                  Save this address for next time
                </label>

                {saveAddress && (
                  <label className="mt-2 flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={setAsDefault}
                      onChange={(e) => setSetAsDefault(e.target.checked)}
                      className="h-4 w-4 rounded border-line"
                    />
                    Set as default address
                  </label>
                )}
              </div>
            )}
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
