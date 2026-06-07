/**
 * UserProfile.jsx — My Account page
 *
 * Route: /account  (ProtectedRoute)
 *
 * Changes from original:
 * - Added "My Orders" link → /account/orders
 * - Async logout (awaits API call before redirecting)
 * - Fixed toast firing before logout completes
 * - Full ProtectedRoute guard (not just a bailout redirect)
 */

import { LogOut, Mail, Package, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getStoredUser, logout } from "../api/auth";
import toast from "react-hot-toast";
import { useState } from "react";

const ProfileField = ({ icon: Icon, label, value }) => (
  <div className="border-b py-5 last:border-b-0">
    <div className="flex items-start gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#3e3124]">
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <p className="clo-eyebrow text-[#8f765b]">{label}</p>
        <p className="mt-1 text-base font-medium text-[#3e3124]">
          {value || "Not available"}
        </p>
      </div>
    </div>
  </div>
);

const UserProfile = () => {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout(); // awaits API call + clears localStorage in finally
      toast.success("Logged out successfully.");
      navigate("/account/login", { replace: true });
    } catch {
      // logout() already clears localStorage in finally — still redirect
      toast.success("Logged out.");
      navigate("/account/login", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#f7f2eb] px-4 py-10 text-[#3e3124] sm:px-6 md:py-12 lg:px-10">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-6">
          <p className="clo-eyebrow mb-2 text-[#b19777]">My Account</p>
          <h1 className="clo-page-title m-0 text-[#201811]">Profile</h1>
        </div>

        <div className="rounded-lg bg-[#f3eee7] p-6 shadow-[0_10px_30px_rgba(62,49,36,0.08)] md:p-8">
          <ProfileField icon={User} label="Name"  value={user?.name}  />
          <ProfileField icon={Mail} label="Email" value={user?.email} />

          {/* Quick links */}
          <div className="mt-6 space-y-2">
            <Link
              to="/account/orders"
              className="flex items-center gap-3 rounded-md border border-[#d7c8b8] px-4 py-3 text-sm font-medium text-[#3e3124] transition hover:border-[#3e3124] hover:bg-white"
            >
              <Package size={16} className="text-[#8f765b]" />
              My Orders
              <span className="ml-auto text-[#b5a898]">→</span>
            </Link>

            <Link
              to="/track-order"
              className="flex items-center gap-3 rounded-md border border-[#d7c8b8] px-4 py-3 text-sm font-medium text-[#3e3124] transition hover:border-[#3e3124] hover:bg-white"
            >
              <Package size={16} className="text-[#8f765b]" />
              Track Order
              <span className="ml-auto text-[#b5a898]">→</span>
            </Link>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-black px-5 text-sm font-medium uppercase tracking-[2px] text-white transition hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={16} />
            {loggingOut ? "Logging out…" : "Logout"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
