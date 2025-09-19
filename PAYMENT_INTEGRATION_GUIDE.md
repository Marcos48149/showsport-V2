# 📱 **Guía de Integración de Pasarelas de Pago - ShowSport**

## 📋 **Índice**
1. [Resumen](#resumen)
2. [Pasarelas Implementadas](#pasarelas-implementadas)
3. [Configuración](#configuración)
4. [Seguridad](#seguridad)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Monitoreo](#monitoreo)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 **Resumen**

Este sistema implementa una integración completa con las principales pasarelas de pago argentinas, incluyendo redirecciones automáticas, validación de webhooks, logging y monitoreo de transacciones.

### **Características Principales:**
- ✅ **3 Pasarelas**: Mercado Pago, Go Cuotas, MODO
- ✅ **Redirecciones Automáticas** a apps móviles
- ✅ **Webhooks Seguros** con validación de firmas
- ✅ **Logging Completo** de transacciones
- ✅ **Panel Admin** para configuración
- ✅ **Tests Automatizados** para cada pasarela
- ✅ **Rate Limiting** y protección DDOS

---

## 🏦 **Pasarelas Implementadas**

### **1. Mercado Pago**
- **Características**: Tarjetas, cuentas MP, cuotas
- **Redirección**: Web checkout
- **Deep Link**: No aplicable
- **Webhook**: Firma HMAC-SHA256 + timestamp

### **2. Go Cuotas**
- **Características**: Cuotas sin interés
- **Redirección**: Web checkout
- **Deep Link**: No aplicable
- **Webhook**: Firma HMAC-SHA256

### **3. MODO**
- **Características**: Pagos desde celular
- **Redirección**: Deep link + fallback web
- **Deep Link**: `modo://pay?...`
- **Webhook**: Firma HMAC-SHA1

---

## ⚙️ **Configuración**

### **1. Variables de Entorno**

Copia `.env.example` a `.env.local` y configura:

```bash
# Mercado Pago
NEXT_PUBLIC_MERCADOPAGO_TEST_MODE=true
MERCADOPAGO_ACCESS_TOKEN="TEST-1234567890123456-012345-..."
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY="TEST-1234567890123456-012345-..."
MERCADOPAGO_WEBHOOK_SECRET="tu_webhook_secret_mp"

# Go Cuotas
NEXT_PUBLIC_GOCUOTAS_TEST_MODE=true
GOCUOTAS_API_KEY="gc_test_1234567890abcdef..."
GOCUOTAS_MERCHANT_ID="test_merchant_123"
GOCUOTAS_WEBHOOK_SECRET="tu_webhook_secret_gc"

# MODO
NEXT_PUBLIC_MODO_TEST_MODE=true
MODO_API_KEY="modo_test_1234567890abcdef..."
MODO_MERCHANT_ID="SHOWSPORT_TEST"
MODO_WEBHOOK_SECRET="tu_webhook_secret_modo"

# Seguridad Global
PAYMENT_WEBHOOK_SECRET="clave_secreta_global"
ENABLE_PAYMENT_LOGGING=true
LOG_LEVEL="info"
```

### **2. Configuración desde Admin Panel**

1. Ve a `/admin` (requiere rol admin)
2. Navega a la pestaña **"Pagos"**
3. Configura credenciales para cada pasarela
4. Prueba conexiones con el botón **"Probar Conexión"**

### **3. URLs de Webhooks**

Configura estas URLs en cada pasarela:

```
https://tu-dominio.com/api/webhooks/mercadopago
https://tu-dominio.com/api/webhooks/gocuotas
https://tu-dominio.com/api/webhooks/modo
```

---

## 🔒 **Seguridad**

### **Validación de Firmas**

Cada webhook valida automáticamente:
- ✅ **Firma HMAC** del proveedor
- ✅ **Timestamp** (previene replay attacks)
- ✅ **Rate limiting** por IP
- ✅ **Estructura del payload**

### **Configuración de Producción**

```typescript
// Ejemplo de validación de webhook
import { webhookSecurity } from '@/lib/webhookSecurity';

const validation = await webhookSecurity.validateWebhook(
  'mercadopago',
  requestBody,
  headers
);

if (!validation.isValid) {
  return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
}
```

### **Rate Limiting**

- **Límite**: 50 requests por minuto por IP
- **Ventana**: 60 segundos
- **Respuesta**: HTTP 429 cuando se excede

---

## 🧪 **Testing**

### **Tests Automatizados**

```bash
# Ejecutar todos los tests
npm run test:payments

# Test individual de una pasarela
npm run test:payment -- mercadopago
```

### **Tests Manuales**

```typescript
import { paymentTesting } from '@/lib/paymentTesting';

// Test completo de todas las pasarelas
const report = await paymentTesting.runAllTests();

// Test específico
const mpResult = await paymentTesting.testGateway('mercadopago');

// Health check rápido
const health = await paymentTesting.quickHealthCheck();
```

### **Casos de Prueba**

Cada pasarela se prueba con:
1. ✅ **Configuración válida**
2. ✅ **Creación de pago exitosa**
3. ✅ **Validación de webhook**
4. ✅ **Manejo de errores**
5. ✅ **Rate limiting**

---

## 🚀 **Deployment**

### **Checklist Pre-Producción**

- [ ] **Variables de entorno** configuradas
- [ ] **Webhooks URLs** registradas en pasarelas
- [ ] **SSL/HTTPS** habilitado
- [ ] **Tests** ejecutados y pasando
- [ ] **Logs** configurados y funcionando
- [ ] **Monitoreo** activo

### **Cambio a Producción**

1. **Cambiar variables de entorno:**
```bash
NEXT_PUBLIC_MERCADOPAGO_TEST_MODE=false
NEXT_PUBLIC_GOCUOTAS_TEST_MODE=false
NEXT_PUBLIC_MODO_TEST_MODE=false
NODE_ENV=production
```

2. **Obtener credenciales de producción** de cada pasarela

3. **Validar configuración:**
```typescript
import { config } from '@/lib/config';

const validation = config.validateConfig();
if (!validation.isValid) {
  console.error('Errores de configuración:', validation.errors);
}
```

### **Deployment con Netlify**

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_ENV = "production"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
```

---

## 📊 **Monitoreo**

### **Logging de Transacciones**

```typescript
import { paymentLogger, LogLevel, PaymentEvent } from '@/lib/logger';

// Log manual de eventos
await paymentLogger.log(
  LogLevel.INFO,
  PaymentEvent.PAYMENT_APPROVED,
  'mercadopago',
  {
    orderId: 'ORD-123',
    paymentId: 'MP-456',
    amount: 15000,
    customerId: 'USER-789'
  }
);
```

### **Métricas Importantes**

- **Total de transacciones** por pasarela
- **Tasa de éxito** de pagos
- **Tiempo promedio** de procesamiento
- **Errores de webhook**
- **Rate limiting** activaciones

### **Dashboard de Métricas**

Accede en `/admin` → **Analytics** para ver:
- 📈 Volumen de transacciones
- 💰 Ingresos por pasarela
- ⚠️ Errores y alertas
- 📊 Performance de APIs

---

## 🔧 **Troubleshooting**

### **Problemas Comunes**

#### **❌ Webhook no válido**
```
Error: Invalid webhook signature
```
**Solución:**
- Verificar webhook secret en variables de entorno
- Confirmar URL en configuración de pasarela
- Revisar formato de firma

#### **❌ Rate limit excedido**
```
Error: Rate limit exceeded (429)
```
**Solución:**
- Verificar si hay ataques DDOS
- Ajustar límites en `webhookSecurity.ts`
- Implementar IP whitelist

#### **❌ Configuración faltante**
```
Error: Missing required configuration
```
**Solución:**
- Ejecutar `config.validateConfig()`
- Verificar variables de entorno
- Comprobar credenciales en admin panel

### **Debug Mode**

```typescript
// Activar logs detallados
process.env.LOG_LEVEL = 'debug';

// Ver configuración actual
import { config } from '@/lib/config';
config.logConfigStatus();
```

### **Verificación de Salud**

```bash
# API endpoints de salud
GET /api/webhooks/mercadopago  # Debe retornar 200
GET /api/webhooks/gocuotas     # Debe retornar 200
GET /api/webhooks/modo         # Debe retornar 200
```

---

## 📞 **Soporte**

### **Contactos de Pasarelas**

- **Mercado Pago**: developers.mercadopago.com
- **Go Cuotas**: soporte@gocuotas.com
- **MODO**: developers.modo.com.ar

### **Logs de Error**

Los errores se registran automáticamente en:
- **Console** (desarrollo)
- **Base de datos** (producción)
- **Archivos de log** (servidor)

### **Documentación API**

- [Mercado Pago API](https://www.mercadopago.com.ar/developers/es/docs)
- [Go Cuotas API](https://docs.gocuotas.com)
- [MODO API](https://developers.modo.com.ar)

---

## 🔄 **Actualizaciones**

### **Versión Actual: v1.0**
- ✅ Integración básica de 3 pasarelas
- ✅ Webhooks seguros
- ✅ Logging completo
- ✅ Panel de admin

### **Próximas Versiones:**
- 🔄 Dashboard de analytics avanzado
- 🔄 Reembolsos automatizados
- 🔄 Suscripciones y pagos recurrentes
- 🔄 Integración con más pasarelas

---

**¡Sistema de pagos listo para producción! 🚀**
