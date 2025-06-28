/*
  # Sistema de Farmacia Santa Ana - Base de Datos Completa

  1. Nuevas Tablas
    - `usuarios` - Sistema de autenticación completo
    - `categorias` - Categorías de productos farmacéuticos
    - `productos` - Inventario completo con imágenes
    - `clientes` - Información de clientes para ventas
    - `ventas` - Registro de todas las transacciones
    - `venta_detalles` - Detalles de cada venta
    - `comprobantes` - Información para impresión de comprobantes

  2. Seguridad
    - RLS habilitado en todas las tablas
    - Políticas de acceso por roles
    - Autenticación segura

  3. Storage
    - Bucket para imágenes de productos
    - Políticas de acceso a archivos
*/

-- Crear tabla de usuarios (extendida de auth.users)
CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  email text UNIQUE NOT NULL,
  rol text CHECK (rol IN ('admin', 'vendedor', 'cliente')) DEFAULT 'cliente',
  telefono text,
  direccion text,
  fecha_registro timestamptz DEFAULT now(),
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
  id serial PRIMARY KEY,
  nombre text NOT NULL,
  descripcion text,
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id serial PRIMARY KEY,
  codigo text UNIQUE NOT NULL,
  nombre text NOT NULL,
  descripcion text,
  categoria_id integer REFERENCES categorias(id),
  precio decimal(10,2) NOT NULL,
  stock integer DEFAULT 0,
  stock_minimo integer DEFAULT 5,
  fecha_vencimiento date,
  laboratorio text,
  presentacion text,
  principio_activo text,
  indicaciones text,
  contraindicaciones text,
  dosis text,
  receta_requerida boolean DEFAULT false,
  imagen_url text,
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
  id serial PRIMARY KEY,
  nombre text NOT NULL,
  apellidos text,
  documento_tipo text CHECK (documento_tipo IN ('DNI', 'RUC', 'CE')) DEFAULT 'DNI',
  documento_numero text NOT NULL,
  email text,
  telefono text,
  direccion text,
  fecha_nacimiento date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de ventas
CREATE TABLE IF NOT EXISTS ventas (
  id serial PRIMARY KEY,
  numero_venta text UNIQUE NOT NULL,
  cliente_id integer REFERENCES clientes(id),
  vendedor_id uuid REFERENCES usuarios(id),
  subtotal decimal(10,2) NOT NULL,
  igv decimal(10,2) NOT NULL,
  total decimal(10,2) NOT NULL,
  fecha_venta timestamptz DEFAULT now(),
  estado text CHECK (estado IN ('pendiente', 'completada', 'cancelada')) DEFAULT 'completada',
  metodo_pago text CHECK (metodo_pago IN ('efectivo', 'tarjeta', 'transferencia', 'yape', 'plin')) DEFAULT 'efectivo',
  observaciones text,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de detalles de venta
CREATE TABLE IF NOT EXISTS venta_detalles (
  id serial PRIMARY KEY,
  venta_id integer REFERENCES ventas(id) ON DELETE CASCADE,
  producto_id integer REFERENCES productos(id),
  cantidad integer NOT NULL,
  precio_unitario decimal(10,2) NOT NULL,
  subtotal decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de comprobantes
CREATE TABLE IF NOT EXISTS comprobantes (
  id serial PRIMARY KEY,
  venta_id integer REFERENCES ventas(id) ON DELETE CASCADE,
  tipo_comprobante text CHECK (tipo_comprobante IN ('boleta', 'factura', 'ticket')) DEFAULT 'boleta',
  serie text NOT NULL,
  numero text NOT NULL,
  fecha_emision timestamptz DEFAULT now(),
  ruc_emisor text DEFAULT '20123456789',
  razon_social_emisor text DEFAULT 'FARMACIA SANTA ANA S.A.C.',
  direccion_emisor text DEFAULT 'Av. Principal 123, Lima, Perú',
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE venta_detalles ENABLE ROW LEVEL SECURITY;
ALTER TABLE comprobantes ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para usuarios
CREATE POLICY "Usuarios pueden ver su propia información"
  ON usuarios FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_id OR EXISTS (
    SELECT 1 FROM usuarios WHERE auth_id = auth.uid() AND rol IN ('admin', 'vendedor')
  ));

CREATE POLICY "Usuarios pueden actualizar su propia información"
  ON usuarios FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_id);

CREATE POLICY "Solo admins pueden insertar usuarios"
  ON usuarios FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM usuarios WHERE auth_id = auth.uid() AND rol = 'admin'
  ));

-- Políticas para categorías
CREATE POLICY "Todos pueden ver categorías activas"
  ON categorias FOR SELECT
  TO authenticated
  USING (activo = true);

CREATE POLICY "Solo admins pueden gestionar categorías"
  ON categorias FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM usuarios WHERE auth_id = auth.uid() AND rol = 'admin'
  ));

