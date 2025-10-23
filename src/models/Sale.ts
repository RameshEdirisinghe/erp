export interface Sale {
  id: number;
  customer: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
  createdAt: string;
  email?: string;
  phone?: string;
  description?: string;
  location?: string;
  vatNumber?: string;
  customerVat?: string;
  poNumber?: string;
  items?: SaleItem[];
}

export interface SaleItem {
  id: string;
  itemCode: string;
  description: string;
  qty: number;
  rate: number;
  tax: string;
  warranty?: string;
  amount: number;
}

export interface Quotation {
  id?: string;
  quoteNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  poNumber?: string;
  vatNumber?: string;
  customerVat?: string;
  items: QuotationItem[];
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired';
  date: string;
  validUntil: string;
  totalAmount: number;
  notes?: string;
}

export interface QuotationItem {
  id: string;
  itemCode: string;
  description: string;
  qty: number;
  rate: number;
  tax: string;
  warranty?: string;
  amount: number;
}