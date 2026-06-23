import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const recipes = [
  {
    id: "REC-1001",
    name: "Chicken Alfredo Pasta",
    category: "Main Course",
    serving: "4 Plates",
    time: "35 mins",
    cost: "Rs 18.50",
    status: "Active",
  },
  {
    id: "REC-1002",
    name: "Wagyu Beef Burger",
    category: "Main Course",
    serving: "2 Plates",
    time: "25 mins",
    cost: "Rs 24.00",
    status: "Active",
  },
  {
    id: "REC-1003",
    name: "Chocolate Lava Cake",
    category: "Dessert",
    serving: "6 Plates",
    time: "45 mins",
    cost: "Rs 12.75",
    status: "Active",
  },
  {
    id: "REC-1004",
    name: "Fresh Garden Salad",
    category: "Starter",
    serving: "3 Plates",
    time: "15 mins",
    cost: "Rs 8.20",
    status: "Seasonal",
  },
];

const stats = [
  {
    label: "Total Recipes",
    value: "32",
  },
  {
    label: "Active",
    value: "26",
  },
  {
    label: "Seasonal",
    value: "04",
  },
  {
    label: "Inactive",
    value: "02",
  },
];

function getStatusClass(status: string) {
  if (status === "Active") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Seasonal") {
    return "bg-orange-100 text-orange-700";
  }

  return "bg-red-100 text-red-700";
}

export default function RecipesPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "kitchen"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Kitchen Management
              </p>

              <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                Recipes
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Manage hotel kitchen recipes, ingredients, preparation time,
                serving size, and estimated cost.
              </p>
            </div>

            <a
              href="/recipes/new"
              className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
            >
              Add New Recipe
            </a>
          </div>

          <section className="mb-8 grid gap-6 md:grid-cols-4">
            {stats.map((item) => (
              <StatCard key={item.label} label={item.label} value={item.value} />
            ))}
          </section>

          <section className="mb-8 rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-4">
              <input
                type="text"
                placeholder="Search recipe..."
                className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Categories</option>
                <option>Main Course</option>
                <option>Starter</option>
                <option>Dessert</option>
                <option>Beverage</option>
              </select>

              <select className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                <option>All Status</option>
                <option>Active</option>
                <option>Seasonal</option>
                <option>Inactive</option>
              </select>

              <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                Filter
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm">
            <div className="border-b border-[#d0c5af] p-6">
              <h2 className="text-2xl font-bold">Recipe List</h2>
              <p className="mt-1 text-sm text-[#4d4635]">
                Kitchen recipe records and food preparation details.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead>
                  <tr className="border-b border-[#d0c5af] bg-[#f5f3ef] text-xs uppercase tracking-widest text-[#4d4635]">
                    <th className="px-6 py-4">Recipe ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Serving</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Cost</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#d0c5af]">
                  {recipes.map((recipe) => (
                    <tr key={recipe.id} className="transition hover:bg-[#fbf9f5]">
                      <td className="px-6 py-5 font-bold">{recipe.id}</td>

                      <td className="px-6 py-5 font-semibold">
                        {recipe.name}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#735c00]">
                          {recipe.category}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-[#4d4635]">
                        {recipe.serving}
                      </td>

                      <td className="px-6 py-5">{recipe.time}</td>

                      <td className="px-6 py-5 font-bold text-[#735c00]">
                        {recipe.cost}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            recipe.status
                          )}`}
                        >
                          {recipe.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <a
                          href={`/recipes/edit/${recipe.id}`}
                          className="rounded-lg border border-[#735c00] px-4 py-2 text-sm font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
                        >
                          Edit
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-widest text-[#4d4635]">
        {label}
      </p>

      <p className="mt-2 text-3xl font-extrabold text-[#735c00]">{value}</p>
    </div>
  );
}