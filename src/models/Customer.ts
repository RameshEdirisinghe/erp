export interface Customer {
  id: number;
  name: string;
  email: string;
  orders: number;
  status: 'Active' | 'Inactive'; // Based on typical customer status
  createdAt: string;
  action?: []; // Optional, for UI-only action icons (edit/delete/view)
}