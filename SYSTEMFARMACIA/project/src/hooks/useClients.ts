import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Cliente {
  id: number;
  nombre: string;
  apellidos?: string;
  documento_tipo: 'DNI' | 'RUC' | 'CE';
  documento_numero: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadClients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nombre');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addClient = async (clientData: Omit<Cliente, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .insert(clientData)
        .select()
        .single();

      if (error) throw error;

      await loadClients();
      return data;
    } catch (error) {
      console.error('Error adding client:', error);
      throw error;
    }
  };

  const updateClient = async (id: number, clientData: Partial<Cliente>) => {
    try {
      const { error } = await supabase
        .from('clientes')
        .update(clientData)
        .eq('id', id);

      if (error) throw error;

      await loadClients();
      return true;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  };

  const searchClients = (query: string) => {
    if (!query.trim()) return clients;
    
    const lowercaseQuery = query.toLowerCase();
    return clients.filter(client => 
      client.nombre.toLowerCase().includes(lowercaseQuery) ||
      client.apellidos?.toLowerCase().includes(lowercaseQuery) ||
      client.documento_numero.includes(query) ||
      client.email?.toLowerCase().includes(lowercaseQuery)
    );
  };

  const getClientByDocument = (documentNumber: string) => {
    return clients.find(client => client.documento_numero === documentNumber);
  };

  useEffect(() => {
    loadClients();
  }, []);

  return {
    clients,
    isLoading,
    addClient,
    updateClient,
    searchClients,
    getClientByDocument,
    refreshClients: loadClients
  };
};