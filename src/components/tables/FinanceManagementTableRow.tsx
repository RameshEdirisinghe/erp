import { Finance } from '@/models/Finance';
import { Edit, Trash, Eye } from 'lucide-react';

interface FinanceManagementTableRowProps {
  row: Finance;
}

export default function FinanceManagementTableRow({ row }: FinanceManagementTableRowProps) {
  const statusColor = {
    Completed: 'bg-green-500',
    Pending: 'bg-yellow-500',
    Failed: 'bg-red-500',
  }[row.status];

  return (
    <tr className="hover:bg-gray-100 transition-colors mt-4">
      <td className="border-b border-gray-200 p-4">{row.transactionId}</td>
      <td className="border-b border-gray-200 p-4">{row.description}</td>
      <td className="border-b border-gray-200 p-4">${row.amount.toFixed(2)}</td>
      <td className="border-b border-gray-200 p-4">{row.date}</td>
      <td className="border-b border-gray-200 p-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusColor}`}
        >
          {row.status}
        </span>
      </td>
      <td className="border-b border-gray-200 p-4">{row.createdAt}</td>
     <td className="border-b border-gray-200 p-4 flex gap-3 mt-2">
        <Edit size={18} className="text-gray-500 hover:text-gray-700 cursor-pointer" />
        <Trash size={18} className="text-red-500 hover:text-red-600 cursor-pointer" />
        <Eye size={18} className="text-blue-500 hover:text-blue-600 cursor-pointer" />
      </td>
    </tr>
  );
}