import { Edit, Trash, Eye } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  role: string;
  salary: number;
}

interface DataTableRowProps {
  row: Employee;
}

export default function DataTableRow({ row }: DataTableRowProps) {
  if (!row) return null;

  return (
    <tr className="hover:bg-gray-100 transition-colors text-sm">
      <td className="border-b border-gray-200 p-4">{row.id}</td>
      <td className="border-b border-gray-200 p-4">{row.name}</td>
      <td className="border-b border-gray-200 p-4">{row.role}</td>
      <td className="border-b border-gray-200 p-4">${row.salary}</td>
      <td className="border-b border-gray-200 p-4 flex gap-3">
        <Edit size={18} className="text-gray-500 hover:text-gray-700 cursor-pointer" />
        <Trash size={18} className="text-red-500 hover:text-red-600 cursor-pointer" />
        <Eye size={18} className="text-blue-500 hover:text-blue-600 cursor-pointer" />
      </td>
    </tr>
  );
}
