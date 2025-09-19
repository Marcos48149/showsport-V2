# 🚀 **Guía de Configuración para Producción - ShowSport**

## 📋 **Checklist Completo de Producción**

### **Fase 1: Obtener Credenciales de Producción** ✅

#### **🏦 1. Mercado Pago**
1. **Crear cuenta de vendedor:** [mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers)
2. **Obtener credenciales de producción:**
   ```bash
   MERCADOPAGO_ACCESS_TOKEN="APP_USR-1234567890123456-012345-..."
   NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY="APP_USR-1234567890123456-012345-..."
   MERCADOPAGO_WEBHOOK_SECRET="tu_webhook_secret_personalizado"
   ```

#### **💳 2. Go Cuotas**
1. **Contactar:** comercial@gocuotas.com
2. **Credenciales:**
   ```bash
   GOCUOTAS_API_KEY="gc_live_1234567890abcdef..."
   GOCUOTAS_MERCHANT_ID="tu_merchant_id"
   GOCUOTAS_WEBHOOK_SECRET="tu_webhook_secret"
   ```

#### **📱 3. MODO**
1. **Registro:** [developers.modo.com.ar](https://developers.modo.com.ar)
2. **Credenciales:**
   ```bash
   MODO_API_KEY="modo_live_1234567890abcdef..."
   MODO_MERCHANT_ID="SHOWSPORT"
   MODO_WEBHOOK_SECRET="tu_webhook_secret"
   ```

### **Fase 2: Configurar Webhooks** 🔗

#### **URLs de Webhooks:**
```
https://tu-dominio.com/api/webhooks/mercadopago
https://tu-dominio.com/api/webhooks/gocuotas
https://tu-dominio.com/api/webhooks/modo
```

### **Fase 3: Variables de Entorno** ⚙️
```bash
# Archivo: .env.local (Producción)
NODE_ENV=production
BASE_URL=https://tu-dominio.com
DATABASE_URL=postgresql://user:password@host:5432/showsport_prod

# Payment Gateways - PRODUCTION
NEXT_PUBLIC_MERCADOPAGO_TEST_MODE=false
MERCADOPAGO_ACCESS_TOKEN=APP_USR-tu_access_token_real
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-tu_public_key_real
MERCADOPAGO_WEBHOOK_SECRET=tu_webhook_secret_mercadopago

NEXT_PUBLIC_GOCUOTAS_TEST_MODE=false
GOCUOTAS_API_KEY=gc_live_tu_api_key_real
GOCUOTAS_MERCHANT_ID=tu_merchant_id_real
GOCUOTAS_WEBHOOK_SECRET=tu_webhook_secret_gocuotas

NEXT_PUBLIC_MODO_TEST_MODE=false
MODO_API_KEY=modo_live_tu_api_key_real
MODO_MERCHANT_ID=SHOWSPORT
MODO_WEBHOOK_SECRET=tu_webhook_secret_modo

PAYMENT_WEBHOOK_SECRET=tu_clave_global_super_secreta
LOG_LEVEL=info
ENABLE_PAYMENT_LOGGING=true
```

### **Fase 4: Base de Datos SQL** 💾
```sql
-- Logs de pagos
CREATE TABLE payment_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    level VARCHAR(10) NOT NULL,
    event VARCHAR(50) NOT NULL,
    gateway VARCHAR(20) NOT NULL,
    order_id VARCHAR(100),
    payment_id VARCHAR(100),
    customer_id VARCHAR(100),
    amount DECIMAL(10,2),
    currency CHAR(3) DEFAULT 'ARS',
    status VARCHAR(20),
    metadata JSONB,
    error_message TEXT,
    request_id VARCHAR(100),
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transacciones
CREATE TABLE payment_transactions (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(100) UNIQUE NOT NULL,
    payment_id VARCHAR(100),
    gateway VARCHAR(20) NOT NULL,
    customer_id VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency CHAR(3) DEFAULT 'ARS',
    status VARCHAR(20) DEFAULT 'pending',
    items JSONB NOT NULL,
    shipping_address JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT
);

-- Índices para performance
CREATE INDEX idx_payment_logs_gateway_timestamp ON payment_logs(gateway, timestamp);
CREATE INDEX idx_payment_logs_order_id ON payment_logs(order_id);
CREATE INDEX idx_payment_transactions_gateway_status ON payment_transactions(gateway, status);
CREATE INDEX idx_payment_transactions_created_at ON payment_transactions(created_at);
```

### **Fase 5: Testing y Validación** 🧪

#### **Tests desde Admin Panel:**
1. Ve a: `https://tu-dominio.com/admin` → Pestaña "Pagos"
2. Click "Ejecutar Tests Completos"
3. Verificar que todas las pasarelas pasen

#### **Health Check API:**
```bash
curl https://tu-dominio.com/api/admin/test-payments?type=health
```

## ✅ **Checklist Final**
- [ ] Credenciales de producción configuradas
- [ ] Webhooks registrados en proveedores
- [ ] Variables de entorno configuradas
- [ ] Base de datos configurada
- [ ] Tests ejecutados y pasando
- [ ] SSL/HTTPS habilitado
- [ ] Transacción de prueba exitosa

**🎉 ¡Sistema listo para pagos reales!**
