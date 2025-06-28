import { useState, useEffect } from 'react';
import { supabase, uploadProductImage, deleteProductImage } from '../lib/supabase';
import { Product, Category } from '../types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([loadProducts(), loadCategories()]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('productos')
      .select(`
        *,
        categorias (
          id,
          nombre
        )
      `)
      .eq('activo', true)
      .order('nombre');

    if (error) throw error;

    const formattedProducts: Product[] = data.map(item => ({
      id: item.id,
      codigo: item.codigo,
      nombre: item.nombre,
      descripcion: item.descripcion,
      categoria_id: item.categoria_id,
      categoria_nombre: item.categorias?.nombre,
      precio: parseFloat(item.precio),
      stock: item.stock,
      stock_minimo: item.stock_minimo,
      fecha_vencimiento: item.fecha_vencimiento,
      laboratorio: item.laboratorio,
      presentacion: item.presentacion,
      principio_activo: item.principio_activo,
      indicaciones: item.indicaciones,
      contraindicaciones: item.contraindicaciones,
      dosis: item.dosis,
      receta_requerida: item.receta_requerida,
      imagen_url: item.imagen_url,
      activo: item.activo
    }));

    setProducts(formattedProducts);
  };

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('activo', true)
      .order('nombre');

    if (error) throw error;
    setCategories(data);
  };

  const addProduct = async (productData: Omit<Product, 'id'>, imageFile?: File) => {
    try {
      let imagen_url = null;

      // Insertar producto primero
      const { data, error } = await supabase
        .from('productos')
        .insert({
          codigo: productData.codigo,
          nombre: productData.nombre,
          descripcion: productData.descripcion,
          categoria_id: productData.categoria_id,
          precio: productData.precio,
          stock: productData.stock,
          stock_minimo: productData.stock_minimo,
          fecha_vencimiento: productData.fecha_vencimiento,
          laboratorio: productData.laboratorio,
          presentacion: productData.presentacion,
          principio_activo: productData.principio_activo,
          indicaciones: productData.indicaciones,
          contraindicaciones: productData.contraindicaciones,
          dosis: productData.dosis,
          receta_requerida: productData.receta_requerida,
          activo: productData.activo
        })
        .select()
        .single();

      if (error) throw error;

      // Subir imagen si existe
      if (imageFile && data) {
        const { publicUrl } = await uploadProductImage(imageFile, data.id.toString());
        
        // Actualizar producto con URL de imagen
        const { error: updateError } = await supabase
          .from('productos')
          .update({ imagen_url: publicUrl })
          .eq('id', data.id);

        if (updateError) throw updateError;
        imagen_url = publicUrl;
      }

      await loadProducts();
      return { ...data, imagen_url };
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: number, productData: Partial<Product>, imageFile?: File) => {
    try {
      let updateData = { ...productData };

      // Subir nueva imagen si existe
      if (imageFile) {
        const { publicUrl } = await uploadProductImage(imageFile, id.toString());
        updateData.imagen_url = publicUrl;
      }

      const { error } = await supabase
        .from('productos')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      await loadProducts();
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      // Obtener producto para eliminar imagen
      const { data: product } = await supabase
        .from('productos')
        .select('imagen_url')
        .eq('id', id)
        .single();

      // Eliminar imagen si existe
      if (product?.imagen_url) {
        const fileName = product.imagen_url.split('/').pop();
        if (fileName) {
          await deleteProductImage(fileName);
        }
      }

      // Marcar producto como inactivo en lugar de eliminarlo
      const { error } = await supabase
        .from('productos')
        .update({ activo: false })
        .eq('id', id);

      if (error) throw error;

      await loadProducts();
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

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
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    searchProducts,
    getLowStockProducts,
    refreshProducts: loadProducts
  };
};