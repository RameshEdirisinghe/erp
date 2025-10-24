import { Sale, Quotation } from '@/models/Sale';

// Simple in-memory data storage
let salesData: Sale[] = [
  { 
    id: 1, 
    customer: 'John Doe', 
    amount: 20000, 
    date: '23.09.2024', 
    status: 'Pending', 
    createdAt: '23.09.2024',
    email: 'john.doe@email.com',
    phone: '+94 77 123 4567',
    description: 'Laptop Purchase',
    location: 'Colombo, Sri Lanka',
    vatNo: 'VAT123456789',
    quotationNo: 'QTN-2024-001',
    items: [
      {
        id: '1',
        itemCode: 'ITEM-001',
        description: 'Laptop',
        qty: 1,
        rate: 20000,
        tax: 'V18',
        warranty: '1 Year',
        amount: 20000,
      },
    ],
  },
  { 
    id: 2, 
    customer: 'ABC Corporation', 
    amount: 150000, 
    date: '24.09.2024', 
    status: 'Completed', 
    createdAt: '20.09.2024',
    email: 'purchase@abccorp.com',
    phone: '+94 11 234 5678',
    description: 'Office Equipment',
    location: 'Colombo 03, Sri Lanka',
    vatNo: 'VAT987654321',
    quotationNo: 'QTN-2024-002',
    items: [
      {
        id: '1',
        itemCode: 'ITEM-002',
        description: 'Office Chairs',
        qty: 10,
        rate: 15000,
        tax: 'V18',
        warranty: '2 Years',
        amount: 150000,
      },
    ],
  },
 
];

let quotations: Quotation[] = [];

export const Saleservices = {
  // Get all sales
  getSales: (): Sale[] => [...salesData],
  
  // Add a new sale
  addSale: (sale: Omit<Sale, 'id'>): Sale => {
    const newSale: Sale = {
      ...sale,
      id: Date.now(),
    };
    salesData = [...salesData, newSale];
    return newSale;
  },

  // Create a quotation and corresponding sale
  createQuotation: (quotationData: Omit<Quotation, 'id'>): Quotation => {
    const newQuotation: Quotation = {
      ...quotationData,
      id: Date.now().toString(),
    };
    
    quotations = [...quotations, newQuotation];
    
    // Create sale from quotation with corrected field mapping
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB').replace(/\//g, '.');
    const newSale: Omit<Sale, 'id'> = {
      customer: quotationData.customerName,
      amount: quotationData.totalAmount,
      date: quotationData.date,
      status: 'Pending',
      createdAt: formattedDate,
      email: quotationData.customerEmail,
      phone: quotationData.customerPhone,
      description: quotationData.items[0]?.description || 'Quotation Items',
      location: quotationData.customerAddress,
      vatNo: quotationData.vatNumber, // Changed from vatNumber to vatNo
      quotationNo: quotationData.quoteNumber, // Changed from quotationNumber to quotationNo
      items: quotationData.items.map(item => ({
        ...item,
        id: item.id || Date.now().toString(),
      })),
    };
    
    Saleservices.addSale(newSale);
    
    return newQuotation;
  },

  // Update sale
  updateSale: (id: number, saleData: Partial<Sale>): Sale | null => {
    const saleIndex = salesData.findIndex(sale => sale.id === id);
    if (saleIndex !== -1) {
      salesData[saleIndex] = { ...salesData[saleIndex], ...saleData };
      return salesData[saleIndex];
    }
    return null;
  },

  // Delete sale
  deleteSale: (id: number): boolean => {
    const initialLength = salesData.length;
    salesData = salesData.filter(sale => sale.id !== id);
    return salesData.length < initialLength;
  },
};