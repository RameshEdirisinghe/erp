'use client';

import { useState } from 'react';
import InvoicesForm from '@/components/forms/invociesform';
import InvoicesTable from '@/components/tables/invociesTable';
import { Invoice, InvoiceItem } from '@/models/Invoice';
import { invoicesService } from '@/services/invociesService';

const initialItem: InvoiceItem = {
  id: '1',
  itemCode: 'head000159',
  description: 'Headlight',
  qty: 1,
  rate: 1000,
  tax: 'V18',
  warranty: '1 year',
  amount: 1000,
  customerName: 'chan Smith',
  address: '123 Main Street, Colombo 01, Sri Lanka',
  customerNo: 'CUST00123',
  salesPerson: 'Sarah Johnson',
  date: '2024-01-15',
  customerPONo: 'PO-2024-001',
  invoiceNumber: 'INV-2024-001',
  taxPercent: '18%',
  terms: '30 days credit only',
  vatNumber: 'VAT123456789',
  type: 'normal'
};

export default function InvoicesPage() {
  const [items, setItems] = useState<InvoiceItem[]>([initialItem]);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const handleAddItem = (newItem: InvoiceItem) => {
    setItems((prev) => [...prev, newItem]);
  };

  const handleSubmit = (invoice: Omit<Invoice, 'id'> | Invoice, isEdit: boolean) => {
    if (isEdit && editingInvoice) {
      invoicesService.updateInvoice(editingInvoice.id!, { ...invoice, items });
      setEditingInvoice(null);
    } else {
      invoicesService.addInvoice({ ...invoice, items });
    }
    setItems([initialItem]);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setItems(invoice.items || [initialItem]);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Invoices</h1>
      <InvoicesForm
        onAddItem={handleAddItem}
        onSubmit={handleSubmit}
        editingInvoice={editingInvoice}
      />
      {items.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Invoice Items</h3>
          <InvoicesTable items={items} />
        </div>
      )}
    </div>
  );
}
