# CalmateVibes

Una aplicación web completa para la gestión de inventario y ventas de mates y productos relacionados.

## 🚀 Características

### Frontend (React)
- **Dashboard de Ventas**: Visualización avanzada con gráficos comparativos de precio de compra vs venta
- **Gestión de Stock**: Interfaz completa para administrar inventario
- **Responsive Design**: Optimizado para dispositivos móviles (iPhone 12, iPhone 12 Pro, iPhone 12 mini, iPhone SE)
- **Catálogo de Productos**: Navegación intuitiva con filtros y búsqueda
- **Carrito de Compras**: Funcionalidad completa de e-commerce
- **Integración WhatsApp**: Comunicación directa con clientes

### Backend (Node.js + Express)
- **API RESTful**: Endpoints para gestión de productos, categorías y ventas
- **Base de Datos MongoDB**: Almacenamiento eficiente y escalable
- **Autenticación**: Sistema de login seguro
- **Validación de Datos**: Middleware de validación robusto

## 📱 Optimización Móvil

La aplicación está especialmente optimizada para dispositivos móviles con breakpoints específicos:
- iPhone 12 Pro Max (428px)
- iPhone 12/Pro (390px) 
- iPhone 12 mini (375px)
- iPhone SE (360px)

Los gráficos de Chart.js incluyen optimizaciones especiales para pantallas pequeñas.

## 🛠️ Tecnologías

### Frontend
- React 18
- Chart.js & react-chartjs-2
- Bootstrap 5
- CSS3 con breakpoints responsive
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB con Mongoose
- CORS habilitado
- Middleware de validación

## 📦 Estructura del Proyecto

```
CalmateVibes/
├── calmatevibes/
│   ├── frontend/          # Aplicación React
│   │   ├── src/
│   │   │   ├── components/    # Componentes reutilizables
│   │   │   ├── pages/         # Páginas principales
│   │   │   ├── styles/        # Estilos CSS
│   │   │   └── data/          # Datos mock
│   │   └── public/            # Archivos estáticos
│   └── backend/           # API Node.js
│       ├── controllers/       # Lógica de negocio
│       ├── models/           # Modelos de datos
│       ├── routes/           # Rutas de la API
│       └── config/           # Configuración
├── Docs/                  # Documentación del proyecto
└── README.md
```

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 14+
- MongoDB
- npm o yarn

### Frontend
```bash
cd calmatevibes/frontend
npm install
npm start
```

### Backend
```bash
cd calmatevibes/backend
npm install
npm start
```

## 📊 Características del Dashboard de Ventas

- **Gráfico Comparativo**: Línea de precio de compra vs línea de precio de venta
- **Métricas en Tiempo Real**: Estadísticas de ventas y rentabilidad
- **Filtros Avanzados**: Por fecha, producto, categoría
- **Exportación de Datos**: Formatos CSV y Excel
- **Visualización Responsiva**: Optimizada para todos los dispositivos

## 🎨 Diseño

El diseño utiliza una paleta de colores cálidos inspirada en la cultura del mate:
- Colores primarios: Beige, verde mate, marrones naturales
- Tipografía: Tw Cen MT Std
- Iconografía: Elementos relacionados con la cultura del mate

## 📱 Funcionalidades Móviles

- **Touch-friendly**: Botones y elementos optimizados para touch
- **Safe Area Support**: Compatibilidad con notch de iPhone
- **Performance Optimizations**: Carga rápida en dispositivos móviles
- **Gráficos Adaptables**: Chart.js con configuraciones específicas para móvil

## 🚀 Deployment

El proyecto está preparado para deployment en:
- **Frontend**: Netlify (configuración incluida)
- **Backend**: Heroku, DigitalOcean, AWS
- **Base de Datos**: MongoDB Atlas

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 License

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## ✨ Autor

Desarrollado con ❤️ para la comunidad matera.

---

⭐ ¡No olvides darle una estrella al proyecto si te resultó útil!