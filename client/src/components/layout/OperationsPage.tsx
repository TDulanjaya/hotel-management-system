type Stat = {
  label: string;
  value: string;
  note: string;
};

type TableRow = {
  title: string;
  subtitle: string;
  status: string;
};

type OperationsPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  buttonText?: string;
  stats?: Stat[];
  rows?: TableRow[];
};

export default function OperationsPage({
  eyebrow,
  title,
  description,
  buttonText,
  stats = [],
  rows = [],
}: OperationsPageProps) {
  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-600">
            {eyebrow}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {title}
          </h1>

          <p className="mt-2 max-w-3xl text-slate-500">
            {description}
          </p>
        </div>

        {buttonText && (
          <button className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-yellow-400 transition hover:-translate-y-0.5 hover:shadow-lg">
            {buttonText}
          </button>
        )}
      </div>

      {stats.length > 0 && (
        <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-sm font-medium text-slate-500">
                {stat.label}
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                {stat.value}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                {stat.note}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="text-lg font-bold text-slate-900">
            Latest Records
          </h2>

          <div className="mt-5 space-y-3">
            {rows.map((row) => (
              <div
                key={row.title}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-4 transition hover:bg-slate-100"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {row.title}
                  </p>

                  <p className="text-sm text-slate-500">
                    {row.subtitle}
                  </p>
                </div>

                <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Quick Actions
          </h2>

          <div className="mt-5 space-y-3">
            <button className="w-full rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50">
              View details
            </button>

            <button className="w-full rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50">
              Export report
            </button>

            <button className="w-full rounded-xl bg-slate-950 px-4 py-3 text-left text-sm font-semibold text-yellow-400">
              Create new record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}