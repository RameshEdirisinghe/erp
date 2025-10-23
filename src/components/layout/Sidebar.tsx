'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  Home,
  Package,
  Users,
  Truck,
  DollarSign,
  FileText,
  BarChart,
  Settings,
  Menu,
  ChevronRight,
} from 'lucide-react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { href: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { href: '/inventory', label: 'Inventory', icon: <Package size={20} /> },
    // { href: '/customers', label: 'Customers', icon: <Users size={20} /> },
    // { href: '/suppliers', label: 'Suppliers', icon: <Truck size={20} /> },
    { href: '/sales', label: 'Sales', icon: <DollarSign size={20} /> },
     { href: '/invoices', label: 'Invoices', icon: <FileText size={20} /> },
    { href: '/finance', label: 'Finance', icon: <FileText size={20} /> },
    // { href: '/employees', label: 'Employees', icon: <Users size={20} /> },
   
    // { href: '/reports', label: 'Reports', icon: <BarChart size={20} /> },
    // { href: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside
      className={`flex flex-col backdrop-blur-xl bg-white/20 border border-white/30 shadow-lg text-gray-800 p-4 h-screen transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } rounded-r-2xl`}
    >
      {/* Logo and Text Section */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center mb-2">
          <img src="/logo.svg" alt="Logo" className="h-10 w-10" /> {/* Replaced with uploaded image */}
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-gray-900 ml-3">MotoParts ERP</h2>
          )}
        </div>
      </div>

      {/* Collapse / Expand Button */}
      <div
        className={`mb-6 ${
          !isCollapsed
            ? 'flex justify-end'
            : 'flex justify-center'
        }`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg bg-white/30 border border-white/40 hover:bg-white/50 transition"
        >
          <Menu size={20} className="text-gray-700" />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center p-3 rounded-lg transition-colors duration-300 hover:bg-[#3925be] hover:text-white group"
              >
                <span className="mr-3 group-hover:text-white">{item.icon}</span>
                {!isCollapsed && (
                  <span className="text-gray-800 group-hover:text-white font-medium">
                    {item.label}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="mt-auto pt-4 border-t border-white/30">
        <div className="flex items-center p-3 rounded-lg hover:bg-white/20 transition">
          <img
            src="avatars/user.png"
            alt="user"
            className="w-10 h-10 rounded-full mr-3 border border-white/40 shadow-sm"
          />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-gray-900 font-semibold">Username</span>
              <span className="text-gray-600 text-sm">Super Admin</span>
            </div>
          )}
          <span className="ml-auto">
            <ChevronRight size={20} className="text-gray-500" />
          </span>
        </div>
      </div>
    </aside>
  );
}