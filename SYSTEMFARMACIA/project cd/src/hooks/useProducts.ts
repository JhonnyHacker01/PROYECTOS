import { useState, useEffect } from 'react';
import { Product, Category } from '../types';

// Datos de ejemplo - en producción estos vendrían de la API
const mockCategories: Category[] = [
  { id: 1, nombre: 'Analgésicos', descripcion: 'Medicamentos para el dolor', activo: true },
  { id: 2, nombre: 'Antibióticos', descripcion: 'Medicamentos contra infecciones', activo: true },
  { id: 3, nombre: 'Vitaminas', descripcion: 'Suplementos vitamínicos', activo: true },
  { id: 4, nombre: 'Cuidado Personal', descripcion: 'Productos de higiene y cuidado', activo: true },
  { id: 5, nombre: 'Primeros Auxilios', descripcion: 'Productos para emergencias', activo: true },
];

const mockProducts: Product[] = [
  {
    id: 1,
    codigo: 'PAR001',
    nombre: 'Paracetamol 500mg',
    descripcion: 'Analgésico y antipirético de uso común',
    categoria_id: 1,
    categoria_nombre: 'Analgésicos',
    precio: 12.50,
    stock: 100,
    stock_minimo: 20,
    laboratorio: 'Laboratorios Unidos',
    presentacion: 'Caja x 20 tabletas',
    principio_activo: 'Paracetamol',
    receta_requerida: false,
    activo: true
  },
  {
    id: 2,
    codigo: 'IBU001',
    nombre: 'Ibuprofeno 400mg',
    descripcion: 'Antiinflamatorio no esteroideo',
    categoria_id: 1,
    categoria_nombre: 'Analgésicos',
    precio: 18.90,
    stock: 75,
    stock_minimo: 15,
    laboratorio: 'Farmacorp',
    presentacion: 'Caja x 12 tabletas',
    principio_activo: 'Ibuprofeno',
    receta_requerida: false,
    activo: true
  },
  {
    id: 3,
    codigo: 'AMO001',
    nombre: 'Amoxicilina 500mg',
    descripcion: 'Antibiótico de amplio espectro',
    categoria_id: 2,
    categoria_nombre: 'Antibióticos',
    precio: 25.80,
    stock: 50,
    stock_minimo: 10,
    laboratorio: 'Antibióticos SA',
    presentacion: 'Caja x 12 cápsulas',
    principio_activo: 'Amoxicilina',
    receta_requerida: true,
    activo: true
  },
  {
    id: 4,
    codigo: 'VIT001',
    nombre: 'Complejo B',
    descripcion: 'Vitaminas del complejo B para energía',
    categoria_id: 3,
    categoria_nombre: 'Vitaminas',
    precio: 32.50,
    stock: 80,
    stock_minimo: 25,
    laboratorio: 'Vitaminas Plus',
    presentacion: 'Frasco x 60 tabletas',
    principio_activo: 'Complejo B',
    receta_requerida: false,
    activo: true
  },
  {
    id: 5,
    codigo: 'SHA001',
    nombre: 'Shampoo Anticaspa',
    descripcion: 'Shampoo medicado para tratamiento de caspa',
    categoria_id: 4,
    categoria_nombre: 'Cuidado Personal',
    precio: 28.90,
    stock: 40,
    stock_minimo: 12,
    laboratorio: 'DermaLab',
    presentacion: 'Frasco x 400ml',
    principio_activo: 'Piritionato de Zinc',
    receta_requerida: false,
    activo: true
  },
  {
    id: 6,
    codigo: 'ASP001',
    nombre: 'Aspirina 100mg',
    descripcion: 'Antiagregante plaquetario',
    categoria_id: 1,
    categoria_nombre: 'Analgésicos',
    precio: 15.75,
    stock: 90,
    stock_minimo: 30,
    laboratorio: 'Cardio Med',
    presentacion: 'Caja x 30 tabletas',
    principio_activo: 'Ácido Acetilsalicílico',
    receta_requerida: false,
    activo: true
  },
  {
    id: 7,
    codigo: 'ALG001',
    nombre: 'Alcohol en Gel',
    descripcion: 'Desinfectante para manos 70% alcohol',
    categoria_id: 5,
    categoria_nombre: 'Primeros Auxilios',
    precio: 8.50,
    stock: 150,
    stock_minimo: 50,
    laboratorio: 'Antisépticos Pro',
    presentacion: 'Frasco x 250ml',
    principio_activo: 'Alcohol Etílico',
    receta_requerida: false,
    activo: true
  },
  {
    id: 8,
    codigo: 'VIT002',
    nombre: 'Vitamina C 1000mg',
    descripción: 'Suplemento de vitamina C para defensas',
    categoria_id: 3,
    categoria_nombre: 'Vitaminas',
    precio: 22.90,
    stock: 65,
    stock_minimo: 20,
    laboratorio: 'Vitaminas Plus',
    presentacion: 'Frasco x 30 tabletas',
    principio_activo: 'Ácido Ascórbico',
    receta_requerida: false,
    activo: true
  }
];

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos - en producción conectar con API
    setTimeout(() => {
      setProducts(mockProducts);
      setCategories(mockCategories);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getProductsByCategory = (categoryId: number) => {
    return products.filter(product => product.categoria_id === categoryId && product.activo);
  };

  const searchProducts = (query: string) => {
    if (!query.trim()) return products;
    
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product => 
      product.nombre.toLowerCase().includes(lowercaseQuery) ||
      product.codigo.toLowerCase().includes(lowercaseQuery) ||
      product.principio_activo?.toLowerCase().includes(lowercaseQuery) ||
      product.laboratorio?.toLowerCase().includes(lowercaseQuery)
    );
  };

  const getLowStockProducts = () => {
    return products.filter(product => product.stock <= product.stock_minimo);
  };

  return {
    products,
    categories,
    isLoading,
    getProductsByCategory,
    searchProducts,
    getLowStockProducts
  };
};