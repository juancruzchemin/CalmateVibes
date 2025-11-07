import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.js';
import About from './pages/About.js';
import Contact from './pages/Contact.js';
import Catalogs from './pages/Catalog-page.js';
import Tienda from './components/catalog/Tienda.js';
import Cuidados from './pages/Cuidados.js';
import Login from './pages/Login.js';
import Profile from './pages/Profile.js';
import ItemDetail from './pages/ItemDetail.js';
import Stock from './pages/Stock.js';
import Pedidos from './pages/Pedidos.js';
import MisPedidos from './pages/MisPedidos.js';
import Ventas from './pages/Ventas.js';
import Cart from './pages/Cart.js';
import CrearItem from './pages/CrearItem.js';
import PaymentSuccess from './pages/PaymentSuccess.js';
import PaymentFailure from './pages/PaymentFailure.js';
import PaymentPending from './pages/PaymentPending.js';
import { CarritoProvider } from './context/CarritoContext.js';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import catalogos from './data/tiendas.json';

const handleAddItem = (newItem, catalogoId) => {
  // Lógica para agregar un nuevo item al catálogo correspondiente
};

const handleUpdateItem = (itemId, updatedItem, catalogoId) => {
  // Lógica para actualizar un item existente en el catálogo correspondiente
};

const handleDeleteItem = (itemId, catalogoId) => {
  // Lógica para eliminar un item del catálogo correspondiente
};

function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/all-catalog" element={<Catalogs />} />
            <Route path="/catalog" element={<Catalogs />} />
            <Route path="/shop" element={<Tienda />} />
            <Route path="/catalog/:catalogoId" element={<Catalogs />} />
            <Route path="/catalogo/:catalogoId" element={<Catalogs />} />
            <Route path="/care" element={<Cuidados />} />
            <Route path="/login" element={<Login />} />
            <Route path="/item/:catalogoId/:itemId" element={<ItemDetail />} />
            
            {/* Rutas de resultado de pago */}
            <Route path="/pago/exito" element={<PaymentSuccess />} />
            <Route path="/pago/error" element={<PaymentFailure />} />
            <Route path="/pago/pendiente" element={<PaymentPending />} />
            
            {/* Rutas de MercadoPago (en inglés) */}
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failure" element={<PaymentFailure />} />
            <Route path="/payment/pending" element={<PaymentPending />} />
            
            {/* Rutas que requieren autenticación */}
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <Cart />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mis-pedidos" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <MisPedidos />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* Rutas que requieren ser administrador */}
            <Route
              path="/stock"
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <Stock
                    catalogos={catalogos}
                    onAddItem={handleAddItem}
                    onUpdateItem={handleUpdateItem}
                    onDeleteItem={handleDeleteItem}
                  />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/pedidos" 
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <Pedidos />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ventas" 
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <Ventas />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-item" 
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <CrearItem />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;