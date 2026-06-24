import { useState } from 'react';
import ChevronArrowIcon from '../../../components/icons/ChevronArrowIcon';

export default function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="overflow-hidden rounded-3xl bg-surface ring-1 ring-line">
        <div className="aspect-square" />
      </div>
    );
  }

  const goTo = (index: number) =>
    setActive((index + images.length) % images.length);

  return (
    <div>
      <div className="group relative overflow-hidden rounded-3xl bg-surface ring-1 ring-line">
        <div className="aspect-square">
          <img
            src={images[active]}
            alt={alt}
            className="h-full w-full object-cover"
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={() => goTo(active - 1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-ink opacity-0 ring-1 ring-line transition group-hover:opacity-100"
            >
              <ChevronArrowIcon direction="left" />
            </button>
            <button
              onClick={() => goTo(active + 1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-ink opacity-0 ring-1 ring-line transition group-hover:opacity-100"
            >
              <ChevronArrowIcon direction="right" />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? 'w-5 bg-ink' : 'w-1.5 bg-ink/30'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => goTo(i)}
              aria-label={`View image ${i + 1}`}
              className={`h-16 w-16 overflow-hidden rounded-xl ring-1 transition ${
                i === active
                  ? 'ring-2 ring-accent'
                  : 'ring-line hover:ring-ink/40'
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
