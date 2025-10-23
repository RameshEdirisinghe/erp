'use client';
import TableRow from '@/components/tables/TableRow';

interface DataTableProps {
  data: any[];
}

export default function DataTable({ data }: DataTableProps) {
  if (data.length === 0)
    return <p className="p-5 text-gray-500 rounded">No data available.</p>;

  const headers = ['Product Name', 'supplier', 'Product Code', 'Quantity', 'Price', 'Date'];

  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="w-full border-collapse text-gray-900">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="border-b border-gray-200 p-5 text-left text-sm font-medium"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <TableRow key={index} row={row} />
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center p-5 text-gray-700">
        <span>Showing {data.length} of {data.length}</span>
        <div className="flex space-x-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              className={`px-3 py-2 rounded text-sm font-medium ${
                i === 0 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-900'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <span className="px-2 text-gray-400">...</span>
          <button className="px-3 py-2 rounded text-sm font-medium bg-gray-200 text-gray-900">
            10
          </button>
        </div>
      </div>
    </div>
  );
}
