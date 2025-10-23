import { Invoice } from '@/models/Invoice';

let invoices: Invoice[] = [];

export const invoicesService = {
  getInvoices: (): Invoice[] => invoices,
  addInvoice: (invoice: Omit<Invoice, 'id'>): Invoice => {
    const newInvoice: Invoice = {
      ...invoice,
      id: Date.now().toString(),
      items: invoice.items || [],
    };
    invoices.push(newInvoice);
    return newInvoice;
  },
  updateInvoice: (id: string, invoice: Partial<Invoice>): Invoice | undefined => {
    const index = invoices.findIndex((inv) => inv.id === id);
    if (index !== -1) {
      invoices[index] = { ...invoices[index], ...invoice };
      return invoices[index];
    }
    return undefined;
  },
  reset: () => {
    invoices = [];
  },
};