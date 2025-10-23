'use client'

import { useState, useEffect } from 'react'

import { PurchaseOrder } from '@/models/Supplier'

interface PurchaseOrderFormProps {
  onSubmit: (poData: Omit<PurchaseOrder, 'id'>) => Promise<PurchaseOrder>
  editingInvoice?: PurchaseOrder | null
  onSuccess?: () => void // Callback for successful submission
}

export default function PurchaseOrderForm ({
  onSubmit,
  editingInvoice,
  onSuccess
}: PurchaseOrderFormProps) {
  const [formData, setFormData] = useState({
    poNumber: '',
    vatNumber: '',
    companyName: '',
    email: '',
    phoneNumber: '',
    location: '',
    poDescription: '',
    unitPrice: '',
    amount: '',
    warranty: '',
    VAT: 'V18'
   
  })

  const [items, setItems] = useState<
    Array<{
      description: string
      unitPrice: number
      amount: number
      totalPrice: number
      warranty: string
      VAT: string
    }>
  >([])

  const [notes, setNotes] = useState('')
  const [isNotesEditable, setIsNotesEditable] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (editingInvoice) {
      setFormData({
        poNumber: editingInvoice.poNumber || '',
        vatNumber: editingInvoice.vatNumber || '',
        companyName: editingInvoice.companyName || '',
        email: editingInvoice.email || '',
        phoneNumber: editingInvoice.phoneNumber || '',
        location: editingInvoice.location || '',
        poDescription: editingInvoice.items?.[0]?.description || '',
        unitPrice: editingInvoice.items?.[0]?.rate?.toString() || '',
        amount: editingInvoice.items?.[0]?.qty?.toString() || '',
        warranty: editingInvoice.items?.[0]?.warranty || '',
        VAT: editingInvoice.items?.[0]?.tax || 'V18'
      })
      setNotes(editingInvoice.note || '')

      // Set items from editing invoice
      if (editingInvoice.items) {
        setItems(
          editingInvoice.items.map(item => ({
            description: item.description,
            unitPrice: item.rate,
            amount: item.qty,
            totalPrice: item.amount,
            warranty: item.warranty || '',
            VAT: item.tax || 'V18'
          }))
        )
      }
    }
  }, [editingInvoice])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addItem = () => {
    if (!formData.poDescription || !formData.unitPrice || !formData.amount) {
      setError('Please fill PO Description, Unit Price, and Amount.')
      return
    }

    const unitPrice = parseFloat(formData.unitPrice) || 0
    const quantity = parseFloat(formData.amount) || 0
    const totalPrice = unitPrice * quantity

    const newItem = {
      description: formData.poDescription,
      unitPrice: unitPrice,
      amount: quantity,
      totalPrice: totalPrice,
      warranty: formData.warranty,
      VAT: formData.VAT || 'V18'
    }

    setItems(prev => [...prev, newItem])

    // Reset description, keep unitPrice, amount, warranty, and VAT for preview
    setFormData(prev => ({
      ...prev,
      poDescription: ''
    }))

    setError(null)
  }

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.poNumber || !formData.companyName || items.length === 0) {
      setError(
        'Please fill PO Number, Company Name, and add at least one item.'
      )
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const purchaseOrderData: Omit<PurchaseOrder, 'id'> = {
        poNumber: formData.poNumber,
        companyName: formData.companyName,
        vatNumber: formData.vatNumber,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        location: formData.location,
        status: 'Draft',
        date: new Date().toISOString().split('T')[0],
        totalAmount: calculateTotal(),
        note: notes, // Add notes to purchaseOrderData
        items: items.map((item, index) => ({
          id: (Date.now() + index).toString(),
          itemCode: `PO-${index + 1}`,
          description: item.description,
          qty: item.amount,
          rate: item.unitPrice,
          tax: item.VAT,
          warranty: item.warranty,
          amount: item.totalPrice
        }))
      }

      await onSubmit(purchaseOrderData)

      setSuccessMessage('Purchase Order created successfully!')

      // Reset form completely after submission
      setFormData({
        poNumber: '',
        vatNumber: '',
        companyName: '',
        email: '',
        phoneNumber: '',
        location: '',
        poDescription: '',
        unitPrice: '',
        amount: '',
        warranty: '',
        VAT: 'V18'
        
      })
      setItems([])
      setNotes('')

      // Call success callback to refresh table
      if (onSuccess) {
        onSuccess()
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error) {
      setError('Failed to create purchase order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.totalPrice, 0)
  }

  const totalAmount = calculateTotal()

  const handlePenToolClick = () => {
    setIsNotesEditable(true)
  }

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value)
  }

  const handleNotesBlur = () => {
    setIsNotesEditable(false)
  }

  const handleNotesClick = () => {
    setIsNotesEditable(true)
  }

  return (
    <div className='max-w-8xl mx-auto space-y-6'>
      {/* Success Message */}
      {successMessage && (
        <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
          <div className='text-green-600 font-medium'>{successMessage}</div>
        </div>
      )}

      {/* Main Form Card */}
      <div className='bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden'>
        <div className='bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4'>
          <h1 className='text-2xl font-bold text-white'>
            {editingInvoice
              ? 'Edit Purchase Order'
              : 'Create New Purchase Order'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className='p-6'>
          {error && (
            <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
              <div className='text-red-600 font-medium'>{error}</div>
            </div>
          )}

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Left Column - Form Fields */}
            <div className='space-y-6'>
              {/* Purchase Order Header Section */}
              <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                <h3 className='text-lg font-semibold text-gray-800 mb-4 border-b pb-2'>
                  Purchase Order (PO)
                </h3>

                <div className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        PO Number *
                      </label>
                      <input
                        type='text'
                        name='poNumber'
                        value={formData.poNumber}
                        onChange={handleInputChange}
                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                        placeholder='PO-001'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        VAT Number
                      </label>
                      <input
                        type='text'
                        name='vatNumber'
                        value={formData.vatNumber}
                        onChange={handleInputChange}
                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                        placeholder='VAT123456'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Unit Price
                      </label>
                      <input
                        type='number'
                        name='unitPrice'
                        value={formData.unitPrice}
                        onChange={handleInputChange}
                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                        placeholder='0.00'
                        min='0'
                        step='0.01'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Amount
                      </label>
                      <input
                        type='number'
                        name='amount'
                        value={formData.amount}
                        onChange={handleInputChange}
                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                        placeholder='1'
                        min='1'
                      />
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Warranty
                      </label>
                      <input
                        type='text'
                        name='warranty'
                        value={formData.warranty}
                        onChange={handleInputChange}
                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                        placeholder='1 Year'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        VAT
                      </label>
                      <input
                        type='text'
                        name='VAT'
                        value={formData.VAT}
                        onChange={handleInputChange}
                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                        placeholder='V18'
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Information Section */}
              <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                <h3 className='text-lg font-semibold text-gray-800 mb-4 border-b pb-2'>
                  Company Information
                </h3>

                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Description
                    </label>
                    <textarea
                      name='poDescription'
                      value={formData.poDescription}
                      onChange={handleInputChange}
                      className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-20'
                      placeholder='Item or service description'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Company Name *
                    </label>
                    <input
                      type='text'
                      name='companyName'
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                      placeholder='ABC Company Ltd.'
                      required
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Email
                      </label>
                      <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                        placeholder='company@email.com'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Phone Number
                      </label>
                      <input
                        type='tel'
                        name='phoneNumber'
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                        placeholder='+94 XX XXX XXXX'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Location
                    </label>
                    <input
                      type='text'
                      name='location'
                      value={formData.location}
                      onChange={handleInputChange}
                      className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                      placeholder='Colombo, Sri Lanka'
                    />
                  </div>
                </div>
              </div>

              {/* Add Item Button */}
              <button
                type='button'
                onClick={addItem}
                className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200'
              >
                Add Item to PO
              </button>
            </div>

            {/* Right Column - Preview */}
            <div className='space-y-6'>
              <div className='bg-white p-6 rounded-lg border border-gray-300 shadow-sm'>
                <h3 className='text-lg font-semibold text-gray-800 mb-4 border-b pb-2'>
                  Purchase Order Preview
                </h3>

                {/* PO Header */}
                <div className='mb-6'>
                  <h2 className='text-xl font-bold text-center text-gray-800 mb-4'>
                    PURCHASE ORDER (PO)
                  </h2>

                  <div className='grid grid-cols-2 gap-4 mb-4 text-sm'>
                    <div>
                      <span className='font-semibold'>PO Number:</span>
                      <p className='text-gray-700'>
                        {formData.poNumber || 'PO-001'}
                      </p>
                    </div>
                    <div>
                      <span className='font-semibold'>VAT Number:</span>
                      <p className='text-gray-700'>
                        {formData.vatNumber || ''}
                      </p>
                    </div>
                  </div>

                  {/* Current Item Preview */}
                  <div className='border-t border-b border-gray-300 py-2 mb-4'>
                    <div className='grid grid-cols-4 gap-4 text-sm text-center'>
                      <div>
                        <span className='font-semibold block'>Unit Price</span>
                        <span className='text-gray-700'>
                          {formData.unitPrice
                            ? `Rs ${parseFloat(
                                formData.unitPrice
                              ).toLocaleString()}`
                            : 'Rs 0'}
                        </span>
                      </div>
                      <div>
                        <span className='font-semibold block'>Amount</span>
                        <span className='text-gray-700'>
                          {formData.amount || '0'}
                        </span>
                      </div>
                      <div>
                        <span className='font-semibold block'>Warranty</span>
                        <span className='text-gray-700'>
                          {formData.warranty || ''}
                        </span>
                      </div>
                      <div>
                        <span className='font-semibold block'>VAT</span>
                        <span className='text-gray-700'>
                          {formData.VAT || 'V18'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div className='mb-6'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-3 border-b pb-2'>
                    {formData.companyName || 'Company Name'}
                  </h3>

                  <div className='space-y-2 text-sm'>
                    <div>
                      <span className='font-semibold'>Description:</span>
                      <p className='text-gray-700 ml-2'>
                        {formData.poDescription}
                      </p>
                    </div>
                    <div>
                      <span className='font-semibold'>Email:</span>
                      <span className='text-gray-700 ml-2'>
                        {formData.email}
                      </span>
                    </div>
                    <div>
                      <span className='font-semibold'>Phone Number:</span>
                      <span className='text-gray-700 ml-2'>
                        {formData.phoneNumber}
                      </span>
                    </div>
                    <div>
                      <span className='font-semibold'>Location:</span>
                      <span className='text-gray-700 ml-2'>
                        {formData.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                {items.length > 0 && (
                  <div className='mb-6'>
                    <h4 className='font-semibold text-gray-800 mb-3'>PO Items:</h4>
                    <table className='w-full border-collapse border border-gray-300 text-sm'>
                      <thead>
                        <tr className='bg-gray-100'>
                          <th className='border border-gray-300 px-3 py-2 text-left w-12'>
                            No
                          </th>
                          <th className='border border-gray-300 px-3 py-2 text-left'>
                            Description
                          </th>
                          <th className='border border-gray-300 px-3 py-2 text-left'>
                            Unit Price
                          </th>
                          <th className='border border-gray-300 px-3 py-2 text-left'>
                            Amount
                          </th>
                          <th className='border border-gray-300 px-3 py-2 text-left'>
                            Tax
                          </th>
                          <th className='border border-gray-300 px-3 py-2 text-left'>
                            Total Price
                          </th>
                          <th className='border border-gray-300 px-3 py-2 text-left'>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={index}>
                            <td className='border border-gray-300 px-3 py-2 text-center'>
                              {index + 1}
                            </td>
                            <td className='border border-gray-300 px-3 py-2'>
                              <div>
                                <div>{item.description}</div>
                                {item.warranty && (
                                  <div className='text-xs text-gray-600'>
                                    Warranty: {item.warranty}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className='border border-gray-300 px-3 py-2'>
                              Rs {item.unitPrice.toLocaleString()}
                            </td>
                            <td className='border border-gray-300 px-3 py-2'>
                              {item.amount}
                            </td>
                            <td className='border border-gray-300 px-3 py-2 text-left'>
                              {item.VAT}
                            </td>
                            <td className='border border-gray-300 px-3 py-2'>
                              Rs {item.totalPrice.toLocaleString()}
                            </td>
                            <td className='border border-gray-300 px-3 py-2'>
                              <button
                                type='button'
                                onClick={() => removeItem(index)}
                                className='text-red-500 hover:text-red-700 text-xs'
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

                {/* Notes Section with Pen Tool */}
                <div className='mb-6'>
                  <div className='flex items-center justify-between mb-3'>
                    <h4 className='font-semibold text-gray-800'>
                      Notes & Comments
                    </h4>
                    <button
                      type='button'
                      onClick={handlePenToolClick}
                      className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition duration-200 ${
                        isNotesEditable
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
                        />
                      </svg>
                      <span className='text-sm'>
                        {isNotesEditable ? 'Editing...' : 'Add Note'}
                      </span>
                    </button>
                  </div>

                  <div
                    className={`border-2 rounded-lg p-4 min-h-32 transition duration-200 cursor-text ${
                      isNotesEditable
                        ? 'border-blue-400 bg-blue-50 shadow-inner'
                        : 'border-dashed border-gray-300 bg-yellow-50 hover:bg-yellow-100'
                    }`}
                    onClick={handleNotesClick}
                  >
                    {isNotesEditable ? (
                      <textarea
                        value={notes}
                        onChange={handleNotesChange}
                        onBlur={handleNotesBlur}
                        placeholder='Type your notes here...'
                        className='w-full h-full bg-transparent border-none focus:outline-none resize-none text-gray-700 placeholder-gray-400'
                        rows={4}
                        autoFocus
                      />
                    ) : (
                      <div className='text-gray-600'>
                        {notes ? (
                          <div className='whitespace-pre-wrap'>{notes}</div>
                        ) : (
                          <div className='text-gray-400 italic'>
                            Click here or use the pen tool to add notes,
                            comments, or instructions...
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className='flex justify-between items-center mt-2 text-xs text-gray-500'>
                    <span>
                      Click anywhere in the notes area or use the pen tool to
                      edit
                    </span>
                    <span>{notes.length}/500 characters</span>
                  </div>
                </div>

                {/* Total Section */}
                <div className='border-t border-gray-300 pt-4'>
                  <div className='bg-gray-100 p-4 rounded-lg'>
                    <div className='flex justify-between items-center'>
                      <span className='text-lg font-semibold'>Total</span>
                      <span className='text-xl font-bold text-blue-700'>
                        Rs {totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Submit Button */}
              <button
                type='submit'
                disabled={isSubmitting}
                className='w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200'
              >
                {isSubmitting
                  ? 'Creating...'
                  : editingInvoice
                  ? 'Update Purchase Order'
                  : 'Create Purchase Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}