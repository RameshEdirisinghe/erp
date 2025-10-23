'use client';

import { useState, useEffect } from 'react';
import SupplierManagementTable from '@/components/tables/SupplierManagementTable';
import POform from '@/components/forms/PurchaseOrder';
import { getPurchaseOrders, createPurchaseOrder } from '@/services/supplierService';
import { PurchaseOrder } from '@/models/Supplier';

export default function SuppliersClientWrapper() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPurchaseOrders = async () => {
    try {
      const data = await getPurchaseOrders();
      setPurchaseOrders(data);
    } catch (error) {
      console.error('Failed to load purchase orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchaseOrders();
  }, []);

  const handleCreatePurchaseOrder = async (poData: Omit<PurchaseOrder, 'id'>) => {
    const newPO = await createPurchaseOrder(poData);
    setPurchaseOrders(prev => [...prev, newPO]);
    return newPO;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-gray-900 flex flex-col space-y-6 rounded-lg overflow-hidden mt-3">
  <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Supplier Management</h1>
        <p className="text-gray-500">Create quotations and see sales in the table</p>
      </div>
      
      <div>
        <POform 
          onSubmit={handleCreatePurchaseOrder} 
          onSuccess={loadPurchaseOrders} 
        />
      </div>
      
      <SupplierManagementTable data={purchaseOrders} />
    </div>
  );
}