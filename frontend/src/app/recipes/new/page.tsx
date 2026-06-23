"use client";

import { useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function NewRecipePage() {
  const router = useRouter();

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
                Add New Recipe
              </h1>

              <p className="mt-2 text-[#4d4635]">
                Create a new recipe with ingredients, preparation steps, cost,
                and serving details.
              </p>
            </div>

            <button
              onClick={() => router.push("/recipes")}
              className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
            >
              Back to Recipes
            </button>
          </div>

          <section className="grid gap-8 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Recipe Details</h2>

              <div className="mt-6 space-y-5">
                <InputField label="Recipe Name" placeholder="Enter recipe name" />

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Category
                  </label>

                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Main Course</option>
                    <option>Starter</option>
                    <option>Dessert</option>
                    <option>Beverage</option>
                    <option>Breakfast</option>
                    <option>Event Menu</option>
                  </select>
                </div>

                <InputField label="Serving Size" placeholder="Example: 4 plates" />

                <InputField
                  label="Preparation Time"
                  placeholder="Example: 35 minutes"
                />

                <InputField label="Estimated Cost" placeholder="Example: Rs 18.50" />

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Recipe Status
                  </label>

                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Seasonal</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Ingredients</h2>

              <textarea
                placeholder={`Example:
Chicken Breast - 500g
Pasta - 400g
Fresh Cream - 250ml
Parmesan Cheese - 100g`}
                rows={14}
                className="mt-6 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm xl:col-span-2">
              <h2 className="text-2xl font-bold">Preparation Method</h2>

              <textarea
                placeholder="Write recipe preparation steps..."
                rows={6}
                className="mt-6 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />

              <div className="mt-6 flex flex-wrap gap-4">
                <button className="rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]">
                  Save Recipe
                </button>

                <button
                  onClick={() => router.push("/recipes")}
                  className="rounded-xl border border-[#735c00] px-6 py-3 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function InputField({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-[#4d4635]">{label}</label>

      <input
        type="text"
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
      />
    </div>
  );
}