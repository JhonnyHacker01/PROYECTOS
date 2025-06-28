import React from 'react';
import { Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  formatPrice: (price: number) => string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, formatPrice }) => {
  const isLowStock = product.stock <= product.stock_minimo;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Header del producto */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">
            {product.nombre}
          </h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {product.codigo}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-sm text-gray-600">{product.laboratorio}</span>
          {product.receta_requerida && (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
              Receta
            </span>
          )}
        </div>

        <p className="text-sm text-gray-500 mb-3">{product.presentacion}</p>
      </div>

      {/* Contenido del producto */}
      <div className="p-4">
        {/* Descripción */}
        {product.descripcion && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.descripcion}
          </p>
        )}

        {/* Principio activo */}
        {product.principio_activo && (
          <div className="mb-3">
            <span className="text-xs font-medium text-gray-700">Principio activo:</span>
            <p className="text-xs text-gray-600">{product.principio_activo}</p>
          </div>
        )}

        {/* Stock status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {isOutOfStock ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : isLowStock ? (
              <AlertCircle className="h-4 w-4 text-orange-500" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            <span className={`text-sm font-medium ${
              isOutOfStock ? 'text-red-600' : isLowStock ? 'text-orange-600' : 'text-green-600'
            }`}>
              {isOutOfStock ? 'Agotado' : isLowStock ? 'Stock bajo' : 'Disponible'}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            Stock: {product.stock}
          </span>
        </div>

        {/* Precio y acción */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-green-600">
              {formatPrice(product.precio)}
            </span>
          </div>
          
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;