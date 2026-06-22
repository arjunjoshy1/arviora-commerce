import { Link } from 'react-router-dom';
import Logo from '../../components/Logo';
import TopBar from '../../components/TopBar';
import CartButton from '../../components/CartButton';
import ValueCard from './components/ValueCard';

// Placeholder copy — personalise this with your own story.
const VALUES = [
  {
    title: 'Thoughtfully sourced',
    body: 'We pick a few good things over many forgettable ones — chosen the way we’d choose them for our own home.',
  },
  {
    title: 'Crafted for comfort',
    body: 'A storefront that feels calm and simple, so buying something lovely never feels like a chore.',
  },
  {
    title: 'Our own signature',
    body: 'A point of view you won’t find anywhere else — a taste you’ll start to recognise the moment you arrive.',
  },
  {
    title: 'Rooted in India',
    body: 'Made for the way we live here, with the makers and materials we’re proud to put our name beside.',
  },
];

const About = () => (
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

    <main>
      {/* Intro */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-12 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted ring-1 ring-line">
              Our story
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              Handpicked by two,
              <br />
              made for you.
            </h1>
            <p className="mt-4 max-w-md text-muted">
              Arviora began with a shared frustration and a shared obsession —
              and a belief that the good things should be easier to find.
            </p>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-surface ring-1 ring-line">
            {/* Replace src with a real photo of the two of you (drop it in
                apps/web/public and use e.g. "/about-us.jpg"). */}
            <img
              src="https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=900&q=80"
              alt="The people behind Arviora"
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-4 left-4 rounded-full bg-canvas/85 px-3 py-1 text-xs font-medium backdrop-blur">
              The two of us
            </span>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="border-y border-line bg-surface/50">
        <div className="mx-auto max-w-2xl px-6 py-16 text-center">
          <p className="font-display text-xl leading-relaxed sm:text-2xl">
            We’re a couple who couldn’t find a single place that brought
            together the things we loved — beautifully made, thoughtfully
            sourced, and genuinely easy to buy. So we set out to build it
            ourselves.
          </p>
          <p className="mt-6 leading-relaxed text-muted">
            Arviora is our attempt to bring calm to the scattered world of good
            products in India — one considered storefront, curated with the same
            care we’d give our own home. Every piece earns its place: for how it
            feels, how it lasts, and the small joy it adds to an ordinary day.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          What we stand for
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, i) => (
            <ValueCard
              key={value.title}
              index={i + 1}
              title={value.title}
              body={value.body}
            />
          ))}
        </div>
      </section>

      {/* Signature statement */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            We’re not trying to sell everything.
          </h2>
          <p className="mt-4 text-muted">
            We’re building a taste — a feeling you’ll start to recognise the
            moment you land here. That’s our signature, and we’re only getting
            started.
          </p>
          <Link
            to="/"
            className="mt-8 inline-block rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Explore the collection
          </Link>
        </div>
      </section>
    </main>

    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-10 text-center text-sm text-muted sm:flex-row sm:justify-between sm:text-left">
        <Logo />
        <p>© {new Date().getFullYear()} Arviora. Thoughtfully sourced.</p>
      </div>
    </footer>
  </div>
);

export default About;
