# 🏗️ GUÍA DE REORGANIZACIÓN DE COMPONENTES

## 📁 Nueva Estructura de Carpetas

```
components/
├── layout/                 # Componentes de estructura
│   ├── Header.js          ✅ MOVIDO
│   ├── Footer.js          ✅ MOVIDO  
│   ├── Navbar.js          ✅ MOVIDO
│   ├── Sidebar.js         ✅ MOVIDO
│   ├── Content.js         ✅ MOVIDO
│   └── MainContent.js     ✅ MOVIDO
│
├── catalog/               # Componentes del catálogo
│   ├── Catalog.js         ✅ MOVIDO
│   ├── CatalogButtons.js  ✅ MOVIDO
│   ├── CatalogItems.js    ✅ MOVIDO
│   ├── CategorySelector.js ❌ PENDIENTE
│   ├── Filtros.js         ✅ MOVIDO
│   ├── MobileFilters.js   ✅ MOVIDO
│   ├── Ordenador.js       ❌ PENDIENTE
│   ├── Paginador.js       ✅ MOVIDO
│   ├── Tienda.js          ❌ PENDIENTE
│   └── TiendaCard.js      ❌ PENDIENTE
│
├── home/                  # Componentes específicos de Home
│   ├── CuradosBanner.js   ✅ MOVIDO
│   ├── InstagramFeed.js   ✅ MOVIDO
│   ├── SectionDividerImage.js ❌ PENDIENTE
│   └── CatalogoIndice.js  ❌ PENDIENTE
│
├── cart/                  # Carrito (ya existe)
│   ├── CartItems.js       ✅ YA EXISTE
│   ├── CartSummary.js     ✅ YA EXISTE
│   ├── CheckoutForm.js    ✅ YA EXISTE
│   ├── EmptyCart.js       ✅ YA EXISTE
│   └── PaymentMethod.js   ✅ YA EXISTE
│
├── ui/                    # Componentes de interfaz
│   ├── Notification.js    ❌ PENDIENTE
│   ├── Popup.js           ✅ MOVIDO
│   ├── PopupRedireccion.js ❌ PENDIENTE
│   ├── EmptyState.js      ✅ MOVIDO
│   ├── Breadcrumb.js      ✅ MOVIDO
│   ├── FullImage.js       ❌ PENDIENTE
│   └── PreviewItem.js     ❌ PENDIENTE
│
├── admin/                 # Componentes administrativos
│   ├── AdminFilters.js
│   ├── AdminItemsView.js
│   ├── AddItemModal.js
│   ├── EditItemModal.js
│   ├── ItemForm.js
│   ├── SimpleItemForm.js
│   ├── SimpleCategoryManager.js
│   ├── TemplateManager.js
│   ├── OffersManager.js
│   ├── VentasDashboard.js
│   ├── VentasExportModal.js
│   ├── VentasFilters.js
│   └── VentasProductList.js
│
├── shared/                # Componentes reutilizables
│   ├── CarritoIcono.js
│   ├── PaymentButton.js
│   ├── WhatsappButton.js
│   ├── WhatsAppCompra.js
│   └── WhatsappFloat.js
│
└── features/              # Funcionalidades específicas
    └── Carrito.js
```

## 🔄 IMPORTS QUE NECESITAS ACTUALIZAR

### Páginas que usan Layout:
```javascript
// ANTES:
import Header from '../components/Header';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

// DESPUÉS:
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
```

### Páginas que usan Catalog:
```javascript
// ANTES:
import Catalog from '../components/Catalog';
import Filtros from '../components/Filtros';
import Paginador from '../components/Paginador';

// DESPUÉS:
import Catalog from '../components/catalog/Catalog';
import Filtros from '../components/catalog/Filtros';
import Paginador from '../components/catalog/Paginador';
```

### Páginas que usan Home components:
```javascript
// ANTES:
import CuradosBanner from '../components/CuradosBanner';
import InstagramFeed from '../components/InstagramFeed';

// DESPUÉS:
import CuradosBanner from '../components/home/CuradosBanner';
import InstagramFeed from '../components/home/InstagramFeed';
```

### Páginas que usan UI components:
```javascript
// ANTES:
import Notification from '../components/Notification';
import Popup from '../components/Popup';

// DESPUÉS:
import Notification from '../components/ui/Notification';
import Popup from '../components/ui/Popup';
```

## 📋 PRÓXIMOS PASOS:

1. **Terminar de mover archivos restantes**
2. **Actualizar imports en las páginas**
3. **Mover carpetas de estilos correspondientes**
4. **Crear archivos index.js para exports limpios**
5. **Actualizar imports internos entre componentes**

## 🎯 BENEFICIOS:

✅ **Mejor organización** por funcionalidad
✅ **Fácil localización** de componentes
✅ **Escalabilidad** para nuevas features
✅ **Mantenimiento** más sencillo
✅ **Colaboración** en equipo mejorada