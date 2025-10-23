import { InvoiceItem } from '@/models/Invoice';

interface InvoicesTableRowProps {
  item: InvoiceItem;
  index: number;
}

export default function InvoicesTableRow({ item, index }: InvoicesTableRowProps) {
  const rowColor = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';

  return (
    <tr className={`${rowColor} border-b`}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.itemCode}</td>
      <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-700 max-w-xs">{item.description}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.qty}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.rate.toLocaleString()}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tax}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.warranty}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-900">{item.amount.toLocaleString()}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        <div className="space-y-1">
          <div><strong>Customer:</strong> {item.customerName}</div>
          <div><strong>Address:</strong> {item.address}</div>
          <div><strong>Customer No:</strong> {item.customerNo}</div>
          <div><strong>Sales Person:</strong> {item.salesPerson }</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        <div className="space-y-1">
          <div><strong>Invoice :</strong> {item.invoiceNumber}</div>
          <div><strong>Date:</strong> {item.date}</div>
         <div><strong>VAT :</strong> {item.vatNumber }</div>
          <div><strong>Customer PO:</strong> {item.customerPONo}</div>
          <div><strong>Tax:</strong> {item.taxPercent}</div>
        </div>
      </td>
      
      
    </tr>
  );
}