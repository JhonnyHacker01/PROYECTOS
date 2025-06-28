import React from 'react';
import { Clock, User, CreditCard } from 'lucide-react';

interface SaleItem {
  id: number;
  numero_venta: string;
  cliente_nombre: string;
  total: number;
  fecha: string;
  metodo_pago: string;
  items_count: number;
}

interface RecentSalesProps {
  sales: SaleItem[];
  formatPrice: (price: number) => string;
}

const RecentSales: React.FC<RecentSalesProps> = ({ sales, formatPrice }) => {
  // Datos de ejemplo para demostración
  const mockSales: SaleItem[] = [
    {
      id: 1,
      numero_venta: 'V-2024-001',
      cliente_nombre: 'María González',
      total: 45.50,
      fecha: '2024-01-15 14:30',
      metodo_pago: 'efectivo',
      items_count: 3
    },
    {
      id: 2,
      numero_venta: 'V-2024-002',
      cliente_nombre: 'Carlos Ruiz',
      total: 128.90,
      fecha: '2024-01-15 15:15',
      metodo_pago: 'tarjeta',
      items_count: 5
    },
    {
      id: 3,
      numero_venta: 'V-2024-003',
      cliente_nombre: 'Ana López',
      total: 67.25,
      fecha: '2024-01-15 16:45',
      metodo_pago: 'efectivo',
      items_count: 2
    },
    {
      id: 4,
      numero_venta: 'V-2024-004',
      cliente_nombre: 'Luis Mendoza',
      total: 234.75,
      fecha: '2024-01-15 17:20',
      metodo_pago: 'transferencia',
      items_count: 8
    },
    {
      id: 5,
      numero_venta: 'V-2024-005',
      cliente_nombre: 'Rosa Silva',
      total: 89.50,
      fecha: '2024-01-15 18:10',
      metodo_pago: 'tarjeta',
      items_count: 4
    }
  ];

  const displaySales = sales.length > 0 ? sales : mockSales;

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'efectivo':
        return 'bg-green-100 text-green-800';
      case 'tarjeta':
        return 'bg-blue-100 text-blue-800';
      case 'transferencia':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      time: date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      date: date.toLocaleDateString('es-PE')
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Clock className="h-5 w-5 text-green-600 mr-2" />
        Ventas Recientes
      </h3>

      <div className="space-y-4">
        {displaySales.map((sale) => {
          const dateTime = formatDateTime(sale.fecha);
          
          return (
            <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <User className="h-4 w-4 text-green-600" />
                </div>
                
                <div>
                  <p className="font-medium text-gray-900">{sale.cliente_nombre}</p>
                  <p className="text-sm text-gray-600">{sale.numero_venta}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">{dateTime.time}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{sale.items_count} productos</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatPrice(sale.total)}</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(sale.metodo_pago)}`}>
                  <CreditCard className="h-3 w-3 mr-1" />
                  {sale.metodo_pago}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium">
          Ver todas las ventas →
        </button>
      </div>
    </div>
  );
};

export default RecentSales;