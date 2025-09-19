export interface PaymentConfig {
  mercadoPago: {
    accessToken: string;
    publicKey: string;
    testMode: boolean;
    webhookSecret: string;
  };
  goCuotas: {
    apiKey: string;
    merchantId: string;
    testMode: boolean;
    webhookSecret: string;
  };
  modo: {
    apiKey: string;
    merchantId: string;
    testMode: boolean;
    webhookSecret: string;
  };
}

export interface AppConfig {
  payment: PaymentConfig;
  vtex: {
    accountName: string;
    apiKey: string;
    apiToken: string;
    environment: string;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
  };
  security: {
    webhookSecret: string;
    enablePaymentLogging: boolean;
    logLevel: string;
  };
  app: {
    nodeEnv: string;
    baseUrl: string;
    nextAuthSecret: string;
    nextAuthUrl: string;
  };
}

class ConfigManager {
  private static instance: ConfigManager;
  private config: AppConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): AppConfig {
    return {
      payment: {
        mercadoPago: {
          accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
          publicKey: process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || '',
          testMode: process.env.NEXT_PUBLIC_MERCADOPAGO_TEST_MODE === 'true',
          webhookSecret: process.env.MERCADOPAGO_WEBHOOK_SECRET || ''
        },
        goCuotas: {
          apiKey: process.env.GOCUOTAS_API_KEY || '',
          merchantId: process.env.GOCUOTAS_MERCHANT_ID || '',
          testMode: process.env.NEXT_PUBLIC_GOCUOTAS_TEST_MODE === 'true',
          webhookSecret: process.env.GOCUOTAS_WEBHOOK_SECRET || ''
        },
        modo: {
          apiKey: process.env.MODO_API_KEY || '',
          merchantId: process.env.MODO_MERCHANT_ID || 'SHOWSPORT',
          testMode: process.env.NEXT_PUBLIC_MODO_TEST_MODE === 'true',
          webhookSecret: process.env.MODO_WEBHOOK_SECRET || ''
        }
      },
      vtex: {
        accountName: process.env.VTEX_ACCOUNT_NAME || '',
        apiKey: process.env.VTEX_API_KEY || '',
        apiToken: process.env.VTEX_API_TOKEN || '',
        environment: process.env.VTEX_ENVIRONMENT || 'stable'
      },
      email: {
        smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
        smtpPort: parseInt(process.env.SMTP_PORT || '587'),
        smtpUser: process.env.SMTP_USER || '',
        smtpPassword: process.env.SMTP_PASSWORD || ''
      },
      security: {
        webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || '',
        enablePaymentLogging: process.env.ENABLE_PAYMENT_LOGGING === 'true',
        logLevel: process.env.LOG_LEVEL || 'info'
      },
      app: {
        nodeEnv: process.env.NODE_ENV || 'development',
        baseUrl: process.env.BASE_URL || 'http://localhost:3000',
        nextAuthSecret: process.env.NEXTAUTH_SECRET || '',
        nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000'
      }
    };
  }

  public getConfig(): AppConfig {
    return this.config;
  }

  public getPaymentConfig(): PaymentConfig {
    return this.config.payment;
  }

  public isProduction(): boolean {
    return this.config.app.nodeEnv === 'production';
  }

  public validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate payment configurations
    if (!this.config.payment.mercadoPago.accessToken) {
      errors.push('Mercado Pago access token is missing');
    }
    if (!this.config.payment.mercadoPago.publicKey) {
      errors.push('Mercado Pago public key is missing');
    }
    if (!this.config.payment.goCuotas.apiKey) {
      errors.push('Go Cuotas API key is missing');
    }
    if (!this.config.payment.modo.apiKey) {
      errors.push('MODO API key is missing');
    }

    // Validate webhook secrets in production
    if (this.isProduction()) {
      if (!this.config.payment.mercadoPago.webhookSecret) {
        errors.push('Mercado Pago webhook secret is required in production');
      }
      if (!this.config.payment.goCuotas.webhookSecret) {
        errors.push('Go Cuotas webhook secret is required in production');
      }
      if (!this.config.payment.modo.webhookSecret) {
        errors.push('MODO webhook secret is required in production');
      }
      if (!this.config.security.webhookSecret) {
        errors.push('Global webhook secret is required in production');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public logConfigStatus(): void {
    const validation = this.validateConfig();

    console.log('=== Configuration Status ===');
    console.log(`Environment: ${this.config.app.nodeEnv}`);
    console.log(`Base URL: ${this.config.app.baseUrl}`);
    console.log(`Payment Logging: ${this.config.security.enablePaymentLogging ? 'Enabled' : 'Disabled'}`);

    console.log('\n=== Payment Gateways ===');
    console.log(`Mercado Pago: ${this.config.payment.mercadoPago.testMode ? 'Test Mode' : 'Production Mode'}`);
    console.log(`Go Cuotas: ${this.config.payment.goCuotas.testMode ? 'Test Mode' : 'Production Mode'}`);
    console.log(`MODO: ${this.config.payment.modo.testMode ? 'Test Mode' : 'Production Mode'}`);

    if (!validation.isValid) {
      console.warn('\n⚠️  Configuration Issues:');
      validation.errors.forEach(error => console.warn(`  - ${error}`));
    } else {
      console.log('\n✅ Configuration is valid');
    }
  }
}

// Export singleton instance
export const config = ConfigManager.getInstance();

// Helper functions for common configurations
export const getPaymentGatewayConfig = () => config.getPaymentConfig();
export const isTestMode = () => !config.isProduction();
export const validateEnvironment = () => config.validateConfig();
