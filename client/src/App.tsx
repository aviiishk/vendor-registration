import { Routes, Route, Navigate } from "react-router-dom";
import VendorRegister from "./pages/VendorRegister";
import AdminLayout from "./admin/layout/AdminLayout";
import { AdminAuthProvider } from "./admin/context/AdminAuthContext";
import DashboardPage from "./admin/pages/DashboardPage";
import VendorListPage from "./admin/pages/VendorListPage";
import VendorDetailPage from "./admin/pages/VendorDetailPage";

function App() {
  return (
    <Routes>
      {/* Vendor */}
      <Route path="/vendor/register" element={<VendorRegister />} />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <AdminAuthProvider>
            <AdminLayout />
          </AdminAuthProvider>
        }
      >
        {/* /admin → /admin/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* /admin/dashboard */}
        <Route path="dashboard" element={<DashboardPage />} />

        {/* later */}
        <Route path="vendors" element={<VendorListPage />} />
        <Route path="/admin/vendors/:id" element={<VendorDetailPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/vendor/register" />} />
    </Routes>
  );
}

export default App;
