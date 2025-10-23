// src/components/modals/POmodals/ViewPOModal.tsx
'use client'

import { X, FileText, Building, Phone, Mail, MapPin, Calendar, Shield } from 'lucide-react'
import { PurchaseOrder } from '@/models/Supplier'

interface ViewPOModalProps {
  isOpen: boolean
  onClose: () => void
  purchaseOrder: PurchaseOrder | null
}

export default function ViewPOModal({ isOpen, onClose, purchaseOrder }: ViewPOModalProps) {
  if (!isOpen || !purchaseOrder) return null

  const totalAmount = purchaseOrder.items?.reduce((total, item) => total + (item.amount || 0), 0) || 0
  const itemsCount = purchaseOrder.items?.length || 0

  const statusColor = {
    Draft: 'bg-gray-400',
    Submitted: 'bg-blue-500',
    Approved: 'bg-green-500',
    Rejected: 'bg-red-500',
    Completed: 'bg-purple-500',
    Cancelled: 'bg-red-400'
  }[purchaseOrder.status] || 'bg-gray-400'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Purchase Order Details
              </h3>
              <p className="text-sm text-gray-500">PO Number: {purchaseOrder.poNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* PO Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">PO Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">PO Number:</span>
                    <span className="font-medium">{purchaseOrder.poNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${statusColor}`}>
                      {purchaseOrder.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{purchaseOrder.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium text-green-600">
                      Rs {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Company Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{purchaseOrder.companyName}</span>
                  </div>
                  {purchaseOrder.vatNumber && (
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-gray-500" />
                      <span>VAT: {purchaseOrder.vatNumber}</span>
                    </div>
                  )}
                  {purchaseOrder.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{purchaseOrder.email}</span>
                    </div>
                  )}
                  {purchaseOrder.phoneNumber && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{purchaseOrder.phoneNumber}</span>
                    </div>
                  )}
                  {purchaseOrder.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{purchaseOrder.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Items Table */}
            {purchaseOrder.items && purchaseOrder.items.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Items ({itemsCount})</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-3 py-2 text-left">Item Code</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Description</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Quantity</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Unit Price</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Tax</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Warranty</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseOrder.items.map((item, index) => (
                        <tr key={item.id || index}>
                          <td className="border border-gray-300 px-3 py-2">{item.itemCode}</td>
                          <td className="border border-gray-300 px-3 py-2">
                            <div>
                              <div className="font-medium">{item.description}</div>
                              {item.note && (
                                <div className="text-xs text-gray-500 mt-1">{item.note}</div>
                              )}
                            </div>
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center">{item.qty}</td>
                          <td className="border border-gray-300 px-3 py-2">
                            Rs {item.rate.toLocaleString()}
                          </td>
                          <td className="border border-gray-300 px-3 py-2">{item.tax}</td>
                          <td className="border border-gray-300 px-3 py-2">{item.warranty || 'N/A'}</td>
                          <td className="border border-gray-300 px-3 py-2 font-medium">
                            Rs {item.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Notes */}
            {purchaseOrder.note && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Notes & Comments</h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{purchaseOrder.note}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}