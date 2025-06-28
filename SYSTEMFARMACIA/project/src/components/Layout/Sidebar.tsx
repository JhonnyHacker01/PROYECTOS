import React from 'react';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { User } from '../../types';

interface SidebarProps {
  user: User;
  activeSection: string;
  onSectionChange: (section: string) => void;
  lowStockCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  activeSection, 
  onSectionChange,
  lowStockCount 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, adminOnly: false },
    { id: 'productos', label: 'Productos', icon: Package, adminOnly: false },
    { id: 'ventas', label: 'Ventas', icon: ShoppingCart, adminOnly: false },
    { id: 'clientes', label: 'Clientes', icon: Users, adminOnly: true },
    { id: 'reportes', label: 'Reportes', icon: BarChart3, adminOnly: true },
    { id: 'inventario', label: 'Inventario', icon: AlertTriangle, adminOnly: true, badge: lowStockCount },
    { id: 'configuracion', label: 'Configuración', icon: Settings, adminOnly: true },
  ];

  const filteredItems = user.rol === 'admin' 
    ? menuItems 
    : menuItems.filter(item => !item.adminOnly);

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav className="space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer del sidebar */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-400">
              {new Date().toLocaleDateString('es-PE')}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;