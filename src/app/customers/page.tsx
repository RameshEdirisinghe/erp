// app/customers/page.tsx
import CustomerTable from '@/components/tables/CustomerTable';
import { getCustomers } from '@/services/customerService';
import { Plus } from 'lucide-react';

export default async function Customers() {
  const customers = await getCustomers();

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-gray-900 flex flex-col space-y-6 rounded-lg overflow-hidden mt-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-4">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your customer information</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-lg flex items-center gap-2 text-white shadow-md transition">
          <Plus size={16} />
          <span className="font-medium">Add Customer</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-white p-5 rounded-xl shadow-md border border-gray-100">
        <input
          type="text"
          placeholder="Search here..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
        <select className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Statuses</option>
        </select>
        <button className="bg-gray-900 hover:bg-gray-800 px-5 py-2.5 rounded-lg text-white text-sm shadow-md transition">
          More Filters
        </button>
      </div>

      {/* Table */}
      <CustomerTable data={customers} />
    </div>
  );
}
