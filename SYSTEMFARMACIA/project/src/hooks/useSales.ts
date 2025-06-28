import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { CartItem } from '../types';
import { Cliente } from './useClients';

export interface VentaCompleta {
  id: number;
  numero_venta: string;
  cliente?: Cliente;
  vendedor_id: string;
  subtotal: number;
  igv: number;
  total: number;
  fecha_venta: string;
  estado: 'pendiente' | 'completada' | 'cancelada';
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia' | 'yape' | 'plin';
  observaciones?: string;
  detalles: Array<{
    producto_id: number;
    producto_nombre: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
  }>;
}

export const useSales = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processSale = async (
    cartItems: CartItem[],
    cliente: Cliente | null,
    metodoPago: string,
    vendedorId: string,
    observaciones?: string
  ): Promise<VentaCompleta> => {
    setIsProcessing(true);
    
    try {
      // Calcular totales
      const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
      const igv = subtotal * 0.18;
      const total = subtotal + igv;

      // Generar número de venta
      const { data: numeroVenta, error: numeroError } = await supabase
        .rpc('generar_numero_venta');

      if (numeroError) throw numeroError;

      // Crear la venta
      const { data: venta, error: ventaError } = await supabase
        .from('ventas')
        .insert({
          numero_venta: numeroVenta,
          cliente_id: cliente?.id || null,
          vendedor_id: vendedorId,
          subtotal: subtotal,
          igv: igv,
          total: total,
          metodo_pago: metodoPago,
          observaciones: observaciones
        })
        .select()
        .single();

      if (ventaError) throw ventaError;

      // Crear detalles de venta
      const detalles = cartItems.map(item => ({
        venta_id: venta.id,
        producto_id: item.producto.id,
        cantidad: item.cantidad,
        precio_unitario: item.producto.precio,
        subtotal: item.subtotal
      }));

      const { error: detallesError } = await supabase
        .from('venta_detalles')
        .insert(detalles);

      if (detallesError) throw detallesError;

      // Crear comprobante
      const { error: comprobanteError } = await supabase
        .from('comprobantes')
        .insert({
          venta_id: venta.id,
          tipo_comprobante: cliente?.documento_tipo === 'RUC' ? 'factura' : 'boleta',
          serie: cliente?.documento_tipo === 'RUC' ? 'F001' : 'B001',
          numero: venta.id.toString().padStart(8, '0')
        });

      if (comprobanteError) throw comprobanteError;

      // Retornar venta completa
      const ventaCompleta: VentaCompleta = {
        id: venta.id,
        numero_venta: venta.numero_venta,
        cliente: cliente || undefined,
        vendedor_id: venta.vendedor_id,
        subtotal: venta.subtotal,
        igv: venta.igv,
        total: venta.total,
        fecha_venta: venta.fecha_venta,
        estado: venta.estado,
        metodo_pago: venta.metodo_pago,
        observaciones: venta.observaciones,
        detalles: cartItems.map(item => ({
          producto_id: item.producto.id,
          producto_nombre: item.producto.nombre,
          cantidad: item.cantidad,
          precio_unitario: item.producto.precio,
          subtotal: item.subtotal
        }))
      };

      return ventaCompleta;

    } catch (error) {
      console.error('Error processing sale:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const getSales = async (limit: number = 50) => {
    try {
      const { data, error } = await supabase
        .from('ventas')
        .select(`
          *,
          clientes (
            nombre,
            apellidos,
            documento_numero
          ),
          usuarios (
            nombre
          )
        `)
        .order('fecha_venta', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting sales:', error);
      throw error;
    }
  };

  const getSaleDetails = async (saleId: number) => {
    try {
      const { data, error } = await supabase
        .from('venta_detalles')
        .select(`
          *,
          productos (
            nombre,
            presentacion
          )
        `)
        .eq('venta_id', saleId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting sale details:', error);
      throw error;
    }
  };

  return {
    processSale,
    getSales,
    getSaleDetails,
    isProcessing
  };
};