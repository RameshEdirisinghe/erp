export interface Finance {
  id: number;
  transactionId: string;
  description: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  createdAt: string;
  action?: any;
}