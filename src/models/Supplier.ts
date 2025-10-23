export interface Supplier {
  id: number;
  name: string;
  contact: string;
  productsSupplied: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
  vatNumber?: string;
}

export interface PurchaseOrder {
  id?: string;
  poNumber: string;
  companyName: string;
  vatNumber?: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
  items: PurchaseOrderItem[];
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Completed' | 'Cancelled';
  date: string;
  totalAmount: number;
  warranty?: string;
  note?: string;
}

export interface PurchaseOrderItem {
  id: string;
  itemCode: string;
  description: string;
  qty: number;
  rate: number;
  tax: string;
  warranty?: string;
  amount: number;
  note?: string;
}