# 🚀 **Guía Completa de Deployment en Vercel - ShowSport**

## 📋 **Paso 1: Crear Cuenta en Vercel**

### **1.1 Registro**
1. Ve a [vercel.com](https://vercel.com)
2. Click en **"Sign Up"**
3. **Recomendado:** Usa **"Continue with GitHub"** para integración automática
4. Autoriza el acceso a tus repositorios
5. Completa tu perfil básico

### **1.2 Verificación**
- Verifica tu email si es necesario
- Confirma tu cuenta GitHub está conectada

---

## 📁 **Paso 2: Preparar el Proyecto**

### **2.1 Configuración para Vercel**

Crea `vercel.json` en la raíz del proyecto:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sfo1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 10
    }
  },
  "rewrites": [
    {
      "source": "/api/webhooks/(.*)",
      "destination": "/api/webhooks/$1"
    }
  ]
}
```

### **2.2 Configurar package.json**

Asegúrate que tu `package.json` tenga:

```json
{
  "scripts": {
    "build": "next build",
    "dev": "next dev -H 0.0.0.0",
    "start": "next start",
    "lint": "next lint"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

---

## 🔧 **Paso 3: Deploy desde GitHub**

### **3.1 Subir a GitHub (si no está ya)**

```bash
# Inicializar git (si no está hecho)
git init

# Agregar archivos
git add .

# Commit inicial
git commit -m "feat: complete payment system ready for production"

# Conectar con GitHub (reemplaza con tu repo)
git remote add origin https://github.com/tu-usuario/showsport-ecommerce.git

# Push al repositorio
git push -u origin main
```

### **3.2 Conectar con Vercel**

1. **En Vercel Dashboard:**
   - Click **"New Project"**
   - Selecciona **"Import Git Repository"**
   - Elige tu repositorio `showsport-ecommerce`

2. **Configuración del Proyecto:**
   - **Framework Preset:** Next.js (detectado automáticamente)
   - **Root Directory:** `showsport-clone` (importante!)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

3. **Click "Deploy"** (fallará por las variables de entorno, esto es normal)

---

## ⚙️ **Paso 4: Configurar Variables de Entorno**

### **4.1 Acceder a Settings**
1. En tu proyecto Vercel, ve a **"Settings"**
2. Click en **"Environment Variables"**

### **4.2 Variables Requeridas**

Agrega estas variables una por una:

#### **🌍 Variables Básicas:**
```bash
NODE_ENV=production
BASE_URL=https://tu-proyecto.vercel.app
NEXTAUTH_SECRET=tu_nextauth_secret_muy_seguro_aqui
NEXTAUTH_URL=https://tu-proyecto.vercel.app
```

#### **💾 Base de Datos:**
```bash
DATABASE_URL=postgresql://user:password@host:5432/showsport_prod
```

#### **🏦 Mercado Pago (Producción):**
```bash
NEXT_PUBLIC_MERCADOPAGO_TEST_MODE=false
MERCADOPAGO_ACCESS_TOKEN=APP_USR-tu_access_token_real_aqui
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-tu_public_key_real_aqui
MERCADOPAGO_WEBHOOK_SECRET=tu_webhook_secret_mp
```

#### **💳 Go Cuotas (Producción):**
```bash
NEXT_PUBLIC_GOCUOTAS_TEST_MODE=false
GOCUOTAS_API_KEY=gc_live_tu_api_key_real
GOCUOTAS_MERCHANT_ID=tu_merchant_id_real
GOCUOTAS_WEBHOOK_SECRET=tu_webhook_secret_gc
```

#### **📱 MODO (Producción):**
```bash
NEXT_PUBLIC_MODO_TEST_MODE=false
MODO_API_KEY=modo_live_tu_api_key_real
MODO_MERCHANT_ID=SHOWSPORT
MODO_WEBHOOK_SECRET=tu_webhook_secret_modo
```

#### **🔒 Seguridad:**
```bash
PAYMENT_WEBHOOK_SECRET=tu_clave_global_super_secreta
LOG_LEVEL=info
ENABLE_PAYMENT_LOGGING=true
```

#### **📧 Email (Opcional):**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@showsport.com
SMTP_PASSWORD=tu_password_email
```

#### **🛒 VTEX (Si usas):**
```bash
VTEX_ACCOUNT_NAME=tu_cuenta_vtex
VTEX_API_KEY=tu_vtex_api_key
VTEX_API_TOKEN=tu_vtex_api_token
VTEX_ENVIRONMENT=stable
```

### **4.3 Configurar Environment**

Para cada variable:
1. **Name:** Nombre de la variable
2. **Value:** El valor
3. **Environment:** Selecciona **"Production"**, **"Preview"** y **"Development"**
4. Click **"Add"**

---

## 🔄 **Paso 5: Re-deploy**

### **5.1 Trigger New Deployment**
1. Ve a **"Deployments"** tab
2. Click **"Redeploy"** en el último deployment
3. **O** haz un push a GitHub para trigger automático

### **5.2 Verificar Build**
- Monitorea el build log para errores
- El deployment debería completarse sin errores ahora

---

## 🌐 **Paso 6: Configurar Dominio (Opcional)**

### **6.1 Dominio de Vercel**
- Tu app estará disponible en: `https://tu-proyecto.vercel.app`
- Puedes cambiar el nombre en Settings → General → Project Name

### **6.2 Dominio Personalizado**
1. Ve a **Settings → Domains**
2. Click **"Add Domain"**
3. Ingresa tu dominio: `showsport.com`
4. Configura DNS según las instrucciones de Vercel

---

## 🔗 **Paso 7: Configurar URLs de Webhooks**

### **7.1 URLs Finales**
Con tu dominio Vercel configurado, las URLs serán:

```
https://tu-proyecto.vercel.app/api/webhooks/mercadopago
https://tu-proyecto.vercel.app/api/webhooks/gocuotas
https://tu-proyecto.vercel.app/api/webhooks/modo
```

### **7.2 Registrar en Pasarelas**

#### **🏦 Mercado Pago:**
1. Ve al [Panel de Desarrolladores](https://www.mercadopago.com.ar/developers)
2. Tu aplicación → Webhooks
3. URL: `https://tu-proyecto.vercel.app/api/webhooks/mercadopago`
4. Eventos: `payment`, `merchant_order`

#### **💳 Go Cuotas:**
1. Contacta soporte: soporte@gocuotas.com
2. URL: `https://tu-proyecto.vercel.app/api/webhooks/gocuotas`

#### **📱 MODO:**
1. Portal desarrolladores MODO
2. URL: `https://tu-proyecto.vercel.app/api/webhooks/modo`

---

## ✅ **Paso 8: Validar Todo Funciona**

### **8.1 Health Check**
Verifica que el sitio responda:
```bash
curl https://tu-proyecto.vercel.app/api/admin/test-payments?type=health
```

### **8.2 Panel de Admin**
1. Ve a: `https://tu-proyecto.vercel.app/admin`
2. Navega a **"Pagos"**
3. Click **"Ejecutar Tests Completos"**
4. Verifica que todas las pasarelas pasen

### **8.3 Test de Webhook**
```bash
curl https://tu-proyecto.vercel.app/api/webhooks/mercadopago
curl https://tu-proyecto.vercel.app/api/webhooks/gocuotas
curl https://tu-proyecto.vercel.app/api/webhooks/modo
```

---

## 📊 **Configuración de Monitoreo en Vercel**

### **9.1 Analytics**
1. Ve a **Analytics** tab en tu proyecto
2. Habilita **Web Analytics**
3. Monitorea performance y errores

### **9.2 Logs**
1. **Functions** tab para ver logs de API
2. **Deployments** → Click en deployment → **Function Logs**

### **9.3 Alertas**
1. **Settings** → **Git Integration**
2. Habilita notificaciones para build failures

---

## 🔧 **Configuración Avanzada**

### **10.1 Custom Build Command (si necesario)**
En Settings → General:
```bash
cd showsport-clone && npm run build
```

### **10.2 Serverless Functions**
Vercel maneja automáticamente `/api/*` como serverless functions.

### **10.3 Edge Runtime (opcional)**
Para mejor performance, agrega al top de tus API routes:
```typescript
export const runtime = 'edge';
```

---

## 🚨 **Troubleshooting**

### **Error: "Build Failed"**
1. Verifica que todas las variables de entorno estén configuradas
2. Revisa el build log en Vercel
3. Asegúrate que el directorio root sea `showsport-clone`

### **Error: "Function Timeout"**
1. Ve a Settings → Functions
2. Ajusta timeout a 10 seconds

### **Error: "Environment Variables"**
1. Verifica que todas las variables estén en Production environment
2. Re-deploy después de agregar variables

### **Webhooks no funcionan**
1. Verifica URLs en consolas de pasarelas
2. Chequea logs en Functions tab
3. Valida que las variables de webhook secrets estén correctas

---

## ✅ **Checklist Final de Deployment**

### **Pre-Deploy:**
- [ ] ✅ Cuenta Vercel creada y verificada
- [ ] ✅ Repositorio GitHub actualizado
- [ ] ✅ Proyecto conectado a Vercel
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Build exitoso

### **Post-Deploy:**
- [ ] ✅ Sitio accesible en URL de Vercel
- [ ] ✅ Panel admin funcionando
- [ ] ✅ Tests de pasarelas pasando
- [ ] ✅ Webhooks registrados en pasarelas
- [ ] ✅ Health check API respondiendo
- [ ] ✅ Analytics habilitado

### **Validación Final:**
- [ ] ✅ Transacción de prueba exitosa
- [ ] ✅ Webhooks recibiendo notificaciones
- [ ] ✅ Emails de confirmación funcionando
- [ ] ✅ Dashboard analytics funcionando
- [ ] ✅ Logs registrándose correctamente

---

## 🎉 **¡Deployment Completado!**

Tu sistema de pagos ShowSport está ahora **live en producción** con:
- ✅ **3 Pasarelas argentinas** funcionando
- ✅ **Seguridad enterprise** implementada
- ✅ **Analytics en tiempo real**
- ✅ **Monitoreo automatizado**
- ✅ **Escalabilidad automática**

**🚀 Ready to process real payments! 🚀**
