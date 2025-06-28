import React, { useState } from 'react';
import { AuthContext, useAuthState } from './hooks/useAuth';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';

// Components
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import DashboardStats from './components/Dashboard/DashboardStats';
import RecentSales from './components/Dashboard/RecentSales';
import CategoryFilter from './components/Categories/CategoryFilter';
import ProductGrid from './components/Products/ProductGrid';
import ProductForm from './components/Products/ProductForm';
import CartModal from './components/Cart/CartModal';

function App() {
  const auth = useAuthState();
  const { products, categories, isLoading, addProduct, updateProduct, deleteProduct, getProductsByCategory, searchProducts, getLowStockProducts } = useProducts();
  const cart = useCart();
  
  // UI States
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Filtrar productos basado en categoría y búsqueda
  const getFilteredProducts = () => {
    let filtered = products;

    if (searchQuery.trim()) {
      filtered = searchProducts(searchQuery);
    } else if (selectedCategory !== null) {
      filtered = getProductsByCategory(selectedCategory);
    }

    return filtered;
  };

  // Manejar edición de producto
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  // Manejar eliminación de producto
  const handleDeleteProduct = async (product) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el producto "${product.nombre}"?`)) {
      try {
        await deleteProduct(product.id);
        alert('Producto eliminado exitosamente');
      } catch (error) {
        alert('Error al eliminar el producto');
      }
    }
  };

  // Manejar envío de formulario de producto
  const handleProductFormSubmit = async (productData, imageFile) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData, imageFile);
        alert('Producto actualizado exitosamente');
      } else {
        await addProduct(productData, imageFile);
        alert('Producto creado exitosamente');
      }
      setIsProductFormOpen(false);
      setEditingProduct(null);
    } catch (error) {
      throw error;
    }
  };

  // Si está cargando la autenticación
  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar formularios de login/registro
  if (!auth.user) {
    return (
      <AuthContext.Provider value={auth}>
        {isLoginForm ? (
          <LoginForm onToggleForm={() => setIsLoginForm(false)} />
        ) : (
          <RegisterForm onToggleForm={() => setIsLoginForm(true)} />
        )}
      </AuthContext.Provider>
    );
  }

  // Renderizar contenido principal basado en la sección activa
  const renderMainContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
        </div>
      );
    }

    switch (activeSection) {
      case 'dashboard':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
            <DashboardStats
              totalProducts={products.length}
              lowStockProducts={getLowStockProducts().length}
              todaySales={12}
              totalRevenue={2856.75}
              formatPrice={cart.formatPrice}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentSales 
                sales={[]} 
                formatPrice={cart.formatPrice}
              />
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos con Stock Bajo</h3>
                <div className="space-y-3">
                  {getLowStockProducts().slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{product.nombre}</p>
                        <p className="text-sm text-gray-600">{product.codigo}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-orange-600">
                          Stock: {product.stock}
                        </p>
                        <p className="text-xs text-gray-500">
                          Mín: {product.stock_minimo}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'productos':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Productos</h2>
              {auth.user.rol === 'admin' && (
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsProductFormOpen(true);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Nuevo Producto
                </button>
              )}
            </div>

            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            <ProductGrid
              products={getFilteredProducts()}
              onAddToCart={cart.addToCart}
              onEdit={auth.user.rol === 'admin' ? handleEditProduct : undefined}
              onDelete={auth.user.rol === 'admin' ? handleDeleteProduct : undefined}
              formatPrice={cart.formatPrice}
              showActions={auth.user.rol === 'admin'}
            />
          </div>
        );

      case 'ventas':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Punto de Venta</h2>
              <div className="text-sm text-gray-600">
                {getFilteredProducts().length} productos encontrados
              </div>
            </div>

            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            <ProductGrid
              products={getFilteredProducts()}
              onAddToCart={cart.addToCart}
              formatPrice={cart.formatPrice}
            />
          </div>
        );

      case 'inventario':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Inventario</h2>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Productos con Stock Bajo ({getLowStockProducts().length})
              </h3>
              <div className="space-y-4">
                {getLowStockProducts().map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border border-orange-200 rounded-lg bg-orange-50">
                    <div>
                      <h4 className="font-medium text-gray-900">{product.nombre}</h4>
                      <p className="text-sm text-gray-600">{product.codigo} - {product.laboratorio}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-orange-600">
                        Stock: {product.stock}
                      </p>
                      <p className="text-sm text-gray-500">
                        Mínimo: {product.stock_minimo}
                      </p>
                    </div>
                  </div>
                ))}
                {getLowStockProducts().length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    ¡Excelente! Todos los productos tienen stock suficiente.
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sección en Desarrollo
            </h2>
            <p className="text-gray-600">
              Esta funcionalidad estará disponible próximamente.
            </p>
          </div>
        );
    }
  };

  return (
    <AuthContext.Provider value={auth}>
      <div className="min-h-screen bg-gray-100">
        <Header
          cartItemsCount={cart.getCartItemsCount()}
          onCartClick={() => setIsCartOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="flex">
          <Sidebar
            user={auth.user}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            lowStockCount={getLowStockProducts().length}
          />

          <main className="flex-1 p-6">
            {renderMainContent()}
          </main>
        </div>

        {/* Cart Modal */}
        <CartModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cart.cartItems}
          onUpdateQuantity={cart.updateQuantity}
          onRemoveItem={cart.removeFromCart}
          onClearCart={cart.clearCart}
          formatPrice={cart.formatPrice}
          total={cart.getCartTotal()}
          vendedorId={auth.user.id}
        />

        {/* Product Form Modal */}
        <ProductForm
          isOpen={isProductFormOpen}
          onClose={() => {
            setIsProductFormOpen(false);
            setEditingProduct(null);
          }}
          onSubmit={handleProductFormSubmit}
          categories={categories}
          product={editingProduct}
          title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        />
      </div>
    </AuthContext.Provider>
  );
}

export default App;