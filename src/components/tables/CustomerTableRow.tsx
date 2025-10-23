// components/tables/CustomerTableRow.tsx
import { Customer } from '@/models/Customer';
import { Edit, Trash, Eye } from 'lucide-react';

interface CustomerTableRowProps {
  row: Customer;
}

export default function CustomerTableRow({ row }: CustomerTableRowProps) {
  const statusColor =
    row.status === 'Active'
      ? 'bg-green-500 text-green-400'
      : 'bg-red-500 text-red-400';

  return (
    <tr className="hover:bg-gray-100 transition-colors mt-4">
      <td className="border-b border-gray-200 p-4">{row.name}</td>
      <td className="border-b border-gray-200 p-4">{row.email}</td>
      <td className="border-b border-gray-200 p-4">{row.orders}</td>
      <td className="border-b border-gray-200 p-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusColor}`}>
          {row.status}
        </span>
      </td>
      <td className="border-b border-gray-200 p-4">{row.createdAt}</td>
      <td className="border-b border-gray-200 p-4 flex gap-3 mt-2">
        <Edit size={16} className="text-blue-600 cursor-pointer hover:text-blue-800" />
        <Trash size={16} className="text-red-600 cursor-pointer hover:text-red-800" />
        <Eye size={16} className="text-gray-600 cursor-pointer hover:text-gray-900" />
      </td>
    </tr>
  );
}
