import { useAdminAuth } from "../context/AdminAuthContext";

type TopbarProps = {
  disabled?: boolean;
};

const Topbar = ({ disabled = false }: TopbarProps) => {
  const { logout, admin } = useAdminAuth();

  const handleLogout = async () => {
    await logout(); 
  };

  return (
    <header
      className={`flex items-center justify-between border-b border-gray-200 px-6 py-3 transition
        ${disabled ? "bg-gray-50 opacity-60" : "bg-white"}
      `}
    >
      <span className="text-xl font-black text-blue-900">
        Vendor Registration Management Dashboard
      </span>

      {!disabled && admin && (
        <button
          onClick={handleLogout}
          className="text-sm font-semibold text-red-600 hover:underline"
        >
          Logout
        </button>
      )}
    </header>
  );
};

export default Topbar;
