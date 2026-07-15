function money(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

export default function RevenueOverviewCard({ summary = null, invoices = [] }) {
  const bars = invoices.slice(0, 8).map((invoice) => {
    const total = Number(invoice.totalAmount || 1);
    return Math.max(12, Math.round((Number(invoice.paidAmount || 0) / total) * 100));
  });
  const revenueBars = bars.length ? bars : [18, 18, 18, 18, 18, 18, 18, 18];
  const collected = summary?.collectedAmount || 0;
  const pending = summary?.pendingAmount || 0;
  const pendingInvoices = summary?.pendingInvoices || 0;

  return (
    <section className="rounded-[8px] border border-line bg-ink p-5 text-white shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black">Revenue Overview</h2>
          <p className="text-sm text-white/60">Collections, invoices, and forecast</p>
        </div>
        <span className="rounded-full bg-coral px-3 py-1 text-xs font-black">Live</span>
      </div>
      <div className="mt-6">
        <p className="text-4xl font-extrabold">{money(collected)}</p>
        <p className="mt-1 text-sm text-white/60">{money(pending)} pending across {pendingInvoices} invoices</p>
      </div>
      <div className="mt-7 flex h-36 items-end gap-2 rounded-[8px] bg-white/10 p-4">
        {revenueBars.map((height, index) => (
          <span key={index} className="flex-1 rounded-t-[6px] bg-mint" style={{ height: `${height}%`, opacity: 0.55 + index * 0.05 }} />
        ))}
      </div>
    </section>
  );
}
