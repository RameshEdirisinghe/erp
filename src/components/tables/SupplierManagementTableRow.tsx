'use client'

import { Edit, SquareArrowOutUpRight, Trash, Eye, FileText, Building, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { PurchaseOrder } from '@/models/Supplier'
import ViewPOModal from '@/components/modals/POmodals/ViewPOModal'
import EditPOModal from '@/components/modals/POmodals/EditPOModal'
import DeletePOModal from '@/components/modals/POmodals/DeleteModal'
import { deletePurchaseOrder } from '@/services/supplierService'

interface SupplierManagementTableRowProps {
  item: PurchaseOrder
  index: number
  isMobile: boolean
  onUpdate: () => void
}

export default function SupplierManagementTableRow({ 
  item, 
  index, 
  isMobile, 
  onUpdate 
}: SupplierManagementTableRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const rowColor = index % 2 === 0 ? 'bg-white' : 'bg-gray-50'

  const statusColor = { 
    Draft: 'bg-gray-400',
    Submitted: 'bg-blue-500',
    Approved: 'bg-green-500',
    Rejected: 'bg-red-500',
    Completed: 'bg-purple-500',
    Cancelled: 'bg-red-400'
  }[item.status] || 'bg-gray-400'

  // Calculate total from items
  const totalAmount = item.items?.reduce((total: number, item: any) => total + (item.amount || 0), 0) || 0
  const itemsCount = item.items?.length || 0

  // Get description
  const getDescription = () => {
    if (item.items && item.items.length > 0 && item.items[0].description) {
      return item.items[0].description
    }
    return 'No description'
  }

  const description = getDescription()

  const handleDelete = async () => {
    if (!item.id) return
    try {
      await deletePurchaseOrder(item.id)
      onUpdate() // Refresh the table
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const handleView = () => {
    setViewModalOpen(true)
  }

  const handleEdit = () => {
    setEditModalOpen(true)
  }

  const handleDeleteClick = () => {
    setDeleteModalOpen(true)
  }

  // Mobile View
  if (isMobile) {
    return (
      <>
        <div className={`${rowColor} p-4 rounded-lg border border-gray-200 space-y-3`}>
          {/* Header Section */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-blue-600" />
              <span className="font-semibold text-gray-900">
                {item.poNumber}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${statusColor}`}>
                {item.status}
              </span>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-gray-600">Company</div>
              <div className="font-medium text-gray-900">{item.companyName}</div>
            </div>
            <div>
              <div className="text-gray-600">Total Amount</div>
              <div className="font-medium text-gray-900">Rs {totalAmount.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-600">Items</div>
              <div className="font-medium text-gray-900">{itemsCount}</div>
            </div>
            <div>
              <div className="text-gray-600">Date</div>
              <div className="font-medium text-gray-900">{item.date}</div>
            </div>
          </div>

          {/* Expandable Details */}
          {isExpanded && (
            <div className="space-y-3 pt-3 border-t border-gray-200">
              {/* VAT Information */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-gray-600">VAT Number</div>
                  <div className="font-medium text-gray-900">{item.vatNumber || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-gray-600">VAT</div>
                  <div className="font-medium text-gray-900">
                    {item.items && item.items.length > 0 ? item.items[0].tax : 'V18'}
                  </div>
                </div>
              </div>

              {/* Warranty */}
              <div>
                <div className="text-gray-600 text-sm">Warranty</div>
                <div className="font-medium text-gray-900">
                  {item.warranty || (item.items && item.items.length > 0 ? item.items[0].warranty : 'N/A')}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <div className="text-gray-600 text-sm mb-1">Contact Information</div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-500" />
                    <span className="text-gray-900">{item.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-500" />
                    <span className="text-gray-900">{item.phoneNumber || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="text-gray-600 text-sm">Description</div>
                <div className="text-gray-900 text-sm">{description}</div>
              </div>

              {/* Notes */}
              <div>
                <div className="text-gray-600 text-sm">Notes & Comments</div>
                <div className="text-gray-900 text-sm">
                  {item.note ? (
                    <div className="whitespace-pre-wrap">{item.note}</div>
                  ) : (
                    'No notes'
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-4 pt-2">
                <button 
                  onClick={handleView}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                >
                  <Eye size={18} />
                </button>
                <button 
                  onClick={handleEdit}
                  className="p-2 text-gray-500 hover:bg-gray-50 rounded-full"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={handleDeleteClick}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                >
                  <Trash size={18} />
                </button>
                <button className="p-2 text-sky-500 hover:bg-sky-50 rounded-full">
                  <SquareArrowOutUpRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <ViewPOModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          purchaseOrder={item}
        />

        <EditPOModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          purchaseOrder={item}
          onUpdate={onUpdate}
        />

        <DeletePOModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Delete Purchase Order"
          description={`Are you sure you want to delete ${item.poNumber}? This action cannot be undone.`}
        />
      </>
    )
  }

  // Desktop View
  return (
    <>
      <tr className={`${rowColor} border-b hover:bg-gray-50 transition-colors`}>
        {/* PO Number */}
        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-blue-600" />
            {item.poNumber}
          </div>
        </td>
        
        {/* Company Name */}
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
          <div className="flex items-center gap-2">
            <Building size={16} className="text-gray-500" />
            <div>
              <div className="line-clamp-1">{item.companyName}</div>
              <div className="text-xs text-gray-500 line-clamp-1">{item.location}</div>
            </div>
          </div>
        </td>
        
        {/* VAT Number */}
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
          {item.vatNumber || 'N/A'}
        </td>
        
        {/* VAT */}
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
          {item.items && item.items.length > 0 ? item.items[0].tax : 'V18'}
        </td>
        
        {/* Total Amount */}
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
          Rs {totalAmount.toLocaleString()}
        </td>
        
        {/* Items Count */}
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
          {itemsCount}
        </td>
        
        {/* Warranty */}
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
          {item.warranty || (item.items && item.items.length > 0 ? item.items[0].warranty : 'N/A')}
        </td>
        
        {/* Status */}
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
          <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusColor}`}>
            {item.status}
          </span>
        </td>
        
        {/* Date */}
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
          {item.date}
        </td>
        
        {/* Contact Information */}
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
          <div className="space-y-1 max-w-[200px]">
            <div className="flex items-center gap-1">
              <Mail size={14} className="text-gray-500 flex-shrink-0" />
              <span className="truncate"><strong>Email:</strong> {item.email || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone size={14} className="text-gray-500 flex-shrink-0" />
              <span className="truncate"><strong>Phone:</strong> {item.phoneNumber || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText size={14} className="text-gray-500 flex-shrink-0" />
              <span className="truncate"><strong>Desc:</strong> {description}</span>
            </div>
          </div>
        </td>
        
        {/* Notes & Comments */}
        <td className="px-4 py-4 text-sm text-gray-900 max-w-[200px]">
          <div className="text-gray-700">
            {item.note ? (
              <div className="whitespace-pre-wrap line-clamp-3">{item.note}</div>
            ) : (
              'No notes'
            )}
          </div>
        </td>
        
        {/* Actions */}
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
          <div className="flex gap-2">
            <button 
              onClick={handleView}
              className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
            >
              <Eye size={16} />
            </button>
            <button 
              onClick={handleEdit}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
            >
              <Edit size={16} />
            </button>
            <button 
              onClick={handleDeleteClick}
              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
            >
              <Trash size={16} />
            </button>
            <button className="p-1 text-sky-500 hover:text-sky-700 hover:bg-sky-50 rounded transition-colors">
              <SquareArrowOutUpRight size={16} />
            </button>
          </div>
        </td>
      </tr>

      {/* Modals */}
      <ViewPOModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        purchaseOrder={item}
      />

      <EditPOModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        purchaseOrder={item}
        onUpdate={onUpdate}
      />

      <DeletePOModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Purchase Order"
        description={`Are you sure you want to delete ${item.poNumber}? This action cannot be undone.`}
      />
    </>
  )
}