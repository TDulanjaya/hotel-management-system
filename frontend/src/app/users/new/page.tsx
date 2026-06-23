import AppSidebar from "@/components/layout/AppSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function NewUserPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
              User Management
            </p>

            <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
              New User
            </h1>

            <p className="mt-2 text-[#4d4635]">
              Create a new system user account here.
            </p>
          </div>

          <form className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
            <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Account Details</h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="user@luxestay.com"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Create password"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Role
                  </label>
                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option value="owner">Owner</option>
                    <option value="manager">Manager</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="inventory">Inventory</option>
                    <option value="waiter">Waiter</option>
                    <option value="events">Events Staff</option>
                    <option value="parking">Parking</option>
                    <option value="game_staff">Game Staff</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Department
                  </label>
                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Administration</option>
                    <option>Operations</option>
                    <option>Front Office</option>
                    <option>Kitchen</option>
                    <option>Inventory</option>
                    <option>Restaurant</option>
                    <option>Events</option>
                    <option>Parking</option>
                    <option>Games & Amenities</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+94 77 123 4567"
                    className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#4d4635]">
                    Account Status
                  </label>
                  <select className="mt-2 w-full rounded-xl border border-[#d0c5af] bg-[#f5f3ef] px-4 py-3 outline-none focus:ring-2 focus:ring-[#735c00]/30">
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
            </section>

            <aside className="space-y-8">
              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Access Summary</h2>

                <div className="mt-6 space-y-4">
                  <AccessItem
                    title="Owner"
                    text="Full system access, reports, users, and audit logs."
                  />

                  <AccessItem
                    title="Manager"
                    text="Operational access, reports, users, and daily controls."
                  />

                  <AccessItem
                    title="Staff Roles"
                    text="Limited access based on assigned module."
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">Security Rules</h2>

                <div className="mt-6 space-y-4">
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
                    <input type="checkbox" defaultChecked className="mt-1 h-5 w-5" />
                    <div>
                      <p className="font-bold">Require secure password</p>
                      <p className="text-sm text-[#4d4635]">
                        Password must be strong before account activation.
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
                    <input type="checkbox" defaultChecked className="mt-1 h-5 w-5" />
                    <div>
                      <p className="font-bold">Enable audit tracking</p>
                      <p className="text-sm text-[#4d4635]">
                        User actions will be logged for security review.
                      </p>
                    </div>
                  </label>
                </div>
              </section>

              <div className="flex gap-4">
                <a
                  href="/users/list"
                  className="flex-1 rounded-xl border border-[#735c00] px-6 py-4 text-center font-bold text-[#735c00] transition hover:bg-[#735c00]/5"
                >
                  Cancel
                </a>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#735c00] px-6 py-4 font-bold text-white transition hover:bg-[#d4af37] hover:text-[#241a00]"
                >
                  Create User
                </button>
              </div>
            </aside>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function AccessItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-[#d0c5af] bg-[#f5f3ef] p-4">
      <h3 className="font-bold text-[#735c00]">{title}</h3>
      <p className="mt-1 text-sm text-[#4d4635]">{text}</p>
    </div>
  );
}