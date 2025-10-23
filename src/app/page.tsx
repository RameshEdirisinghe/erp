import StatCard from '@/components/cards/StatCard';
// import LineChart from '@/components/charts/LineChart';
import DataTable from '@/components/tables/datatTable';
import { getProducts } from '@/services/productService';

export default async function Dashboard() {
  const products = await getProducts();

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-gray-900 flex flex-col space-y-6 rounded-lg overflow-hidden mt-3">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Sales" value="$120,000" />
        <StatCard title="Customers" value="1,200" />
        <StatCard title="Products" value="450" />
      </div>
{/* Filters */}
      <div className="flex flex-wrap gap-4 bg-white p-5 rounded-xl shadow-md border border-gray-100">
        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
        <select className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Categories</option>
        </select>
        <button className="bg-gray-900 hover:bg-gray-800 px-5 py-2.5 rounded-lg text-white text-sm shadow-md transition">
          More Filters
        </button>
      </div>
      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <DataTable data={products} />
      </div>

      {/* Optional LineChart */}
      {/* <LineChart /> */}
    </div>
  );
}
