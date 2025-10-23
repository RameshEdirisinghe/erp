import { X, User, Phone, Mail, MapPin, DollarSign, Hash, Calendar } from 'lucide-react';

interface ViewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: any;
}

export default function ViewSaleModal({ isOpen, onClose, sale }: ViewSaleModalProps) {
  if (!isOpen || !sale) return null;

  const statusColor = {
    Completed: 'bg-green-500',
    Pending: 'bg-yellow-500',
    Cancelled: 'bg-red-500',
    Draft: 'bg-blue-500',
    Approved: 'bg-emerald-600',
    Rejected: 'bg-rose-500',
  }[sale.status] || 'bg-gray-400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Sale Details
              </h3>
              <p className="text-sm text-gray-500">Customer: {sale.customer}</p>
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
            {/* Sale Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Sale Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer Name:</span>
                    <span className="font-medium">{sale.customer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${statusColor}`}>
                      {sale.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sale Date:</span>
                    <span className="font-medium">{sale.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium text-green-600">
                      Rs {sale.amount?.toLocaleString() || '0'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{sale.email}</span>
                  </div>
                  {sale.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{sale.phone}</span>
                    </div>
                  )}
                  {sale.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{sale.location}</span>
                    </div>
                  )}
                  {sale.vatNo && (
                    <div className="flex items-center space-x-2">
                      <Hash className="w-4 h-4 text-gray-500" />
                      <span>VAT: {sale.vatNo}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Sale Details</h4>
                <div className="space-y-2 text-sm">
                  {sale.quotationNo && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quotation Number:</span>
                      <span className="font-medium">{sale.quotationNo}</span>
                    </div>
                  )}
                  {sale.vatNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">VAT Number:</span>
                      <span className="font-medium">{sale.vatNumber}</span>
                    </div>
                  )}
                  {sale.createdAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created At:</span>
                      <span className="font-medium">{sale.createdAt}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Financial Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium text-green-600">
                      Rs {sale.amount?.toLocaleString() || '0'}
                    </span>
                  </div>
                  {sale.taxAmount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax Amount:</span>
                      <span className="font-medium">
                        Rs {sale.taxAmount?.toLocaleString() || '0'}
                      </span>
                    </div>
                  )}
                  {sale.discount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount:</span>
                      <span className="font-medium text-red-600">
                        Rs {sale.discount?.toLocaleString() || '0'}
                      </span>
                    </div>
                  )}
                  {sale.finalAmount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Final Amount:</span>
                      <span className="font-medium text-green-600">
                        Rs {sale.finalAmount?.toLocaleString() || '0'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            {sale.notes && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Notes & Comments</h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{sale.notes}</p>
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
  );
}