import { useState } from 'react';
import ChevronDownIcon from '../../../components/icons/ChevronDownIcon';

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem = ({ question, answer }: FaqItemProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-surface ring-1 ring-line">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
      >
        <span className="font-medium">{question}</span>
        <span
          className={`shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <ChevronDownIcon />
        </span>
      </button>
      {open && (
        <p className="px-6 pb-4 text-sm leading-relaxed text-muted">{answer}</p>
      )}
    </div>
  );
};

export default FaqItem;
