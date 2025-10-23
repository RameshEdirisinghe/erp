import { Finance } from '@/models/Finance';

export async function getFinances(): Promise<Finance[]> {
  return [
    { id: 1, transactionId: 'TXN-001', description: 'Fuel Refill', amount: 5000, date: '23.09.2025', status: 'Completed', createdAt: '23.09.2025' },
    { id: 2, transactionId: 'TXN-002', description: 'Maintenance', amount: 1200, date: '22.09.2025', status: 'Pending', createdAt: '22.09.2025' },
    { id: 3, transactionId: 'TXN-003', description: 'Rent Payment', amount: 3000, date: '21.09.2025', status: 'Completed', createdAt: '21.09.2025' },
    { id: 4, transactionId: 'TXN-004', description: 'Oil Change', amount: 800, date: '20.09.2025', status: 'Failed', createdAt: '20.09.2025' },
    { id: 5, transactionId: 'TXN-005', description: 'Brake Inspection', amount: 1500, date: '19.09.2025', status: 'Pending', createdAt: '19.09.2025' },
  ];
}