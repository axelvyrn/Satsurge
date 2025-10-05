import React from 'react';
import { Zap, LogOut, DivideIcon as LucideIcon } from 'lucide-react';
import logo from '../assets/satsurge.png';

interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: SidebarItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  userType: 'player' | 'creator';
}

export default function Sidebar({ items, activeTab, onTabChange, onLogout, userType }: SidebarProps) {
  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
        <img 
              src={logo} 
              alt="Satsurge Logo" 
              className="h-8 w-8 object-contain"
              />
          <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Satsurge
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1 capitalize">{userType} Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}