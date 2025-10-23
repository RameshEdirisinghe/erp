'use client'

import { useState } from 'react'
import SupplierManagementTableRow from './SupplierManagementTableRow'

interface SupplierManagementTableProps {
  data: any[]
}

export default function SupplierManagementTable({ data }: SupplierManagementTableProps) {
  const [isMobile, setIsMobile] = useState(false)

  // Check if data is defined and is an array
  if (!data || !Array.isArray(data)) {
    return <p className="text-gray-500 p-4">No data available.</p>
  }

  if (data.length === 0) {
    return <p className="text-gray-500 p-4">No purchase orders available.</p>
  }

  return (
    <div className="w-full">
      {/* Mobile View */}
      <div className="lg:hidden space-y-4">
        {data.map((item, index) => (
          <div key={item.id || index} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <SupplierManagementTableRow item={item} index={index} isMobile={true} />
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block max-w-full table-fixed shadow-md rounded-lg border border-gray-200 w-full">
        <table className="w-full text-sm text-left text-gray-900">
          <thead className="bg-gray-100 text-gray-900">
            <tr>
              <th className="px-4 py-3 text-xs uppercase">PO Number</th>
              <th className="px-4 py-3 text-xs uppercase">Company Name</th>
              <th className="px-4 py-3 text-xs uppercase">VAT Number</th>
              <th className="px-4 py-3 text-xs uppercase">VAT</th>
              <th className="px-4 py-3 text-xs uppercase">Total Amount (LKR)</th>
              <th className="px-4 py-3 text-xs uppercase">Items Count</th>
              <th className="px-4 py-3 text-xs uppercase">Warranty</th>
              <th className="px-4 py-3 text-xs uppercase">Status</th>
              <th className="px-4 py-3 text-xs uppercase">Date</th>
              <th className="px-4 py-3 text-xs uppercase">Contact Information</th>
              <th className="px-4 py-3 text-xs uppercase">Notes & Comments</th>
              <th className="px-4 py-3 text-xs uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <SupplierManagementTableRow key={item.id || index} item={item} index={index} isMobile={false} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}