import { X, AlertTriangle } from 'lucide-react';

interface DeleteSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: any;
  onConfirm: () => void;
}

export default function DeleteSaleModal({ isOpen, onClose, sale, onConfirm }: DeleteSaleModalProps) {
  if (!isOpen || !sale) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Sale</h3>
              <p className="text-sm text-gray-600 mt-1">This action cannot be undone.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600">
            Are you sure you want to delete the sale for <strong>{sale.customer}</strong>?
          </p>
          {/* <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Sale Details:</p>
            <p className="text-sm text-gray-600">Amount: Rs {sale.amount?.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Quotation: {sale.quotationNo || sale.quotationNumber}</p>
            <p className="text-sm text-gray-600">Status: {sale.status}</p>
          </div> */}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Delete Sale
          </button>
        </div>
      </div>
    </div>
  );
}