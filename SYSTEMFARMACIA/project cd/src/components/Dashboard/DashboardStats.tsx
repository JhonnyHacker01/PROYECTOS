import React from 'react';
import { TrendingUp, Package, ShoppingCart, AlertTriangle, Users, DollarSign } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, subtitle }) => (
  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

interface DashboardStatsProps {
  totalProducts: number;
  lowStockProducts: number;
  todaySales: number;
  totalRevenue: number;
  formatPrice: (price: number) => string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalProducts,
  lowStockProducts,
  todaySales,
  totalRevenue,
  formatPrice
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Productos"
        value={totalProducts}
        icon={<Package className="h-6 w-6 text-white" />}
        color="bg-blue-500"
        subtitle="En inventario"
      />
      
      <StatsCard
        title="Ventas Hoy"
        value={todaySales}
        icon={<ShoppingCart className="h-6 w-6 text-white" />}
        color="bg-green-500"
        subtitle="Transacciones"
      />
      
      <StatsCard
        title="Ingresos del Día"
        value={formatPrice(totalRevenue)}
        icon={<DollarSign className="h-6 w-6 text-white" />}
        color="bg-emerald-500"
        subtitle="Soles peruanos"
      />
      
      <StatsCard
        title="Stock Bajo"
        value={lowStockProducts}
        icon={<AlertTriangle className="h-6 w-6 text-white" />}
        color="bg-orange-500"
        subtitle="Requieren reabastecimiento"
      />
    </div>
  );
};

export default DashboardStats;