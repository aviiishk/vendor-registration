import { NavLink } from "react-router-dom";

type SidebarProps = {
  disabled?: boolean;
};

const baseLink = "block rounded-md px-4 py-2 text-sm font-semibold transition";

const Sidebar = ({ disabled = false }: SidebarProps) => {
  return (
    <aside
      className={`w-64 border-r border-gray-200 px-4 py-6 transition
        ${disabled ? "bg-gray-50 opacity-50" : "bg-white"}
      `}
    >
      <h1 className="mb-8 text-xl font-black text-blue-900">AGIHF Admin</h1>

      <nav className={`space-y-1 ${disabled ? "pointer-events-none" : ""}`}>
        {/* Dashboard */}
        <NavLink
          to="/admin/dashboard"
          end
          className={({ isActive }) =>
            `${baseLink} ${
              isActive
                ? "bg-blue-100 text-blue-900"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/vendors"
          className={({ isActive }) =>
            `${baseLink} ${
              isActive
                ? "bg-blue-100 text-blue-900"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          Vendors
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
