import { Supplier, PurchaseOrder } from '@/models/Supplier';

// Mock data for suppliers
export async function getSuppliers(): Promise<Supplier[]> {
  return [
    { 
      id: 1, 
      name: 'Supplier X', 
      contact: 'contact@x.com', 
      email: 'contact@x.com',
      phoneNumber: '+94 77 123 4567',
      location: 'Colombo, Sri Lanka',
      vatNumber: '123456789',
      productsSupplied: 10, 
      status: 'Active', 
      createdAt: '23.09.2024' 
    },
  ];
}

// Mock data for purchase orders
let purchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    poNumber: 'PO-2024-001',
    companyName: 'Supplier X',
    vatNumber: '123456789',
    email: 'contact@x.com',
    phoneNumber: '+94 77 123 4567',
    location: 'Colombo, Sri Lanka',
    status: 'Approved',
    date: '2024-01-15',
    totalAmount: 150000,
    warranty: '2 years',
    note: 'Please deliver by end of month.',
    items: [
      {
        id: '1',
        itemCode: 'LAP001',
        description: 'Gaming Laptop',
        qty: 5,
        rate: 30000,
        tax: 'V18',
        warranty: '2 years',
        amount: 150000,
        note: 'Handle with care'
      }
    ]
  }
];

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  return purchaseOrders;
}

export async function createPurchaseOrder(poData: Omit<PurchaseOrder, 'id'>): Promise<PurchaseOrder> {
  const newPO: PurchaseOrder = {
    ...poData,
    id: Date.now().toString(),
    note: poData.note ,
  };
  
  if (!newPO.warranty && newPO.items?.length > 0) {
    newPO.warranty = newPO.items[0].warranty ;
  }

  purchaseOrders.push(newPO);
  return newPO;
}

export async function updatePurchaseOrder(id: string, poData: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
  const index = purchaseOrders.findIndex(po => po.id === id);
  if (index === -1) throw new Error('Purchase order not found');

  purchaseOrders[index] = { 
    ...purchaseOrders[index], 
    ...poData, 
    note: poData.note || purchaseOrders[index].note 
  };

  if (!purchaseOrders[index].warranty && purchaseOrders[index].items?.length > 0) {
    purchaseOrders[index].warranty = purchaseOrders[index].items[0].warranty || 'N/A';
  }

  return purchaseOrders[index];
}

export async function deletePurchaseOrder(id: string): Promise<void> {
  purchaseOrders = purchaseOrders.filter(po => po.id !== id);
}