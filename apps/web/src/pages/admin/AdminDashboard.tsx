import { useQuery } from '@tanstack/react-query';
import { formatPrice } from '@arviora/shared';
import { fetchAdminSummary } from '../../api/admin';

export default function AdminDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-summary'],
    queryFn: fetchAdminSummary,
  });

  if (isLoading) return <p className="text-muted">Loading…</p>;
  if (isError || !data) {
    return <p className="text-red-600">Couldn’t load the dashboard.</p>;
  }

  const cards = [
    { label: 'Products', value: data.totalProducts },
    {
      label: 'Orders',
      value: data.totalOrders,
      sub: formatPrice(data.totalRevenueInPaise),
    },
    { label: 'Open tickets', value: data.openTickets },
    { label: 'Users', value: data.totalUsers },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-2xl bg-surface p-6 ring-1 ring-line"
        >
          <p className="text-sm font-medium text-muted">{c.label}</p>
          <p className="mt-2 font-display text-3xl font-semibold tracking-tight">
            {c.value}
          </p>
          {c.sub && (
            <p className="mt-1 text-sm text-muted">{c.sub} total revenue</p>
          )}
        </div>
      ))}
    </div>
  );
}
