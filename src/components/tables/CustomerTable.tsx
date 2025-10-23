'use client';

import CustomerTableRow from './CustomerTableRow';

interface CustomerTableProps {
  data: [];
}

export default function CustomerTable({ data }: CustomerTableProps) {
  if (data.length === 0) return <p className="text-gray-500 p-5">No data available.</p>;

  const headers = ['Name', 'Email', 'Orders', 'Status', 'Created At', 'Action'];

  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="w-full border-collapse text-gray-900">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header) => (
              <th key={header} className="border-b border-gray-200 p-5 text-left text-sm font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <CustomerTableRow key={index} row={row} />
          ))}
        </tbody>
      </table>
     {/* Pagination */}
      <div className="flex justify-between items-center px-5 py-3 bg-gray-50 text-gray-700 rounded-b-xl border-t border-gray-200">
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs">&lt;</button>
          {[1, 2, 3, 4].map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded text-xs font-medium ${
                page === 1
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
          <span className="px-2 text-gray-400">...</span>
          <button className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs">
            10
          </button>
          <button className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs">&gt;</button>
        </div>
        <span className="bg-gray-900 px-3 py-1 rounded text-white text-xs font-medium">
          Showing {data.length}
        </span>
      </div>
    </div>
  );
}