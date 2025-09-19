import { createHmac, timingSafeEqual } from 'crypto';
import { config } from './config';
import { paymentLogger, LogLevel, PaymentEvent } from './logger';

export interface WebhookValidationResult {
  isValid: boolean;
  error?: string;
  gateway: string;
  timestamp?: number;
}

export interface WebhookHeaders {
  'x-signature'?: string;
  'x-request-id'?: string;
  'mercadopago-signature'?: string;
  'gocuotas-signature'?: string;
  'modo-signature'?: string;
  'x-timestamp'?: string;
  'user-agent'?: string;
  'content-type'?: string;
}

class WebhookSecurityManager {
  private static instance: WebhookSecurityManager;
  private readonly timestampTolerance = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): WebhookSecurityManager {
    if (!WebhookSecurityManager.instance) {
      WebhookSecurityManager.instance = new WebhookSecurityManager();
    }
    return WebhookSecurityManager.instance;
  }

  public async validateMercadoPagoWebhook(
    payload: string,
    headers: WebhookHeaders
  ): Promise<WebhookValidationResult> {
    const gateway = 'mercadopago';

    try {
      const signature = headers['mercadopago-signature'] || headers['x-signature'];
      const requestId = headers['x-request-id'];

      if (!signature) {
        await paymentLogger.log(
          LogLevel.WARN,
          PaymentEvent.WEBHOOK_FAILED,
          gateway,
          { error: 'Missing signature header' }
        );
        return { isValid: false, error: 'Missing signature header', gateway };
      }

      const webhookSecret = config.getConfig().payment.mercadoPago.webhookSecret;
      if (!webhookSecret) {
        await paymentLogger.log(
          LogLevel.ERROR,
          PaymentEvent.CONFIG_ERROR,
          gateway,
          { error: 'Webhook secret not configured' }
        );
        return { isValid: false, error: 'Webhook secret not configured', gateway };
      }

      const sigParts = signature.split(',');
      let timestamp: number | undefined;
      let providedSignature = '';

      for (const part of sigParts) {
        const [key, value] = part.split('=');
        if (key === 'ts') {
          timestamp = parseInt(value);
        } else if (key === 'v1') {
          providedSignature = value;
        }
      }

      if (!timestamp || !providedSignature) {
        return { isValid: false, error: 'Invalid signature format', gateway };
      }

      const now = Math.floor(Date.now() / 1000);
      if (Math.abs(now - timestamp) > this.timestampTolerance / 1000) {
        return { isValid: false, error: 'Request timestamp too old', gateway };
      }

      const signedPayload = `${timestamp}.${requestId}.${payload}`;
      const expectedSignature = createHmac('sha256', webhookSecret)
        .update(signedPayload)
        .digest('hex');

      const isValid = this.secureCompare(providedSignature, expectedSignature);

      if (isValid) {
        await paymentLogger.log(
          LogLevel.INFO,
          PaymentEvent.WEBHOOK_PROCESSED,
          gateway,
          { requestId, metadata: { timestamp } }
        );
      } else {
        await paymentLogger.log(
          LogLevel.WARN,
          PaymentEvent.WEBHOOK_FAILED,
          gateway,
          { error: 'Invalid signature', requestId }
        );
      }

      return { isValid, gateway, timestamp };

    } catch (error) {
      await paymentLogger.logError(gateway, error as Error);
      return { isValid: false, error: (error as Error).message, gateway };
    }
  }

  public async validateWebhook(
    gateway: string,
    payload: string,
    headers: WebhookHeaders
  ): Promise<WebhookValidationResult> {
    await paymentLogger.log(LogLevel.INFO, PaymentEvent.WEBHOOK_RECEIVED, gateway, {
      metadata: {
        payloadSize: payload.length,
        userAgent: headers['user-agent'],
        contentType: headers['content-type']
      }
    });

    switch (gateway.toLowerCase()) {
      case 'mercadopago':
        return this.validateMercadoPagoWebhook(payload, headers);
      default:
        return {
          isValid: false,
          error: `Unsupported gateway: ${gateway}`,
          gateway
        };
    }
  }

  private secureCompare(provided: string, expected: string): boolean {
    if (provided.length !== expected.length) {
      return false;
    }

    const providedBuffer = Buffer.from(provided, 'hex');
    const expectedBuffer = Buffer.from(expected, 'hex');

    return timingSafeEqual(providedBuffer, expectedBuffer);
  }

  private webhookAttempts: Map<string, { count: number; firstAttempt: number }> = new Map();

  public checkRateLimit(
    ipAddress: string,
    maxAttempts: number = 50,
    windowMs: number = 60000
  ): { allowed: boolean; remainingAttempts: number } {
    const now = Date.now();
    const key = ipAddress;

    const attempts = this.webhookAttempts.get(key);

    if (!attempts || now - attempts.firstAttempt > windowMs) {
      this.webhookAttempts.set(key, { count: 1, firstAttempt: now });
      return { allowed: true, remainingAttempts: maxAttempts - 1 };
    }

    if (attempts.count >= maxAttempts) {
      return { allowed: false, remainingAttempts: 0 };
    }

    attempts.count++;
    return { allowed: true, remainingAttempts: maxAttempts - attempts.count };
  }
}

export const webhookSecurity = WebhookSecurityManager.getInstance();
