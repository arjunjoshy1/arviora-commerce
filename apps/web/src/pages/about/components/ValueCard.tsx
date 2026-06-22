interface ValueCardProps {
  index: number;
  title: string;
  body: string;
}

const ValueCard = ({ index, title, body }: ValueCardProps) => (
  <div className="rounded-2xl bg-surface p-6 ring-1 ring-line">
    <span className="font-display text-sm font-semibold text-accent">
      {String(index).padStart(2, '0')}
    </span>
    <h3 className="mt-3 font-display text-lg font-semibold">{title}</h3>
    <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
  </div>
);

export default ValueCard;
