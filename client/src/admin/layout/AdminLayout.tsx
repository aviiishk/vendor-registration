import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAdminAuth } from "../context/AdminAuthContext";
import AdminLoginModal from "../components/AdminLoginModal";

const AdminLayout = () => {
  const { isLoading, isAuthenticated } = useAdminAuth();

  // 🔄 Session check (page refresh / first load)
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-sm font-semibold text-gray-600">
          Checking admin session…
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen bg-gray-50">
      {/* 🔒 Block UI if not authenticated */}
      {!isAuthenticated && <AdminLoginModal />}

      {/* Dashboard UI */}
      <Sidebar disabled={!isAuthenticated} />

      <div className="flex flex-1 flex-col">
        <Topbar disabled={!isAuthenticated} />

        <main
          className={`flex-1 overflow-y-auto p-6 transition ${
            !isAuthenticated ? "pointer-events-none blur-sm" : ""
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
