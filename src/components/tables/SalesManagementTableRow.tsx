import { Edit, Trash, Eye, User, Phone, Mail, MapPin, Hash } from 'lucide-react';
import { useState } from 'react';
import ViewSaleModal from '../modals/Salesmodals/view';
import EditSaleModal from '../modals/Salesmodals/Edit';
import DeleteSaleModal from '../modals/Salesmodals/delete';

interface SalesManagementTableRowProps {
  item: any;
  index: number;
  onUpdate?: (updatedItem: any) => void;
  onDelete?: (itemId: string) => void;
}

export default function SalesManagementTableRow({ 
  item, 
  index, 
  onUpdate, 
  onDelete 
}: SalesManagementTableRowProps) {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const rowColor = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';

  // Dynamic status color mapping
  const statusColor =
    {
      Completed: 'bg-green-500',
      Pending: 'bg-yellow-500',
      Cancelled: 'bg-red-500',
      Draft: 'bg-blue-500',
      Approved: 'bg-emerald-600',
      Rejected: 'bg-rose-500',
    }[item.status] || 'bg-gray-400';

  // Action handlers
  const handleView = () => setIsViewModalOpen(true);
  const handleEdit = () => setIsEditModalOpen(true);
  const handleDelete = () => setIsDeleteModalOpen(true);

  const handleSaveEdit = (updatedSale: any) => {
    if (onUpdate) {
      onUpdate(updatedSale);
    }
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(item.id);
    }
  };

  return (
    <>
      <tr className={`${rowColor} border-b hover:bg-gray-100 transition-colors`}>
        {/* Customer */}
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          <div className="flex items-center gap-2">
            <User size={16} className="text-blue-600" />
            {item.customer}
          </div>
        </td>

        {/* Total Amount */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          Rs {item.amount ? item.amount.toLocaleString() : '0'}
        </td>

        {/* VAT NO */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          <div className="flex items-center gap-2">
            <Hash size={16} className="text-gray-500" />
            {item.vatNo || item.vatNumber}
          </div>
        </td>

        {/* Quotation NO */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          <div className="flex items-center gap-2">
            <Hash size={16} className="text-gray-500" />
            {item.quotationNo || item.quotationNumber }
          </div>
        </td>

        {/* Status */}
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusColor}`}
          >
            {item.status}
          </span>
        </td>

        {/* Sale Date */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {item.date}
        </td>

        {/* Created At */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {item.createdAt}
        </td>

        {/* Contact Information */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Mail size={14} className="text-gray-500" />
              <strong>Email:</strong> {item.email}
            </div>
            <div className="flex items-center gap-1">
              <Phone size={14} className="text-gray-500" />
              <strong>Phone:</strong> {item.phone}
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-gray-500" />
              <strong>Location:</strong> {item.location}
            </div>   
          </div>
        </td>

        {/* Actions */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
          <div className="flex gap-3">
            <Eye
              size={18}
              className="text-blue-500 hover:text-blue-700 cursor-pointer"
              title="View"
              onClick={handleView}
            />
            <Edit
              size={18}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
              title="Edit"
              onClick={handleEdit}
            />
            <Trash
              size={18}
              className="text-red-500 hover:text-red-700 cursor-pointer"
              title="Delete"
              onClick={handleDelete}
            />
          </div>
        </td>
      </tr>

      {/* Modals */}
      <ViewSaleModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        sale={item}
      />

      <EditSaleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        sale={item}
        onSave={handleSaveEdit}
      />

      <DeleteSaleModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        sale={item}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}