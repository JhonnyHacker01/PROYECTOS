import React from 'react';
import { ShoppingCart, User, LogOut, Search, Pill } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  cartItemsCount, 
  onCartClick, 
  searchQuery, 
  onSearchChange 
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-lg border-b-4 border-green-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y nombre */}
          <div className="flex items-center space-x-3">
            <div className="bg-green-500 p-2 rounded-lg">
              <Pill className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Farmacia</h1>
              <p className="text-sm text-green-600 font-semibold">SANTA ANA</p>
            </div>
          </div>

          {/* Barra de búsqueda */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar productos, medicamentos..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Acciones del usuario */}
          <div className="flex items-center space-x-4">
            {/* Carrito */}
            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Usuario */}
            <div className="flex items-center space-x-2 text-sm">
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">{user?.nombre}</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {user?.rol}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;