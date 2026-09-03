"use client";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function NewRecipePage() {
  const router = useRouter();

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "COOK"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-4 py-6 pt-16 sm:px-8 sm:py-10 lg:pt-10 lg:ml-[280px]">
          <div className="mb-6 sm:mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                Kitchen Management
              </p>

              <h1 className="mt-1 sm:mt-3 text-2xl sm:text-4xl font-bold text-[#735c00]">
                Add New Recipe
              </h1>

              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#4d4635]">
                Create a new recipe with ingredients, preparation steps, cost,
                and serving details.
              </p>
            </div>

            <button
              onClick={() => router.push("/recipes")}
              className="w-full sm:w-auto rounded-xl border border-[#735c00] px-5 py-3 text-sm sm:text-base font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white text-center"
            >
              Back to Recipes
            </button>
          </div>

          <section className="grid gap-6 sm:gap-8 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-[#d0c5af] bg-white p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold">Recipe Details</h2>

              <div className="mt-5 sm:mt-6 space-y-4 sm:space-y-5">
                <InputField label="Recipe Name" placeholder="Enter recipe name" />

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Category
                  </label>

                  <select className="mt-1 sm:mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#735c00]/30">
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

                  <select className="mt-1 sm:mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Seasonal</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold">Ingredients</h2>

              <textarea
                placeholder={`Example:
Chicken Breast - 500g
Pasta - 400g
Fresh Cream - 250ml
Parmesan Cheese - 100g`}
                rows={12}
                className="mt-4 sm:mt-6 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />
            </div>

            <div className="rounded-2xl border border-[#d0c5af] bg-white p-4 sm:p-6 shadow-sm xl:col-span-2">
              <h2 className="text-xl sm:text-2xl font-bold">Preparation Method</h2>

              <textarea
                placeholder="Write recipe preparation steps..."
                rows={6}
                className="mt-4 sm:mt-6 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#735c00]/30"
              />

              <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button className="w-full sm:w-auto rounded-xl bg-[#735c00] px-8 py-3.5 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00] text-center">
                  Save Recipe
                </button>

                <button
                  onClick={() => router.push("/recipes")}
                  className="w-full sm:w-auto rounded-xl border border-[#735c00] px-8 py-3.5 font-bold text-[#735c00] transition hover:bg-[#735c00] hover:text-white text-center"
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
        placeholder={placeholder}
        className="mt-1 sm:mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#735c00]/30"
      />
    </div>
  );
}
