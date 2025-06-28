export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'vendedor' | 'cliente';
  telefono?: string;
  direccion?: string;
}

export interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface Product {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoria_id: number;
  categoria_nombre?: string;
  precio: number;
  stock: number;
  stock_minimo: number;
  fecha_vencimiento?: string;
  laboratorio?: string;
  presentacion?: string;
  principio_activo?: string;
  indicaciones?: string;
  contraindicaciones?: string;
  dosis?: string;
  receta_requerida: boolean;
  imagen_url?: string;
  activo: boolean;
}

export interface CartItem {
  producto: Product;
  cantidad: number;
  subtotal: number;
}

export interface Sale {
  id: number;
  numero_venta: string;
  cliente_id?: number;
  vendedor_id: string;
  subtotal: number;
  igv: number;
  total: number;
  fecha_venta: string;
  estado: 'pendiente' | 'completada' | 'cancelada';
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia' | 'yape' | 'plin';
  items: SaleDetail[];
}

export interface SaleDetail {
  producto_id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}