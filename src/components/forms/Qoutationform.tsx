'use client';

import { useState, useEffect } from 'react';
import { Quotation, QuotationItem, Sale } from '@/models/Sale';

interface QuotationFormProps {
  onSubmit: (quotationData: Omit<Quotation, 'id'>) => Promise<Quotation>;
  editingSale?: Sale | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface ItemFormData {
  itemDescription: string;
  year: string;
  brand: string;
  model: string;
  chassyNo: string;
  unitPrice: string;
  quantity: string;
  warranty: string;
  taxRate: string;
}

export default function QuotationForm({ onSubmit, editingSale, onSuccess, onCancel }: QuotationFormProps) {
  const [formData, setFormData] = useState({
    quotationNo: ``,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    vatNo: '',
  });

  const [items, setItems] = useState<QuotationItem[]>([]);
  const [itemForms, setItemForms] = useState<ItemFormData[]>([
    {
      itemDescription: '',
      brand: '',
      model: '',
      chassyNo: '',
      year: '',
      unitPrice: '',
      quantity: '',
      warranty: '',
      taxRate: 'V18',
    }
  ]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (editingSale) {
      setFormData({
        quotationNo: editingSale.quotationNo || `QTN-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
        customerName: editingSale.customer || '',
        customerEmail: editingSale.email || '',
        customerPhone: editingSale.phone || '',
        customerAddress: editingSale.location || '',
        vatNo: editingSale.vatNo || '',
      });
      setItems(editingSale.items || []);
      setNotes('');
      
      if (editingSale.items && editingSale.items.length > 0) {
        setItemForms(editingSale.items.map(item => ({
          itemDescription: item.description,
          brand: item.brand || '',
          model: item.model || '',
          chassyNo: item.chassyNo || '',
          year: item.year || '',
          unitPrice: item.rate.toString(),
          quantity: item.qty.toString(),
          warranty: item.warranty || '',
          taxRate: item.tax,
        })));
      }
    }
  }, [editingSale]);

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
    setItemForms(prev => {
      const newForms = [...prev];
      newForms[index] = {
        ...newForms[index],
        [field]: value
      };
      return newForms;
    });
  };

  const addItemForm = () => {
    setItemForms(prev => [
      ...prev,
      {
        itemDescription: '',
        year: '',
        brand: '',
        model: '',
        chassyNo: '',
        unitPrice: '',
        quantity: '',
        warranty: '',
        taxRate: 'V18',
      }
    ]);
  };

  const removeItemForm = (index: number) => {
    if (itemForms.length > 1) {
      setItemForms(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addAllItems = () => {
    const newItems: QuotationItem[] = [];
    const errors: string[] = [];

    itemForms.forEach((form, index) => {
      if (!form.itemDescription || !form.unitPrice || !form.quantity) {
        errors.push(`Item ${index + 1}: Please fill Item Description, Unit Price, and Quantity.`);
        return;
      }

      const unitPrice = parseFloat(form.unitPrice) || 0;
      const quantity = parseFloat(form.quantity) || 0;
      
      if (unitPrice <= 0) {
        errors.push(`Item ${index + 1}: Unit Price must be greater than 0.`);
        return;
      }
      
      if (quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0.`);
        return;
      }

      const totalPrice = unitPrice * quantity;

      const newItem: QuotationItem = {
        id: Date.now().toString() + index,
        itemCode: `ITEM-${items.length + index + 1}`,
        description: form.itemDescription,
        qty: quantity,
        rate: unitPrice,
        tax: form.taxRate,
        warranty: form.warranty,
        brand: form.brand,
        model: form.model,
        year: form.year,
        chassyNo: form.chassyNo,
        amount: totalPrice,
      };

      newItems.push(newItem);
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return;
    }

    if (newItems.length === 0) {
      setError('Please add at least one valid item.');
      return;
    }

    setItems(prev => [...prev, ...newItems]);
    
    setItemForms([
      {
        itemDescription: '',
        brand: '',
        model: '',
        chassyNo: '',
        year: '',
        unitPrice: '',
        quantity: '',
        warranty: '',
        taxRate: 'V18',
      }
    ]);
    
    setError(null);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.quotationNo || !formData.customerName || items.length === 0) {
      setError('Please fill Quotation Number, Customer Name, and add at least one item.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const today = new Date();
      const dateStr = today.toLocaleDateString('en-GB').replace(/\//g, '.');
      const validUntilDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      const validUntilStr = validUntilDate.toLocaleDateString('en-GB').replace(/\//g, '.');

      const quotationData: Omit<Quotation, 'id'> = {
        quoteNumber: formData.quotationNo,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        vatNumber: formData.vatNo,
        status: 'Draft',
        date: dateStr,
        validUntil: validUntilStr,
        totalAmount: calculateTotal(),
        items: items,
        notes: notes,
      };

      await onSubmit(quotationData);
      
      setSuccessMessage('Quotation created successfully!');
      
      setFormData({
        quotationNo: `QTN-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: '',
        vatNo: '',
      });
      setItems([]);
      setItemForms([
        {
          itemDescription: '',
          brand: '',
          model: '',
          chassyNo: '',
          year: '',
          unitPrice: '',
          quantity: '',
          warranty: '',
          taxRate: 'V18',
        }
      ]);
      setNotes('');
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
        setSuccessMessage(null);
      }, 1500);
      
    } catch (error) {
      setError('Failed to create quotation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.amount, 0);
  };

  const totalAmount = calculateTotal();

  return (
    <div className="max-w-8xl mx-auto space-y-6 print:hidden">
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg print:hidden">
          <div className="text-green-600 font-medium">{successMessage}</div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden print:bg-transparent print:shadow-none print:border-none">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 print:hidden">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">
              {editingSale ? 'Create Quotation from Sale' : 'Create New Quotation'}
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
        <form onSubmit={handleSubmit} className="p-6 print:hidden">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg print:hidden">
              <div className="text-red-600 font-medium whitespace-pre-line">{error}</div>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6 print:hidden">
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Item Description *
                          </label>
                          <textarea
                            value={itemForm.itemDescription}
                            onChange={(e) => handleItemFormChange(index, 'itemDescription', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition h-20"
                            placeholder="Product or service description"
                          />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Unit Price *
                            </label>
                            <input
                              type="number"
                              value={itemForm.unitPrice}
                              onChange={(e) => handleItemFormChange(index, 'unitPrice', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Quantity *
                            </label>
                            <input
                              type="number"
                              value={itemForm.quantity}
                              onChange={(e) => handleItemFormChange(index, 'quantity', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                              placeholder="1"
                              min="1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tax Rate
                            </label>
                            <select
                              value={itemForm.taxRate}
                              onChange={(e) => handleItemFormChange(index, 'taxRate', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                            >
                              <option value="V0">VAT 0%</option>
                              <option value="V8">VAT 8%</option>
                              <option value="V18">VAT 18%</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Warranty
                            </label>
                            <input
                              type="text"
                              value={itemForm.warranty}
                              onChange={(e) => handleItemFormChange(index, 'warranty', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                              placeholder="1 Year"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Brand
                            </label>
                            <input
                              type="text"
                              value={itemForm.brand}
                              onChange={(e) => handleItemFormChange(index, 'brand', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                              placeholder="brand name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Model
                            </label>
                            <input
                              type="text"
                              value={itemForm.model}
                              onChange={(e) => handleItemFormChange(index, 'model', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                              placeholder="model"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Chassis No
                            </label>
                            <input
                              type="text"
                              value={itemForm.chassyNo}
                              onChange={(e) => handleItemFormChange(index, 'chassyNo', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                              placeholder="Chassis Number"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Year
                            </label>
                            <input
                              type="text"
                              value={itemForm.year}
                              onChange={(e) => handleItemFormChange(index, 'year', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                              placeholder="202X"
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
                  Add All Items to Quotation
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                  Quotation Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quotation Number *</label>
                    <input
                      type="text"
                      name="quotationNo"
                      value={formData.quotationNo}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                      placeholder="QTN-2024-001"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">VAT Number</label>
                    <input
                      type="text"
                      name="vatNo"
                      value={formData.vatNo}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                      placeholder="VAT123456"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                  Customer Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                      placeholder="Customer Name"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                        placeholder="customer@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact No</label>
                      <input
                        type="tel"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                        placeholder="+94 XX XXX XXXX"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      name="customerAddress"
                      value={formData.customerAddress}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                      placeholder="Customer Address"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm print:p-2 print:border-none print:shadow-none print:bg-transparent print:w-full" id="quotation-preview">
                <h3 className="text-base font-semibold text-gray-800 mb-3 border-b pb-1 print:hidden">Quotation Preview</h3>
                <div className="mb-4 print:mb-6">
                  <h2 className="text-xl font-bold text-center text-gray-800 mb-3 print:text-lg print:font-extrabold">QUOTATION</h2>
                  <div className="grid grid-cols-2 gap-3 text-xs print:text-[10px] print:gap-2">
                    <div>
                      <span className="font-semibold">Quotation Number:</span>
                      <p className="text-gray-700">{formData.quotationNo || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Date:</span>
                      <p className="text-gray-700">{new Date().toLocaleDateString('en-GB').replace(/\//g, '.')}</p>
                    </div>
                    <div>
                      <span className="font-semibold">VAT Number:</span>
                      <p className="text-gray-700">{formData.vatNo || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Valid Until:</span>
                      <p className="text-gray-700">{new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB').replace(/\//g, '.')}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-4 print:mb-6">
                  <h3 className="text-base font-semibold text-gray-800 mb-2 border-b pb-1 print:text-sm print:font-bold">
                    Bill To: {formData.customerName || 'Customer Name'}
                  </h3>
                  <div className="space-y-1 text-xs print:text-[10px]">
                    <div>
                      <span className="font-semibold">Email:</span>
                      <span className="text-gray-700 ml-1">{formData.customerEmail || 'No email'}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Contact No:</span>
                      <span className="text-gray-700 ml-1">{formData.customerPhone || 'No phone'}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Address:</span>
                      <span className="text-gray-700 ml-1">{formData.customerAddress || 'No address'}</span>
                    </div>
                  </div>
                </div>
                {items.length > 0 && (
                  <div className="mb-4 print:mb-6">
                    <h4 className="font-semibold text-gray-800 mb-2 text-xs print:text-[10px] print:font-bold">Items:</h4>
                    <table className="w-full border-collapse border border-gray-300 text-xs print:text-[9px]">
                      <thead>
                        <tr className="bg-gray-100 print:bg-white">
                          <th className="border border-gray-300 px-1 py-0.5 font-medium text-left w-[5%] print:w-[5%]">#</th>
                          <th className="border border-gray-300 px-1 py-0.5 font-medium text-left w-[40%] print:w-[40%]">Description</th>
                          <th className="border border-gray-300 px-1 py-0.5 font-medium text-right w-[10%] print:w-[10%]">Qty</th>
                          <th className="border border-gray-300 px-1 py-0.5 font-medium text-right w-[15%] print:w-[15%]">Unit Price</th>
                          <th className="border border-gray-300 px-1 py-0.5 font-medium text-right w-[10%] print:w-[10%]">Tax</th>
                          <th className="border border-gray-300 px-1 py-0.5 font-medium text-right w-[15%] print:w-[15%]">Amount</th>
                          <th className="border border-gray-300 px-1 py-0.5 font-medium text-center w-[5%] print:hidden">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={item.id}>
                            <td className="border border-gray-300 px-1 py-0.5 align-top">{index + 1}</td>
                            <td className="border border-gray-300 px-1 py-0.5 align-top">
                              <div className="font-medium">{item.description}</div>
                              <div className="text-gray-600 text-[10px] print:text-[8px] space-y-0.5">
                                {item.brand && <div>Brand: {item.brand}</div>}
                                {item.model && <div>Model: {item.model}</div>}
                                {item.year && <div>Year: {item.year}</div>}
                                {item.chassyNo && <div>Chassis No: {item.chassyNo}</div>}
                                {item.warranty && <div>Warranty: {item.warranty}</div>}
                              </div>
                            </td>
                            <td className="border border-gray-300 px-1 py-0.5 text-right align-top">{item.qty}</td>
                            <td className="border border-gray-300 px-1 py-0.5 text-right align-top">Rs {item.rate.toLocaleString()}</td>
                            <td className="border border-gray-300 px-1 py-0.5 text-right align-top">{item.tax}</td>
                            <td className="border border-gray-300 px-1 py-0.5 text-right align-top">Rs {item.amount.toLocaleString()}</td>
                            <td className="border border-gray-300 px-1 py-0.5 text-center align-top print:hidden">
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
                <div className="border-t border-gray-300 pt-3 mb-4 print:pt-2 print:mb-6">
                  <div className="flex justify-end">
                    <div className="bg-gray-100 p-2 rounded-lg w-48 print:w-40 print:p-1.5 print:bg-white">
                      <div className="flex justify-between items-center text-xs print:text-[9px]">
                        <span className="font-semibold">Total Amount:</span>
                        <span className="font-bold text-green-700">Rs {totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-xs print:text-[10px] print:font-bold">Notes & Terms</h4>
                  <div className="text-xs text-gray-700 whitespace-pre-wrap print:text-[9px]">{notes || 'No notes added'}</div>
                </div>
              </div>
              <div className="flex space-x-4 print:hidden">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                >
                  {isSubmitting ? 'Creating...' : 'Create Quotation'}
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                >
                  Print Quotation
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}