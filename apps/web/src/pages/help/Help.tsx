import { Link } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import CartButton from '../../components/CartButton';
import Logo from '../../components/Logo';
import FaqItem from './components/FaqItem';

interface FaqGroup {
  title: string;
  items: { question: string; answer: string }[];
}

const FAQS: FaqGroup[] = [
  {
    title: 'Orders & shipping',
    items: [
      {
        question: 'How do I track my order?',
        answer:
          'Go to Account → Orders to see every order you’ve placed and its current status. We’ll also email you updates as your order moves.',
      },
      {
        question: 'How long does delivery take?',
        answer:
          'Most orders arrive within 3–7 business days depending on your location. You’ll see an estimated delivery window at checkout.',
      },
      {
        question: 'Can I change my shipping address after ordering?',
        answer:
          'If your order hasn’t shipped yet, contact us right away and we’ll try to update it. Once shipped, the address can’t be changed.',
      },
    ],
  },
  {
    title: 'Returns & refunds',
    items: [
      {
        question: 'What’s your return policy?',
        answer:
          'Items can be returned within 7 days of delivery if unused and in original packaging. Reach out from your Orders page to start a return.',
      },
      {
        question: 'When will I get my refund?',
        answer:
          'Refunds are processed within 5–7 business days after we receive the returned item, back to your original payment method.',
      },
    ],
  },
  {
    title: 'Account & payments',
    items: [
      {
        question: 'Do I need an account to order?',
        answer:
          'Yes — creating an account lets us keep your orders, saved addresses, and wishlist all in one place for next time.',
      },
      {
        question: 'Is my payment information stored?',
        answer:
          'We don’t store your card details ourselves. Payments are handled securely once our payment partner is connected.',
      },
      {
        question: 'How do I reset my password?',
        answer:
          'Use the “Forgot password” link on the sign-in page, or change it any time from Account → Security.',
      },
    ],
  },
];

const Help = () => (
  <div className="min-h-screen">
    <TopBar>
      <Link
        to="/"
        className="text-sm text-muted underline-offset-2 hover:text-ink hover:underline"
      >
        ← Back to shop
      </Link>
      <CartButton />
    </TopBar>

    <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <span className="inline-block rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted ring-1 ring-line">
        Help centre
      </span>
      <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        How can we help?
      </h1>
      <p className="mt-4 max-w-md text-muted">
        Answers to the things shoppers ask us most. Can’t find what you need?{' '}
        <Link
          to="/contact"
          className="underline underline-offset-2 hover:text-ink"
        >
          Get in touch
        </Link>
        .
      </p>

      <div className="mt-10 space-y-10">
        {FAQS.map((group) => (
          <section key={group.title}>
            <h2 className="font-display text-lg font-semibold">
              {group.title}
            </h2>
            <div className="mt-4 space-y-3">
              {group.items.map((item) => (
                <FaqItem
                  key={item.question}
                  question={item.question}
                  answer={item.answer}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>

    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-10 text-center text-sm text-muted sm:flex-row sm:justify-between sm:text-left">
        <Logo />
        <p>© {new Date().getFullYear()} Arviora. Thoughtfully sourced.</p>
      </div>
    </footer>
  </div>
);

export default Help;
