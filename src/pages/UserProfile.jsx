import { LogOut, Mail, User } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { getStoredUser, logout } from "../api/auth";
import toast from "react-hot-toast";

const ProfileField = ({ icon: Icon, label, value }) => (
  <div className="border-b   py-5 last:border-b-0">
    <div className="flex items-start gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#3e3124]">
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <p className="clo-eyebrow">{label}</p>
        <p className="mt-1  text-base font-medium ">
          {value || "Not available"}
        </p>
      </div>
    </div>
  </div>
);

const UserProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  if (!token) {
    return <Navigate to="/account/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/account/login", { replace: true });
    toast.success("Logout Successfully");
  };

  return (
    <section className="min-h-screen bg-[#f7f2eb] px-4 py-10 text-[#3e3124] sm:px-6 md:py-12 lg:px-10">
      <div className="mx-auto max-w-xl rounded-lg bg-[#f3eee7] p-6 shadow-[0_10px_30px_rgba(62,49,36,0.08)] md:p-8">
        <div className="mb-6 border-b border-[#d7c8b8] pb-5">
          <p className="clo-eyebrow mb-3 text-[#b19777]">
            My Account
          </p>
          <h1 className="clo-page-title m-0 text-[#201811]">
            User Profile
          </h1>
        </div>

        <ProfileField icon={User} label="Name" value={user?.name} />
        <ProfileField icon={Mail} label="Email" value={user?.email} />

        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-black px-5 text-sm font-medium uppercase tracking-[2px] text-white transition hover:bg-[#222]">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </section>
  );
};

export default UserProfile;
