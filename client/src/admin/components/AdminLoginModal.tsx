import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminLogin } from "../api/adminApi";

const AdminLoginModal = () => {
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: adminLogin,
    onSuccess: () => {
      // 🔁 Refetch admin session
      queryClient.invalidateQueries({ queryKey: ["admin-me"] });
    },
    onError: (err: any) => {
      setError(err.message || "Invalid credentials");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    loginMutation.mutate({ email, password });
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Admin Login
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="admin@example.com"
                autoFocus
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className={`mt-2 w-full rounded-md px-4 py-2 text-sm font-semibold text-white transition
                ${
                  loginMutation.isPending
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700"
                }
              `}
            >
              {loginMutation.isPending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminLoginModal;
