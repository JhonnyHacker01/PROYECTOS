import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { CartItem } from '../../types';
import { Cliente } from '../../hooks/useClients';
import { useSales, VentaCompleta } from '../../hooks/useSales';
import ClientForm from '../Sales/ClientForm';
import SaleReceipt from '../Sales/SaleReceipt';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  formatPrice: (price: number) => string;
  total: number;
  vendedorId: string;
}

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  formatPrice,
  total,
  vendedorId
}) => {
  const { processSale, isProcessing } = useSales();
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [metodoPago, setMetodoPago] = useState<string>('efectivo');
  const [observaciones, setObservaciones] = useState('');
  const [completedSale, setCompletedSale] = useState<VentaCompleta | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const receiptRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Comprobante-${completedSale?.numero_venta}`,
  });

  if (!isOpen) return null;

  const igv = total * 0.18;
  const subtotal = total - igv;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    try {
      const sale = await processSale(
        cartItems,
        selectedClient,
        metodoPago,
        vendedorId,
        observaciones
      );

      setCompletedSale(sale);
      setShowReceipt(true);
      onClearCart();
      setSelectedClient(null);
      setObservaciones('');
    } catch (error) {
      console.error('Error processing sale:', error);
      alert('Error al procesar la venta. Intente nuevamente.');
    }
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setCompletedSale(null);
    onClose();
  };

  // Mostrar comprobante
  if (showReceipt && completedSale) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Venta Completada</h2>
            <div className="flex space-x-2">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Printer className="h-4 w-4" />
                <span>Imprimir</span>
              </button>
              <button
                onClick={handleCloseReceipt}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
            <SaleReceipt
              ref={receiptRef}
              sale={completedSale}
              formatPrice={formatPrice}
            />
          </div>

          <div className="p-6 border-t border-gray-200">
            <div className="flex space-x-3">
              <button
                onClick={handlePrint}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Imprimir Comprobante
              </button>
              <button
                onClick={handleCloseReceipt}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Procesar Venta</h2>
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
        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-200px)]">
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
              {/* Lista de productos */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Productos</h3>
                {cartItems.map((item) => (
                  <div key={item.producto.id} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.producto.nombre}</h4>
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

              {/* Información de venta */}
              <div className="w-full lg:w-96 border-l border-gray-200 p-6 space-y-6">
                {/* Cliente */}
                <ClientForm
                  onClientSelect={setSelectedClient}
                  selectedClient={selectedClient}
                />

                {/* Método de pago */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Método de Pago</h3>
                  <select
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="yape">Yape</option>
                    <option value="plin">Plin</option>
                  </select>
                </div>

                {/* Observaciones */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Observaciones</h3>
                  <textarea
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    placeholder="Observaciones adicionales..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Totales */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>IGV (18%):</span>
                      <span>{formatPrice(igv)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                      <span>Total:</span>
                      <span className="text-green-600">{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
                        isProcessing
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {isProcessing ? 'Procesando...' : 'Procesar Venta'}
                    </button>
                    <button
                      onClick={onClearCart}
                      className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Vaciar carrito
                    </button>
                  </div>
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