import { Customer } from '@/models/Customer';

export async function getCustomers(): Promise<Customer[]> {
  return [
    { id: 1, name: 'John Doe', email: 'john@example.com', orders: 5, status: 'Active', createdAt: '20.09.2025' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: 3, status: 'Active', createdAt: '19.09.2025' },
    { id: 3, name: 'Alice Johnson', email: 'alice@example.com', orders: 8, status: 'Inactive', createdAt: '18.09.2025' },
    { id: 4, name: 'Bob Brown', email: 'bob@example.com', orders: 2, status: 'Active', createdAt: '17.09.2025' },
    { id: 5, name: 'Emma Wilson', email: 'emma@example.com', orders: 6, status: 'Inactive', createdAt: '16.09.2025' },
  ];
}