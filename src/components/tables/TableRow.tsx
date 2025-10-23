import { Product } from '@/models/Product';

interface TableRowProps {
  row: Product;
}

export default function TableRow({ row }: TableRowProps) {
  return (
    <tr className="hover:bg-gray-100 transition-colors mt-4">
      <td className="border-b border-gray-200 p-3">{row.name}</td>
      <td className="border-b border-gray-200 p-3">{row.supplier}</td>
      <td className="border-b border-gray-200 p-3">{row.productCode}</td>
      <td className="border-b border-gray-200 p-3">{row.quantity}</td>
      <td className="border-b border-gray-200 p-3">{row.sellPrice}</td>
      <td className="border-b border-gray-200 p-3">{row.date}</td>
    </tr>
  );
}
