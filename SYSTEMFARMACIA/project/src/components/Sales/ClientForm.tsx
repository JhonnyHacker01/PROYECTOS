import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Calendar, CreditCard } from 'lucide-react';
import { Cliente, useClients } from '../../hooks/useClients';

interface ClientFormProps {
  onClientSelect: (client: Cliente | null) => void;
  selectedClient: Cliente | null;
}

const ClientForm: React.FC<ClientFormProps> = ({ onClientSelect, selectedClient }) => {
  const { clients, addClient, searchClients, getClientByDocument } = useClients();
  const [isNewClient, setIsNewClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<Omit<Cliente, 'id'>>({
    nombre: '',
    apellidos: '',
    documento_tipo: 'DNI',
    documento_numero: '',
    email: '',
    telefono: '',
    direccion: '',
    fecha_nacimiento: ''
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Buscar por documento
    if (query.length >= 8) {
      const client = getClientByDocument(query);
      if (client) {
        onClientSelect(client);
        return;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newClient = await addClient(formData);
      onClientSelect(newClient);
      setIsNewClient(false);
      setFormData({
        nombre: '',
        apellidos: '',
        documento_tipo: 'DNI',
        documento_numero: '',
        email: '',
        telefono: '',
        direccion: '',
        fecha_nacimiento: ''
      });
    } catch (error) {
      console.error('Error creating client:', error);
      alert('Error al crear cliente');
    }
  };

  const filteredClients = searchClients(searchQuery);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <User className="h-5 w-5 text-green-600 mr-2" />
        Información del Cliente
      </h3>

      {!isNewClient ? (
        <div className="space-y-4">
          {/* Búsqueda de cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar cliente (DNI/RUC/Nombre)
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Ingrese DNI, RUC o nombre del cliente"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Lista de clientes encontrados */}
          {searchQuery && filteredClients.length > 0 && (
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
              {filteredClients.slice(0, 5).map((client) => (
                <button
                  key={client.id}
                  onClick={() => onClientSelect(client)}
                  className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">
                    {client.nombre} {client.apellidos}
                  </div>
                  <div className="text-sm text-gray-600">
                    {client.documento_tipo}: {client.documento_numero}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Cliente seleccionado */}
          {selectedClient && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-green-900">
                    {selectedClient.nombre} {selectedClient.apellidos}
                  </h4>
                  <p className="text-sm text-green-700">
                    {selectedClient.documento_tipo}: {selectedClient.documento_numero}
                  </p>
                  {selectedClient.email && (
                    <p className="text-sm text-green-700">{selectedClient.email}</p>
                  )}
                  {selectedClient.telefono && (
                    <p className="text-sm text-green-700">{selectedClient.telefono}</p>
                  )}
                </div>
                <button
                  onClick={() => onClientSelect(null)}
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  Cambiar
                </button>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex space-x-3">
            <button
              onClick={() => setIsNewClient(true)}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Nuevo Cliente
            </button>
            <button
              onClick={() => onClientSelect(null)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Venta sin Cliente
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Apellidos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellidos
              </label>
              <input
                type="text"
                value={formData.apellidos}
                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Tipo de documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Documento *
              </label>
              <select
                required
                value={formData.documento_tipo}
                onChange={(e) => setFormData({ ...formData, documento_tipo: e.target.value as 'DNI' | 'RUC' | 'CE' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="DNI">DNI</option>
                <option value="RUC">RUC</option>
                <option value="CE">Carnet de Extranjería</option>
              </select>
            </div>

            {/* Número de documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Documento *
              </label>
              <input
                type="text"
                required
                value={formData.documento_numero}
                onChange={(e) => setFormData({ ...formData, documento_numero: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <textarea
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Botones */}
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Crear Cliente
            </button>
            <button
              type="button"
              onClick={() => setIsNewClient(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ClientForm;