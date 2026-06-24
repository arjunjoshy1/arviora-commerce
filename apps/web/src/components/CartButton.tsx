import { useCart } from '../cart/useCart';
import CartIcon from './icons/CartIcon';

/** Cart icon with a live item-count badge; opens the cart drawer. */
const CartButton = () => {
  const { count, openCart } = useCart();

  return (
    <button
      onClick={openCart}
      aria-label={`Cart (${count} items)`}
      className="relative grid h-9 w-9 place-items-center rounded-full bg-surface ring-1 ring-line transition hover:ring-ink/30"
    >
      <CartIcon />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
          {count}
        </span>
      )}
    </button>
  );
};

export default CartButton;