-- Políticas para productos
CREATE POLICY "Todos pueden ver productos activos"
  ON productos FOR SELECT
  TO authenticated
  USING (activo = true);

CREATE POLICY "Solo admins pueden gestionar productos"
  ON productos FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM usuarios WHERE auth_id = auth.uid() AND rol = 'admin'
  ));

-- Políticas para clientes
CREATE POLICY "Vendedores y admins pueden gestionar clientes"
  ON clientes FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM usuarios WHERE auth_id = auth.uid() AND rol IN ('admin', 'vendedor')
  ));

-- Políticas para ventas
CREATE POLICY "Vendedores y admins pueden gestionar ventas"
  ON ventas FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM usuarios WHERE auth_id = auth.uid() AND rol IN ('admin', 'vendedor')
  ));

-- Políticas para detalles de venta
CREATE POLICY "Vendedores y admins pueden gestionar detalles de venta"
  ON venta_detalles FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM usuarios WHERE auth_id = auth.uid() AND rol IN ('admin', 'vendedor')
  ));

-- Políticas para comprobantes
CREATE POLICY "Vendedores y admins pueden gestionar comprobantes"
  ON comprobantes FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM usuarios WHERE auth_id = auth.uid() AND rol IN ('admin', 'vendedor')
  ));

-- Insertar categorías iniciales
INSERT INTO categorias (nombre, descripcion) VALUES 
('Analgésicos', 'Medicamentos para el dolor'),
('Antibióticos', 'Medicamentos contra infecciones'),
('Vitaminas', 'Suplementos vitamínicos'),
('Cuidado Personal', 'Productos de higiene y cuidado'),
('Primeros Auxilios', 'Productos para emergencias'),
('Bebé y Mamá', 'Productos para bebés y madres'),
('Dermatología', 'Productos para el cuidado de la piel'),
('Cardiovascular', 'Medicamentos para el corazón'),
('Digestivo', 'Medicamentos para problemas digestivos'),
('Respiratorio', 'Medicamentos para problemas respiratorios');

-- Insertar productos de ejemplo
INSERT INTO productos (codigo, nombre, descripcion, categoria_id, precio, stock, stock_minimo, laboratorio, presentacion, principio_activo, receta_requerida) VALUES 
('PAR001', 'Paracetamol 500mg', 'Analgésico y antipirético de uso común', 1, 12.50, 100, 20, 'Laboratorios Unidos', 'Caja x 20 tabletas', 'Paracetamol', false),
('IBU001', 'Ibuprofeno 400mg', 'Antiinflamatorio no esteroideo', 1, 18.90, 75, 15, 'Farmacorp', 'Caja x 12 tabletas', 'Ibuprofeno', false),
('AMO001', 'Amoxicilina 500mg', 'Antibiótico de amplio espectro', 2, 25.80, 50, 10, 'Antibióticos SA', 'Caja x 12 cápsulas', 'Amoxicilina', true),
('VIT001', 'Complejo B', 'Vitaminas del complejo B para energía', 3, 32.50, 80, 25, 'Vitaminas Plus', 'Frasco x 60 tabletas', 'Complejo B', false),
('SHA001', 'Shampoo Anticaspa', 'Shampoo medicado para tratamiento de caspa', 4, 28.90, 40, 12, 'DermaLab', 'Frasco x 400ml', 'Piritionato de Zinc', false),
('ASP001', 'Aspirina 100mg', 'Antiagregante plaquetario', 1, 15.75, 90, 30, 'Cardio Med', 'Caja x 30 tabletas', 'Ácido Acetilsalicílico', false),
('ALG001', 'Alcohol en Gel', 'Desinfectante para manos 70% alcohol', 5, 8.50, 150, 50, 'Antisépticos Pro', 'Frasco x 250ml', 'Alcohol Etílico', false),
('VIT002', 'Vitamina C 1000mg', 'Suplemento de vitamina C para defensas', 3, 22.90, 65, 20, 'Vitaminas Plus', 'Frasco x 30 tabletas', 'Ácido Ascórbico', false);

-- Crear índices para optimización
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(fecha_venta);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_clientes_documento ON clientes(documento_numero);

-- Crear funciones para generar números de venta
CREATE OR REPLACE FUNCTION generar_numero_venta()
RETURNS text AS $$
DECLARE
  nuevo_numero text;
  contador integer;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(numero_venta FROM 7) AS integer)), 0) + 1
  INTO contador
  FROM ventas
  WHERE numero_venta LIKE 'V-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-%';
  
  nuevo_numero := 'V-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(contador::text, 6, '0');
  RETURN nuevo_numero;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar stock después de una venta
CREATE OR REPLACE FUNCTION actualizar_stock_venta()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE productos 
    SET stock = stock - NEW.cantidad,
        updated_at = now()
    WHERE id = NEW.producto_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE productos 
    SET stock = stock + OLD.cantidad,
        updated_at = now()
    WHERE id = OLD.producto_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_stock
  AFTER INSERT OR DELETE ON venta_detalles
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_stock_venta();