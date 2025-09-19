export interface PaymentGatewayConfig {
  mercadoPago: {
    accessToken: string;
    publicKey: string;
    testMode: boolean;
  };
  goCuotas: {
    apiKey: string;
    merchantId: string;
    testMode: boolean;
  };
  modo: {
    merchantId: string;
    apiKey: string;
    testMode: boolean;
  };
}

export interface OrderData {
  orderId: string;
  amount: number;
  currency: string;
  description: string;
  customerInfo: {
    email: string;
    name: string;
    phone?: string;
  };
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    unitPrice: number;
  }>;
  shippingInfo?: {
    address: string;
    city: string;
    postalCode: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  deepLink?: string;
  orderId: string;
  paymentId?: string;
  error?: string;
}

class PaymentService {
  private config: PaymentGatewayConfig;

  constructor(config: PaymentGatewayConfig) {
    this.config = config;
  }

  // Mercado Pago Integration
  async createMercadoPagoPayment(orderData: OrderData): Promise<PaymentResponse> {
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const preference = {
        items: orderData.items.map(item => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          currency_id: orderData.currency
        })),
        payer: {
          email: orderData.customerInfo.email,
          name: orderData.customerInfo.name,
          phone: {
            number: orderData.customerInfo.phone || ''
          }
        },
        back_urls: {
          success: `${baseUrl}/checkout/success`,
          failure: `${baseUrl}/checkout/cancel`,
          pending: `${baseUrl}/checkout/pending`
        },
        auto_return: 'approved',
        external_reference: orderData.orderId,
        notification_url: `${baseUrl}/api/webhooks/mercadopago`,
        payment_methods: {
          excluded_payment_types: [],
          installments: 12
        }
      };

      // In production, you would make an actual API call to Mercado Pago
      if (this.config.mercadoPago.testMode) {
        // Simulate API response for testing
        const mockPaymentUrl = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=MP_TEST_${orderData.orderId}`;
        return {
          success: true,
          paymentUrl: mockPaymentUrl,
          orderId: orderData.orderId,
          paymentId: `MP_${Date.now()}`
        };
      }

      // Real API call would go here
      /*
      const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.mercadoPago.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preference)
      });

      const data = await response.json();

      return {
        success: true,
        paymentUrl: data.init_point,
        orderId: orderData.orderId,
        paymentId: data.id
      };
      */

      return {
        success: false,
        orderId: orderData.orderId,
        error: 'Mercado Pago API not configured'
      };

    } catch (error) {
      return {
        success: false,
        orderId: orderData.orderId,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Go Cuotas Integration
  async createGoCuotasPayment(orderData: OrderData): Promise<PaymentResponse> {
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

      const paymentData = {
        merchant_id: this.config.goCuotas.merchantId,
        order_id: orderData.orderId,
        amount: orderData.amount,
        currency: orderData.currency,
        description: orderData.description,
        customer_email: orderData.customerInfo.email,
        customer_name: orderData.customerInfo.name,
        return_url: `${baseUrl}/checkout/success`,
        cancel_url: `${baseUrl}/checkout/cancel`,
        webhook_url: `${baseUrl}/api/webhooks/gocuotas`
      };

      if (this.config.goCuotas.testMode) {
        // Simulate API response for testing
        const mockPaymentUrl = `https://gocuotas.com/payment/${orderData.orderId}?test=true`;
        return {
          success: true,
          paymentUrl: mockPaymentUrl,
          orderId: orderData.orderId,
          paymentId: `GC_${Date.now()}`
        };
      }

      // Real API call would go here
      /*
      const response = await fetch('https://api.gocuotas.com/v1/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.goCuotas.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();

      return {
        success: true,
        paymentUrl: data.payment_url,
        orderId: orderData.orderId,
        paymentId: data.payment_id
      };
      */

      return {
        success: false,
        orderId: orderData.orderId,
        error: 'Go Cuotas API not configured'
      };

    } catch (error) {
      return {
        success: false,
        orderId: orderData.orderId,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // MODO Integration
  async createModoPayment(orderData: OrderData): Promise<PaymentResponse> {
    try {
      const paymentData = {
        merchant_id: this.config.modo.merchantId,
        order_id: orderData.orderId,
        amount: orderData.amount,
        description: orderData.description,
        customer_email: orderData.customerInfo.email
      };

      if (this.config.modo.testMode) {
        // Generate MODO deep link for testing
        const deepLink = `modo://pay?merchant_id=${this.config.modo.merchantId}&amount=${orderData.amount}&order_id=${orderData.orderId}&description=${encodeURIComponent(orderData.description)}`;

        return {
          success: true,
          deepLink: deepLink,
          orderId: orderData.orderId,
          paymentId: `MODO_${Date.now()}`
        };
      }

      // Real API call would go here
      /*
      const response = await fetch('https://api.modo.com.ar/v1/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.modo.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();

      return {
        success: true,
        deepLink: data.deep_link,
        orderId: orderData.orderId,
        paymentId: data.payment_id
      };
      */

      return {
        success: false,
        orderId: orderData.orderId,
        error: 'MODO API not configured'
      };

    } catch (error) {
      return {
        success: false,
        orderId: orderData.orderId,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Generic payment creation method
  async createPayment(gateway: string, orderData: OrderData): Promise<PaymentResponse> {
    switch (gateway) {
      case 'mercadopago':
        return this.createMercadoPagoPayment(orderData);
      case 'gocuotas':
        return this.createGoCuotasPayment(orderData);
      case 'modo':
        return this.createModoPayment(orderData);
      default:
        return {
          success: false,
          orderId: orderData.orderId,
          error: `Unsupported payment gateway: ${gateway}`
        };
    }
  }
}

// Default configuration for testing
export const defaultPaymentConfig: PaymentGatewayConfig = {
  mercadoPago: {
    accessToken: process.env.NEXT_PUBLIC_MERCADOPAGO_ACCESS_TOKEN || 'TEST-ACCESS-TOKEN',
    publicKey: process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || 'TEST-PUBLIC-KEY',
    testMode: true
  },
  goCuotas: {
    apiKey: process.env.NEXT_PUBLIC_GOCUOTAS_API_KEY || 'TEST-API-KEY',
    merchantId: process.env.NEXT_PUBLIC_GOCUOTAS_MERCHANT_ID || 'TEST-MERCHANT',
    testMode: true
  },
  modo: {
    merchantId: process.env.NEXT_PUBLIC_MODO_MERCHANT_ID || 'SHOWSPORT',
    apiKey: process.env.NEXT_PUBLIC_MODO_API_KEY || 'TEST-API-KEY',
    testMode: true
  }
};

export const paymentService = new PaymentService(defaultPaymentConfig);
