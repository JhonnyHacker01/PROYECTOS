import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  formatPrice: (price: number) => string;
  total: number;
}

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  formatPrice,
  total
}) => {
  if (!isOpen) return null;

  const igv = total * 0.18;
  const subtotal = total - igv;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Carrito de Compras</h2>
            <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
              {cartItems.length} productos
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col max-h-[calc(90vh-200px)]">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-12">
              <div className="text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Carrito vacío</h3>
                <p className="text-gray-500">Agrega productos para comenzar tu compra</p>
              </div>
            </div>
          ) : (
            <>
              {/* Items list */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.producto.id} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.producto.nombre}</h3>
                      <p className="text-sm text-gray-600">{item.producto.presentacion}</p>
                      <p className="text-sm font-medium text-green-600">
                        {formatPrice(item.producto.precio)} c/u
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onUpdateQuantity(item.producto.id, item.cantidad - 1)}
                        className="p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-white"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.cantidad}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.producto.id, item.cantidad + 1)}
                        className="p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-white"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Subtotal and remove */}
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.subtotal)}
                      </p>
                      <button
                        onClick={() => onRemoveItem(item.producto.id)}
                        className="text-red-500 hover:text-red-700 text-sm mt-1"
                      >
                        <Trash2 className="h-4 w-4 inline" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 p-6">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>IGV (18%):</span>
                    <span>{formatPrice(igv)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-green-600">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={onClearCart}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Vaciar carrito
                  </button>
                  <button
                    onClick={onCheckout}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Procesar venta
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;