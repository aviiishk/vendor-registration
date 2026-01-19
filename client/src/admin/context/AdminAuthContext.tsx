import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminMe, adminLogout } from "../api/adminApi";

type AdminAuthContextType = {
  admin: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();

  const { data: admin, isLoading } = useQuery({
  queryKey: ["admin-me"],
  queryFn: getAdminMe,
  retry: false,
  refetchOnWindowFocus: false,
  staleTime: 0, // 🔥 force fresh auth state
});

  const logout = async () => {
  await adminLogout();

  // 🔥 remove cached auth COMPLETELY
  queryClient.removeQueries({ queryKey: ["admin-me"] });
};



  return (
    <AdminAuthContext.Provider
      value={{
        admin: admin ?? null,
        isLoading,
        isAuthenticated: !!admin,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  }
  return ctx;
}
