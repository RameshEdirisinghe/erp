'use client';

import { useState, useEffect } from 'react';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import CustomerTable from '@/components/tables/CustomerTable';
import DataTable from '@/components/tables/datatTable';
import FinanceManagementTable from '@/components/tables/FinanceManagementTable';
import InventoryTable from '@/components/tables/InventoryTable';
import SalesManagementTable from '@/components/tables/SalesManagementTable';
import SupplierManagementTable from '@/components/tables/SupplierManagementTable';
import { getCustomers } from '@/services/customerService';
import { getEmployees } from '@/services/employeeService';
import { getFinances } from '@/services/financeService';
import { getProducts } from '@/services/productService';
import { getSales } from '@/services/saleService';
import { getSuppliers } from '@/services/supplierService';
import { invoicesService } from '@/services/invociesService';

export default function Reports() {
  const [selectedMonth, setSelectedMonth] = useState('September');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [activeView, setActiveView] = useState('overview');
  const [data, setData] = useState({
    customers: [],
    employees: [],
    finances: [],
    products: [],
    sales: [],
    suppliers: [],
    invoices: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        customers,
        employees,
        finances,
        products,
        sales,
        suppliers
      ] = await Promise.all([
        getCustomers(),
        getEmployees(),
        getFinances(),
        getProducts(),
        getSales(),
        getSuppliers()
      ]);

      const invoices = invoicesService.getInvoices();

      setData({
        customers,
        employees,
        finances,
        products,
        sales,
        suppliers,
        invoices
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from real data
  const stats = [
    { 
      title: 'Suppliers', 
      value: data.suppliers.length.toString(), 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Invoices', 
      value: data.invoices.length.toString(), 
      color: 'bg-green-500' 
    },
    { 
      title: 'Customers', 
      value: data.customers.length.toString(), 
      color: 'bg-purple-500' 
    },
    { 
      title: 'Inventories', 
      value: data.products.length.toString(), 
      color: 'bg-orange-500' 
    },
    { 
      title: 'Total Sales', 
      value: `LKR ${data.sales.reduce((total, sale) => total + sale.amount, 0).toLocaleString()}`,
      color: 'bg-red-500' 
    },
  ];

  // Calculate additional metrics
  const activeCustomers = data.customers.filter(c => c.status === 'Active').length;
  const totalRevenue = data.finances
    .filter(f => f.status === 'Completed')
    .reduce((total, finance) => total + finance.amount, 0);
  
  const lowStockProducts = data.products.filter(p => 
    p.status === 'Low stock' || p.status === 'Out of stock'
  ).length;

  const pendingSales = data.sales.filter(s => s.status === 'Pending').length;

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading analytics data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-3 px-3">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive overview of your business performance</p>
      </div>

      {/* Date Filters */}
      <div className="flex gap-4 mb-6">
        <select 
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
        <select 
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {['2023', '2024', '2025'].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center`}>
                <span className="text-white font-bold text-sm">
                  {stat.title === 'Total Sales' ? '💰' : stat.value}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-sm text-gray-600">Active Customers</div>
          <div className="text-2xl font-bold text-green-600">{activeCustomers}</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-sm text-gray-600">Total Revenue</div>
          <div className="text-2xl font-bold text-blue-600">LKR {totalRevenue.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-sm text-gray-600">Low Stock Items</div>
          <div className="text-2xl font-bold text-orange-600">{lowStockProducts}</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-sm text-gray-600">Pending Sales</div>
          <div className="text-2xl font-bold text-yellow-600">{pendingSales}</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {['overview', 'sales', 'customers', 'inventory', 'finance', 'employees', 'suppliers', 'invoices'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveView(tab)}
            className={`px-4 py-2 font-medium capitalize ${
              activeView === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Daily Sales Chart */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Daily Sales - {selectedMonth} {selectedYear}
          </h3>
          <p className="text-sm text-gray-600 mb-4">Color-coded by weeks</p>
          <div className="h-64">
            <LineChart data={data.sales} />
          </div>
          <div className="mt-4 flex justify-center">
            <div className="flex gap-8 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Week 1</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Week 2</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span>Week 3</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span>Week 4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Sales Chart */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Monthly Sales - {selectedYear}
          </h3>
          <p className="text-sm text-gray-600 mb-4">Revenue distribution by category</p>
          <div className="h-64">
            <PieChart data={data.finances} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Total Annual Revenue: <strong>LKR {totalRevenue.toLocaleString()}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Data Tables Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Data</h3>
        
        {activeView === 'overview' && (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Recent Sales</h4>
              <SalesManagementTable data={data.sales.slice(0, 5)} />
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Top Customers</h4>
              <CustomerTable data={data.customers.slice(0, 5)} />
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Inventory Status</h4>
              <InventoryTable data={data.products.slice(0, 5)} />
            </div>
          </div>
        )}

        {activeView === 'customers' && <CustomerTable data={data.customers} />}
        {activeView === 'inventory' && <InventoryTable data={data.products} />}
        {activeView === 'finance' && <FinanceManagementTable data={data.finances} />}
        {activeView === 'employees' && <DataTable data={data.employees} />}
        {activeView === 'sales' && <SalesManagementTable data={data.sales} />}
        {activeView === 'suppliers' && <SupplierManagementTable data={data.suppliers} />}
        {activeView === 'invoices' && <DataTable data={data.invoices} />}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <button 
          onClick={loadData}
          className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Refresh Data
        </button>
        <button className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition">
          Export Data
        </button>
        <button className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition">
          Print Summary
        </button>
        <button className="bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition">
          Schedule Report
        </button>
      </div>
    </div>
  );
}