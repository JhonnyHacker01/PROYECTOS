-- Base de datos para Farmacia Santa Ana
-- Crear base de datos
CREATE DATABASE IF NOT EXISTS farmacia_santa_ana;
USE farmacia_santa_ana;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'vendedor', 'cliente') DEFAULT 'cliente',
    telefono VARCHAR(15),
    direccion TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- Tabla de categorías
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE
);

-- Tabla de productos
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria_id INT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    stock_minimo INT DEFAULT 5,
    fecha_vencimiento DATE,
    laboratorio VARCHAR(100),
    presentacion VARCHAR(100),
    principio_activo VARCHAR(200),
    indicaciones TEXT,
    contraindicaciones TEXT,
    dosis TEXT,
    receta_requerida BOOLEAN DEFAULT FALSE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Tabla de ventas
CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_venta VARCHAR(20) UNIQUE NOT NULL,
    cliente_id INT,
    vendedor_id INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    igv DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'completada', 'cancelada') DEFAULT 'completada',
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia') DEFAULT 'efectivo',
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
    FOREIGN KEY (vendedor_id) REFERENCES usuarios(id)
);

-- Tabla de detalles de venta
CREATE TABLE venta_detalles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

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
INSERT INTO productos (codigo, nombre, descripcion, categoria_id, precio, stock, laboratorio, presentacion, principio_activo, receta_requerida) VALUES 
('PAR001', 'Paracetamol 500mg', 'Analgésico y antipirético', 1, 12.50, 100, 'Laboratorios Unidos', 'Caja x 20 tabletas', 'Paracetamol', FALSE),
('IBU001', 'Ibuprofeno 400mg', 'Antiinflamatorio no esteroideo', 1, 18.90, 75, 'Farmacorp', 'Caja x 12 tabletas', 'Ibuprofeno', FALSE),
('AMO001', 'Amoxicilina 500mg', 'Antibiótico de amplio espectro', 2, 25.80, 50, 'Antibióticos SA', 'Caja x 12 cápsulas', 'Amoxicilina', TRUE),
('VIT001', 'Complejo B', 'Vitaminas del complejo B', 3, 32.50, 80, 'Vitaminas Plus', 'Frasco x 60 tabletas', 'Complejo B', FALSE),
('SHA001', 'Shampoo Anticaspa', 'Shampoo medicado', 4, 28.90, 40, 'DermaLab', 'Frasco x 400ml', 'Piritionato de Zinc', FALSE);

-- Insertar usuario administrador por defecto
INSERT INTO usuarios (nombre, email, password, rol, telefono) VALUES 
('Administrador', 'admin@farmaciaantana.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '999999999');
-- Nota: La contraseña hasheada corresponde a "password123"

-- Crear índices para optimización
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_activo ON productos(activo);
CREATE INDEX idx_ventas_fecha ON ventas(fecha_venta);
CREATE INDEX idx_usuarios_email ON usuarios(email);

-- Crear vistas útiles
CREATE VIEW vista_productos_stock_bajo AS
SELECT p.*, c.nombre as categoria_nombre 
FROM productos p 
LEFT JOIN categorias c ON p.categoria_id = c.id 
WHERE p.stock <= p.stock_minimo AND p.activo = TRUE;

CREATE VIEW vista_ventas_resumen AS
SELECT 
    DATE(v.fecha_venta) as fecha,
    COUNT(*) as total_ventas,
    SUM(v.total) as total_ingresos
FROM ventas v 
WHERE v.estado = 'completada'
GROUP BY DATE(v.fecha_venta)
ORDER BY fecha DESC;