interface HeroProps {
  /** Up to three product images for the collage. */
  images: (string | null)[];
  onShop: () => void;
}

const Hero = ({ images, onShop }: HeroProps) => (
  <section className="mx-auto max-w-6xl px-6 pb-16 pt-12 sm:pt-16">
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <div>
        <span className="inline-block rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted ring-1 ring-line">
          Curated for India
        </span>
        <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          Thoughtfully sourced.
          <br />
          Beautifully delivered.
        </h1>
        <p className="mt-4 max-w-md text-muted">
          A growing collection of beautiful products across every category —
          clothing, jewellery, decor, and the little things that make a house a
          home.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button
            onClick={onShop}
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Shop the collection
          </button>
          <button
            onClick={onShop}
            className="rounded-full bg-surface px-6 py-3 text-sm font-medium ring-1 ring-line transition hover:ring-ink/30"
          >
            Browse categories
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-surface ring-1 ring-line">
          {images[0] && (
            <img
              src={images[0]}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="mt-8 grid gap-4">
          <div className="aspect-square overflow-hidden rounded-3xl bg-surface ring-1 ring-line">
            {images[1] && (
              <img
                src={images[1]}
                alt=""
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="aspect-square overflow-hidden rounded-3xl bg-surface ring-1 ring-line">
            {images[2] && (
              <img
                src={images[2]}
                alt=""
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
