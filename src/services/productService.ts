import { Product } from '@/models/Product';

export async function getProducts(): Promise<Product[]> {
  return [
  { 
    id: 1, 
    name: 'Brake Pad Set', 
    supplier: 'Nippon Auto Parts Co.', 
    productCode: 'JPN-SPR-2001', 
    quantity: 8, 
    soldCount: 15, 
    status: 'In stock', 
    supplierPrice: 'LKR 18500', 
    sellPrice: 'LKR 39500', 
    createdAt: 'Super Admin', 
    date: '20.09.2025' 
  },
  { 
    id: 2, 
    name: 'Engine Oil Filter', 
    supplier: 'Tokyo Motors Ltd.', 
    productCode: 'JPN-SPR-2002', 
    quantity: 3, 
    soldCount: 10, 
    status: 'Low stock', 
    supplierPrice: 'LKR 8500', 
    sellPrice: 'LKR 17900', 
    createdAt: 'Super Admin', 
    date: '19.09.2025' 
  },
  { 
    id: 3, 
    name: 'Radiator Fan', 
    supplier: 'Yamato Spare Traders', 
    productCode: 'JPN-SPR-2003', 
    quantity: 0, 
    soldCount: 7, 
    status: 'Out of stock', 
    supplierPrice: 'LKR 32500', 
    sellPrice: 'LKR 68500', 
    createdAt: 'Super Admin', 
    date: '18.09.2025' 
  },
  { 
    id: 4, 
    name: 'Headlight Assembly', 
    supplier: 'Osaka Auto Imports', 
    productCode: 'JPN-SPR-2004', 
    quantity: 4, 
    soldCount: 9, 
    status: 'Low stock', 
    supplierPrice: 'LKR 99500', 
    sellPrice: 'LKR 205000', 
    createdAt: 'Super Admin', 
    date: '18.09.2025' 
  },
  { 
    id: 5, 
    name: 'Shock Absorber Set', 
    supplier: 'Kobe Auto Supplies', 
    productCode: 'JPN-SPR-2005', 
    quantity: 6, 
    soldCount: 14, 
    status: 'In stock', 
    supplierPrice: 'LKR 67500', 
    sellPrice: 'LKR 138000', 
    createdAt: 'Super Admin', 
    date: '17.09.2025' 
  }
];
}