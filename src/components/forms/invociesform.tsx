'use client';

import { useState, useEffect } from 'react';
import { Invoice, InvoiceItem } from '@/models/Invoice';

interface InvoicesFormProps {
  onAddItem: (item: InvoiceItem) => void;
  onSubmit: (invoice: Omit<Invoice, 'id'> | Invoice, isEdit: boolean) => void;
  editingInvoice?: Invoice | null;
  onCancel?: () => void;
}

interface ItemFormData {
  itemCode: string;
  description: string;
  qty: string;
  rate: string;
  tax: string;
  warranty: string;
}

export default function InvoicesForm({ onAddItem, onSubmit, editingInvoice, onCancel }: InvoicesFormProps) {
  const [formData, setFormData] = useState<Omit<Invoice, 'id' | 'items'>>({
    customerName: '',
    address: '',
    invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
    date: new Date().toISOString().split('T')[0],
    taxPercent: '',
    terms: '30 days credit only',
    vatNumber: '',
    customerNo: '',
    customerPONo: '',
    type: 'normal',
    salesPerson: '',
  });

  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [itemForms, setItemForms] = useState<ItemFormData[]>([
    {
      itemCode: '',
      description: '',
      qty: '1',
      rate: '',
      tax: 'V18',
      warranty: '',
    },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (editingInvoice) {
      setFormData({
        customerName: editingInvoice.customerName,
        address: editingInvoice.address,
        invoiceNumber: editingInvoice.invoiceNumber,
        date: editingInvoice.date,
        taxPercent: editingInvoice.taxPercent,
        terms: editingInvoice.terms,
        vatNumber: editingInvoice.vatNumber,
        customerNo: editingInvoice.customerNo,
        customerPONo: editingInvoice.customerPONo,
        type: editingInvoice.type,
        salesPerson: editingInvoice.salesPerson || '',
      });
      setItems(editingInvoice.items || []);
      if (editingInvoice.items && editingInvoice.items.length > 0) {
        setItemForms(
          editingInvoice.items.map((item) => ({
            itemCode: item.itemCode,
            description: item.description,
            qty: item.qty.toString(),
            rate: item.rate.toString(),
            tax: item.tax,
            warranty: item.warranty || '',
          }))
        );
      }
    }
  }, [editingInvoice]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemFormChange = (index: number, field: keyof ItemFormData, value: string) => {
    setItemForms((prev) => {
      const newForms = [...prev];
      newForms[index] = {
        ...newForms[index],
        [field]: value,
      };
      return newForms;
    });
  };

  const addItemForm = () => {
    setItemForms((prev) => [
      ...prev,
      {
        itemCode: '',
        description: '',
        qty: '1',
        rate: '',
        tax: 'V18',
        warranty: '',
      },
    ]);
  };

  const removeItemForm = (index: number) => {
    if (itemForms.length > 1) {
      setItemForms((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const addAllItems = () => {
    const newItems: InvoiceItem[] = [];
    const errors: string[] = [];

    itemForms.forEach((form, index) => {
      if (!form.itemCode || !form.description || !form.rate || !form.qty) {
        errors.push(`Item ${index + 1}: Please fill Item Code, Description, Rate, and Quantity.`);
        return;
      }

      const qty = parseFloat(form.qty) || 0;
      const rate = parseFloat(form.rate) || 0;

      if (qty <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0.`);
        return;
      }

      if (rate <= 0) {
        errors.push(`Item ${index + 1}: Rate must be greater than 0.`);
        return;
      }

      const amount = qty * rate;

      const newItem: InvoiceItem = {
        id: Date.now().toString() + index,
        itemCode: form.itemCode,
        description: form.description,
        qty,
        rate,
        tax: form.tax,
        warranty: form.warranty,
        amount,
        customerName: formData.customerName,
        address: formData.address,
        customerNo: formData.customerNo,
        salesPerson: formData.salesPerson,
        date: formData.date,
        customerPONo: formData.customerPONo,
        invoiceNumber: formData.invoiceNumber,
        taxPercent: formData.taxPercent,
        terms: formData.terms,
        vatNumber: formData.vatNumber,
        type: formData.type,
      };

      newItems.push(newItem);
      onAddItem(newItem);
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return;
    }

    if (newItems.length === 0) {
      setError('Please add at least one valid item.');
      return;
    }

    setItems((prev) => [...prev, ...newItems]);
    setItemForms([
      {
        itemCode: '',
        description: '',
        qty: '1',
        rate: '',
        tax: 'V18',
        warranty: '',
      },
    ]);
    setError(null);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, type: e.target.value as Invoice['type'] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.address || !formData.invoiceNumber || items.length === 0) {
      setError('Please fill Customer Name, Address, Invoice Number, and add at least one item.');
      return;
    }

    const invoiceData: Omit<Invoice, 'id'> = {
      ...formData,
      items,
    };

    onSubmit(invoiceData, !!editingInvoice);
    setSuccessMessage('Invoice created successfully!');
    setTimeout(() => {
      setSuccessMessage(null);
    }, 1500);
    setError(null);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.amount, 0);
  };

  const totalAmount = calculateTotal();

  return (
    <div className="max-w-8xl mx-auto space-y-6">
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-green-600 font-medium">{successMessage}</div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">
              {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
            </h1>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="text-white hover:text-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-600 font-medium whitespace-pre-line">{error}</div>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Invoice Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number *</label>
                    <input
                      type="text"
                      name="invoiceNumber"
                      value={formData.invoiceNumber}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="INV-2025-001"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Percent</label>
                    <input
                      type="number"
                      name="taxPercent"
                      value={formData.taxPercent}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="18"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Customer Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Customer Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-24"
                      placeholder="Customer Address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sales Person</label>
                    <input
                      type="text"
                      name="salesPerson"
                      value={formData.salesPerson}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Sales Person Name"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    Item Details ({itemForms.length} items)
                  </h3>
                  <button
                    type="button"
                    onClick={addItemForm}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm"
                  >
                    Add Another Item
                  </button>
                </div>
                <div className="space-y-6">
                  {itemForms.map((itemForm, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-700">Item {index + 1}</h4>
                        {itemForms.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItemForm(index)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Item Code *</label>
                          <input
                            type="text"
                            value={itemForm.itemCode}
                            onChange={(e) => handleItemFormChange(index, 'itemCode', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="PART-001"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                          <textarea
                            value={itemForm.description}
                            onChange={(e) => handleItemFormChange(index, 'description', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-20"
                            placeholder="Vehicle part description"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rate (LKR) *</label>
                            <input
                              type="number"
                              value={itemForm.rate}
                              onChange={(e) => handleItemFormChange(index, 'rate', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                            <input
                              type="number"
                              value={itemForm.qty}
                              onChange={(e) => handleItemFormChange(index, 'qty', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                              placeholder="1"
                              min="1"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate</label>
                            <select
                              value={itemForm.tax}
                              onChange={(e) => handleItemFormChange(index, 'tax', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            >
                              <option value="V0">VAT 0%</option>
                              <option value="V8">VAT 8%</option>
                              <option value="V18">VAT 18%</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Warranty</label>
                            <input
                              type="text"
                              value={itemForm.warranty}
                              onChange={(e) => handleItemFormChange(index, 'warranty', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                              placeholder="1 Year"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addAllItems}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                >
                  Add All Items to Invoice
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Additional Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Terms</label>
                    <input
                      type="text"
                      name="terms"
                      value={formData.terms}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="30 days credit only"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">VAT Number</label>
                    <input
                      type="text"
                      name="vatNumber"
                      value={formData.vatNumber}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="VAT123456"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer No</label>
                    <input
                      type="text"
                      name="customerNo"
                      value={formData.customerNo}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="CUST-001"
                    />
                  </div>
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer PO No</label>
                    <input
                      type="text"
                      name="customerPONo"
                      value={formData.customerPONo}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="PO-001"
                    />
                  </div> */}
                </div>
              </div>

              {/* <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Invoice Type</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['normal', 'tax', 'quotation', 'purchaseOrder'].map((type) => (
                    <label key={type} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-white cursor-pointer transition">
                      <input
                        type="radio"
                        name="type"
                        value={type}
                        checked={formData.type === type}
                        onChange={handleTypeChange}
                        className="rounded-full text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-800 font-medium">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div> */}
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Invoice Preview</h3>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-center text-gray-800 mb-4">INVOICE</h2>
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="font-semibold">Invoice Number:</span>
                      <p className="text-gray-700">{formData.invoiceNumber}</p>
                    </div>
                    <div>
                      <span className="font-semibold">VAT Number:</span>
                      <p className="text-gray-700">{formData.vatNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Date:</span>
                      <p className="text-gray-700">{formData.date}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Customer No:</span>
                      <p className="text-gray-700">{formData.customerNo || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                    {formData.customerName || 'Customer Name'}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold">Address:</span>
                      <span className="text-gray-700 ml-2">{formData.address || 'No address'}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Sales Person:</span>
                      <span className="text-gray-700 ml-2">{formData.salesPerson || 'No sales person'}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Customer PO No:</span>
                      <span className="text-gray-700 ml-2">{formData.customerPONo || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                {items.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Invoice Items:</h4>
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-3 py-2 text-left">Item Code</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Description</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Unit Price</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Qty</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Tax</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Total</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id}>
                            <td className="border border-gray-300 px-3 py-2">{item.itemCode}</td>
                            <td className="border border-gray-300 px-3 py-2">
                              <div>
                                <div>{item.description}</div>
                                {item.warranty && (
                                  <div className="text-xs text-gray-600">Warranty: {item.warranty}</div>
                                )}
                              </div>
                            </td>
                            <td className="border border-gray-300 px-3 py-2">Rs {item.rate.toLocaleString()}</td>
                            <td className="border border-gray-300 px-3 py-2">{item.qty}</td>
                            <td className="border border-gray-300 px-3 py-2">{item.tax}</td>
                            <td className="border border-gray-300 px-3 py-2">Rs {item.amount.toLocaleString()}</td>
                            <td className="border border-gray-300 px-3 py-2">
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700 text-xs font-medium"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Amount</span>
                      <span className="text-xl font-bold text-blue-700">
                        Rs {totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Terms</h4>
                  <textarea
                    value={formData.terms}
                    onChange={handleInputChange}
                    name="terms"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-32"
                    placeholder="Add terms and conditions..."
                    rows={4}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}