# Variables de entorno necesarias para Netlify

## Instrucciones para configurar en Netlify:
## 1. Ve a tu sitio en Netlify
## 2. Site settings → Build & deploy → Environment variables
## 3. Añade cada una de estas variables:

# API URLs - Cambia por tu dominio de backend en producción
REACT_APP_API_URL=https://tu-backend-en-produccion.com
REACT_APP_BACKEND_URL=https://tu-backend-en-produccion.com/api

# MercadoPago - Credenciales de PRODUCCIÓN (NO las de test)
REACT_APP_MERCADOPAGO_PUBLIC_KEY=APP_USR-tu-public-key-de-produccion

# Opcional - Environment indicator
REACT_APP_ENV=production

## IMPORTANTE:
## - Reemplaza "tu-backend-en-produccion.com" por tu dominio real del backend
## - Usa las credenciales de PRODUCCIÓN de MercadoPago, no las de test
## - Estas variables se incrustan en el build de React, no son secretas
## - Para credenciales secretas (como access tokens), úsalas solo en el backend

## ✅ ARCHIVOS ACTUALIZADOS CON VARIABLES DE ENTORNO:
## - AuthContext.js (login, register, verify)
## - PaymentButton.js (create_preference)
## - Catalog-page.js (URLs de debug)
## - CrearItem.js (cargar productos, crear productos)
## - MisPedidos.js (obtener pedidos)
## - carritoService.js (ya estaba correcto)
## - categoriaService.js (ya estaba correcto)
## - pagoService.js (ya estaba correcto)
## - productoService.js (ya estaba correcto)
## - pedidoService.js (ya estaba correcto)

## 🔄 PARA CAMBIAR ENTRE LOCAL Y PRODUCCIÓN:
## Solo cambia estas variables en el .env local del frontend:
## REACT_APP_API_URL=http://localhost:5001  (local)
## REACT_APP_BACKEND_URL=http://localhost:5001/api  (local)
## 
## O para apuntar a producción desde local:
## REACT_APP_API_URL=https://tu-backend-desplegado.com
## REACT_APP_BACKEND_URL=https://tu-backend-desplegado.com/api