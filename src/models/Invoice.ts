// models/Invoice.ts
export interface InvoiceItem {
  id: string;
  itemCode: string;
  description: string;
  qty: number;
  rate: number;
  tax: string;
  warranty: string;
  amount: number;
  // Add these new fields
  customerName?: string;
  address?: string;
  customerNo?: string;
  salesPerson?: string;
  date?: string;
  customerPONo?: string;
  invoiceNumber?: string;
  taxPercent?: string;
  terms?: string;
  vatNumber?: string;
  type?: string;
}

export interface Invoice {
  id?: string;
  customerName: string;
  address: string;
  invoiceNumber: string;
  date: string;
  taxPercent: string;
  terms: string;
  vatNumber: string;
  customerNo: string;
  customerPONo: string;
  type: string;
  salesPerson: string;
  items: InvoiceItem[];
}