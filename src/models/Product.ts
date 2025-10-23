export interface Product {
  id: number;
  name: string;
  supplier: string;
  productCode: string;
  quantity: number;
  soldCount: number;
  status: 'In stock' | 'Low stock' | 'Out of stock';
  supplierPrice: string;
  sellPrice: string;
  createdAt: string;
  action?: []; // Optional, as actions are UI-only (edit/delete/view icons)
  date: string;
}