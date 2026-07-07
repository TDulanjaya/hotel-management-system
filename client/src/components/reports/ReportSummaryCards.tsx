type SummaryCard = { label: string; value: string; note: string };

export function ReportSummaryCards({ cards }: { cards: SummaryCard[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-2xl bg-white p-6 shadow-sm border border-[#e8e4db]">
          <p className="text-sm text-[#8a8175]">{card.note}</p>
          <p className="mt-1 text-3xl font-extrabold text-[#181818]">{card.value}</p>
          <p className="mt-1 text-sm font-semibold text-[#4d4635]">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
