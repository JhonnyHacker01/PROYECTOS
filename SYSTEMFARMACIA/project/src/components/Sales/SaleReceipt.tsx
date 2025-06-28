import React, { forwardRef } from 'react';
import { VentaCompleta } from '../../hooks/useSales';

interface SaleReceiptProps {
  sale: VentaCompleta;
  formatPrice: (price: number) => string;
}

const SaleReceipt = forwardRef<HTMLDivElement, SaleReceiptProps>(
  ({ sale, formatPrice }, ref) => {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    return (
      <div ref={ref} className="bg-white p-8 max-w-md mx-auto text-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">FARMACIA SANTA ANA</h1>
          <p className="text-gray-600">S.A.C.</p>
          <p className="text-gray-600">RUC: 20123456789</p>
          <p className="text-gray-600">Av. Principal 123, Lima, Perú</p>
          <p className="text-gray-600">Tel: (01) 234-5678</p>
        </div>

        <div className="border-t border-b border-gray-300 py-2 mb-4">
          <div className="text-center">
            <p className="font-bold">
              {sale.cliente?.documento_tipo === 'RUC' ? 'FACTURA ELECTRÓNICA' : 'BOLETA DE VENTA ELECTRÓNICA'}
            </p>
            <p className="font-bold">
              {sale.cliente?.documento_tipo === 'RUC' ? 'F001' : 'B001'}-{sale.id.toString().padStart(8, '0')}
            </p>
          </div>
        </div>

        {/* Información del cliente */}
        {sale.cliente && (
          <div className="mb-4">
            <p><strong>Cliente:</strong> {sale.cliente.nombre} {sale.cliente.apellidos}</p>
            <p><strong>{sale.cliente.documento_tipo}:</strong> {sale.cliente.documento_numero}</p>
            {sale.cliente.direccion && (
              <p><strong>Dirección:</strong> {sale.cliente.direccion}</p>
            )}
          </div>
        )}

        {/* Información de la venta */}
        <div className="mb-4">
          <p><strong>Fecha:</strong> {formatDate(sale.fecha_venta)}</p>
          <p><strong>Venta N°:</strong> {sale.numero_venta}</p>
          <p><strong>Método de Pago:</strong> {sale.metodo_pago.toUpperCase()}</p>
        </div>

        {/* Detalles de productos */}
        <div className="mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-1">Producto</th>
                <th className="text-center py-1">Cant.</th>
                <th className="text-right py-1">P.Unit</th>
                <th className="text-right py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {sale.detalles.map((detalle, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-1 pr-2">
                    <div className="font-medium">{detalle.producto_nombre}</div>
                  </td>
                  <td className="text-center py-1">{detalle.cantidad}</td>
                  <td className="text-right py-1">{formatPrice(detalle.precio_unitario)}</td>
                  <td className="text-right py-1">{formatPrice(detalle.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totales */}
        <div className="border-t border-gray-300 pt-2 mb-4">
          <div className="flex justify-between mb-1">
            <span>Subtotal:</span>
            <span>{formatPrice(sale.subtotal)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>IGV (18%):</span>
            <span>{formatPrice(sale.igv)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>TOTAL:</span>
            <span>{formatPrice(sale.total)}</span>
          </div>
        </div>

        {/* Observaciones */}
        {sale.observaciones && (
          <div className="mb-4">
            <p><strong>Observaciones:</strong></p>
            <p className="text-gray-600">{sale.observaciones}</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-gray-600 mt-6">
          <p>¡Gracias por su compra!</p>
          <p>Conserve este comprobante</p>
          <p className="mt-2">Sistema de Ventas Farmacia Santa Ana</p>
        </div>
      </div>
    );
  }
);

SaleReceipt.displayName = 'SaleReceipt';

export default SaleReceipt;