'use client'

import { useState, useEffect } from 'react'
import SalesManagementTable from '@/components/tables/SalesManagementTable'
import QuotationForm from '@/components/forms/Qoutationform'
import { Saleservices } from '@/services/saleService'
import { Sale, Quotation } from '@/models/Sale'

export default function SalesClientWrapper() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  // Load sales on component mount
  useEffect(() => {
    const data = Saleservices.getSales()
    setSales([...data]) // Ensure new array reference
    setLoading(false)
  }, [])

  // Handle form submission
  const handleCreateQuotation = async (quotationData: Omit<Quotation, 'id'>) => {
    try {
      // Create quotation and corresponding sale
      const newQuotation = Saleservices.createQuotation(quotationData)
      
      // Update table with latest sales data
      const updatedSales = Saleservices.getSales()
      setSales([...updatedSales]) // Ensure new array reference for state update
      
      return { ...newQuotation, id: Date.now().toString() }
    } catch (error) {
      console.error('Failed to create quotation:', error)
      throw error
    }
  }

  if (loading) {
    return <div className="text-gray-500 p-4">Loading...</div>
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Sales Management</h1>
        <p className="text-gray-500">Create quotations and see sales in the table</p>
      </div>

      <QuotationForm onSubmit={handleCreateQuotation} />
      
      <div className="mt-6">
        <SalesManagementTable data={sales} />
      </div>
    </div>
  )
}