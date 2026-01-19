// admin/pages/DashboardPage.tsx
import StatCard from "../components/StatCard";

const DashboardPage = () => {
  return (
    <div className="space-y-8">
      {/* Top stats */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Vendors" value={50} />
        <StatCard label="Approved Vendors" value={32} />
        <StatCard label="Pending Vendors" value={14} />
        <StatCard label="Rejected Vendors" value={4} />
      </div>

      {/* Recent vendors */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-800">
          Recent Vendor Requests
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="px-4 py-3 font-semibold">Entity</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Submitted</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3].map((_, i) => (
                <tr
                  key={i}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">ABC Enterprises</td>
                  <td className="px-4 py-3">Trader</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="px-4 py-3">12 Sep 2025</td>
                  <td className="px-4 py-3">
                    <button className="font-semibold text-blue-700 hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
