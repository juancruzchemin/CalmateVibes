import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.js';
import About from './pages/About.js';
import Contact from './pages/Contact.js';
import Catalogs from './pages/Catalog-page.js';
import Tienda from './components/Tienda.js';
import Cuidados from './pages/Cuidados.js';
import Login from './pages/Login.js';
import ItemDetail from './pages/ItemDetail.js';
import Stock from './pages/Stock.js';
import Ventas from './pages/Ventas.js';
import Cart from './pages/Cart.js'; // Importa la nueva página del carrito
import { CarritoProvider } from './context/CarritoContext.js'; // Importa el contexto del carrito
import catalogos from './data/tiendas.json';
import CrearItem from './pages/CrearItem.js';

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
    <CarritoProvider> {/* Envuelve la aplicación con el contexto del carrito */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/all-catalog" element={<Catalogs />} />
          <Route path="/shop" element={<Tienda />} />
          <Route path="/catalog/:catalogoId" element={<Catalogs />} />
          <Route path="/care" element={<Cuidados />} />
          <Route path="/login" element={<Login />} />
          <Route path="/item/:catalogoId/:itemId" element={<ItemDetail />} />
          <Route
            path="/stock"
            element={
              <Stock
                catalogos={catalogos}
                onAddItem={handleAddItem}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
              />
            }
          />
          <Route path="/ventas" element={<Ventas />} /> {/* Nueva ruta para la página de ventas */}
          <Route path="/cart" element={<Cart />} /> {/* Nueva ruta para la página del carrito completa */}
          <Route path="/create-item" element={<CrearItem />} /> {/* Nueva ruta para crear un ítem */}
        </Routes>
      </Router>
    </CarritoProvider>
  );
}

export default App;