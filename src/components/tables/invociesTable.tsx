import { InvoiceItem } from '@/models/Invoice';
import InvoicesTableRow from './invociesTableRow';

interface InvoicesTableProps {
  items: InvoiceItem[];
}

export default function InvoicesTable({ items }: InvoicesTableProps) {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200 w-full">
      <table className="w-full text-sm text-left text-gray-900">
        <thead className="bg-gray-100 text-gray-900">
          <tr>
            <th className="px-6 py-3 text-xs uppercase">Item Code</th>
            <th className="px-6 py-3 text-xs uppercase">Description</th>
            <th className="px-6 py-3 text-xs uppercase">Qty</th>
            <th className="px-6 py-3 text-xs uppercase">Rate (LKR)</th>
            <th className="px-6 py-3 text-xs uppercase">Tax</th>
            <th className="px-6 py-3 text-xs uppercase">Warranty</th>
            <th className="px-6 py-3 text-xs uppercase">Amount (LKR)</th>
            <th className="px-6 py-3 text-xs uppercase">Additonal Details</th>
            <th className="px-6 py-3 text-xs uppercase">Invoice Details</th>
           
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <InvoicesTableRow key={item.id || index} item={item} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
}