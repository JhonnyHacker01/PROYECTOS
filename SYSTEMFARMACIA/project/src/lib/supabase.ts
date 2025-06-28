import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket para imágenes de productos
export const STORAGE_BUCKET = 'productos-imagenes';

// Función para subir imagen
export const uploadProductImage = async (file: File, productId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${productId}-${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file);

  if (error) throw error;
  
  // Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(fileName);

  return { fileName, publicUrl };
};

// Función para eliminar imagen
export const deleteProductImage = async (fileName: string) => {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([fileName]);

  if (error) throw error;
  return true;
};

// Función para obtener URL pública de imagen
export const getImageUrl = (fileName: string) => {
  if (!fileName) return null;
  
  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(fileName);

  return publicUrl;
};