import { Product } from '@/models/Product';
import { Edit, Trash, Eye } from 'lucide-react';

interface InventoryTableRowProps {
  row: Product;
}

export default function InventoryTableRow({ row }: InventoryTableRowProps) {
  let statusColor = '';
  switch (row.status) {
    case 'In stock':
      statusColor = 'bg-green-500';
      break;
    case 'Low stock':
      statusColor = 'bg-yellow-400';
      break;
    case 'Out of stock':
      statusColor = 'bg-red-500';
      break;
  }

  return (
    <tr className="hover:bg-gray-100 transition-colors mt-4">
      <td className="border-b border-gray-200 p-4">{row.name}</td>
      <td className="border-b border-gray-200 p-4">{row.supplier}</td>
      <td className="border-b border-gray-200 p-4">{row.productCode}</td>
      <td className="border-b border-gray-200 p-4">{row.quantity}</td>
      <td className="border-b border-gray-200 p-4">{row.soldCount}</td>
      <td className="border-b border-gray-200 px-4 py-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusColor}`}
        >
          {row.status}
        </span>
      </td>
      <td className="border-b border-gray-200 p-4">{row.supplierPrice}</td>
      <td className="border-b border-gray-200 p-4">{row.sellPrice}</td>
      <td className="border-b border-gray-200 p-4">{row.createdAt}</td>
      <td className="border-b border-gray-200 p-4 flex gap-3 mt-2">
        <Edit size={18} className="text-gray-500 hover:text-gray-700 cursor-pointer" />
        <Trash size={18} className="text-red-500 hover:text-red-600 cursor-pointer" />
        <Eye size={18} className="text-blue-500 hover:text-blue-600 cursor-pointer" />
      </td>
      <td className="border-b border-gray-200 p-4">{row.date}</td>
    </tr>
  );
}
