# 🚀 Deployment Guide - CalmateVibes

## Netlify Deployment

Este proyecto está configurado para ser desplegado en Netlify de manera sencilla.

### 📋 Configuración Automática

El proyecto incluye:
- `netlify.toml` - Configuración de build y redirects
- `_redirects` - Manejo de rutas para React Router
- Scripts de deployment automatizados

### 🚀 Método 1: GitHub Integration (Recomendado)

1. **Conectar repositorio:**
   - Ve a [https://app.netlify.com](https://app.netlify.com)
   - Click en "New site from Git"
   - Selecciona GitHub y el repositorio `CalmateVibes`

2. **Configuración de Build:**
   ```
   Base directory: calmatevibes/frontend
   Build command: npm run build
   Publish directory: calmatevibes/frontend/build
   ```

3. **Deploy:**
   - Click "Deploy site"
   - Netlify detectará automáticamente la configuración del `netlify.toml`

### 🚀 Método 2: Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login a Netlify
netlify login

# Desde el directorio raíz del proyecto
netlify init

# Deploy
netlify deploy --prod
```

### 🚀 Método 3: Scripts Automatizados

**Windows (PowerShell):**
```powershell
.\deploy.ps1
```

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### 🔧 Configuraciones Importantes

#### Variables de Entorno (si necesarias)

En Netlify Dashboard > Site Settings > Environment Variables:

```
NODE_VERSION=18
CI=false
GENERATE_SOURCEMAP=false
```

#### Headers de Seguridad

El archivo `netlify.toml` incluye headers de seguridad:
- X-Frame-Options
- X-XSS-Protection  
- X-Content-Type-Options
- Cache-Control para assets estáticos

#### React Router

Los redirects están configurados para manejar client-side routing:
```
/*    /index.html   200
```

### 📱 Mobile Optimization

El sitio está optimizado para dispositivos móviles:
- **iPhone 12 Pro Max**: 428px
- **iPhone 12/Pro**: 390px  
- **iPhone 12 mini**: 375px
- **iPhone SE**: 360px

Los gráficos de Chart.js se adaptan automáticamente a estas dimensiones.

### 🔍 Testing del Deploy

Después del deployment, verifica:

1. **Rutas funcionan:** Navega directamente a `/ventas`, `/stock`, etc.
2. **Gráficos móviles:** Abre en diferentes dispositivos
3. **Assets cargando:** Imágenes, fuentes, CSS
4. **Performance:** Lighthouse score

### 🐛 Troubleshooting

**Build falla:**
- Verificar que todas las dependencias estén en `package.json`
- Revisar warnings de ES Lint (variables no usadas)

**Rutas 404:**  
- Verificar que `_redirects` esté en `/public/`
- Confirmar configuración de `netlify.toml`

**Gráficos no se ven en móvil:**
- Verificar importación de `ChartMobileOptimizations.css`
- Comprobar breakpoints en CSS

### 📊 Dashboard Features

El dashboard de ventas incluye:
- ✅ Gráfico comparativo de precios (compra vs venta)
- ✅ Métricas en tiempo real
- ✅ Filtros por fecha y producto
- ✅ Exportación de datos
- ✅ Vista responsive completa

### 🌐 URL Example

Una vez deployado, tu sitio estará disponible en:
```
https://your-site-name.netlify.app
```

### 🔗 Enlaces Útiles

- [Netlify Docs](https://docs.netlify.com/)
- [React Deployment](https://create-react-app.dev/docs/deployment/)
- [Chart.js Mobile Optimization](https://www.chartjs.org/docs/latest/configuration/responsive.html)