'use client';

import SalesManagementTableRow from './SalesManagementTableRow';

interface SalesManagementTableProps {
  data: any[];
}

export default function SalesManagementTable({ data }: SalesManagementTableProps) {
  if (!data || !Array.isArray(data)) {
    return <p className="text-gray-500 p-4">No data available.</p>;
  }

  if (data.length === 0) {
    return <p className="text-gray-500 p-4">No sales records available.</p>;
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200 w-full">
      <table className="w-full text-sm text-left text-gray-900">
        <thead className="bg-gray-100 text-gray-900">
          <tr>
            <th className="px-6 py-3 text-xs uppercase">Customer</th>  
            <th className="px-6 py-3 text-xs uppercase">Amount (LKR)</th>
            <th className="px-6 py-3 text-xs uppercase">VAT NO</th>
            <th className="px-6 py-3 text-xs uppercase">Quotation NO</th>
            <th className="px-6 py-3 text-xs uppercase">Status</th>
            <th className="px-6 py-3 text-xs uppercase">Date</th>
            <th className="px-6 py-3 text-xs uppercase">Created At</th>
            <th className="px-6 py-3 text-xs uppercase">Contact Information</th>
            <th className="px-6 py-3 text-xs uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <SalesManagementTableRow 
              key={item.id || index} 
              item={item} 
              index={index} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}