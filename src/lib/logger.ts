export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export enum PaymentEvent {
  PAYMENT_INITIATED = 'payment_initiated',
  PAYMENT_PENDING = 'payment_pending',
  PAYMENT_APPROVED = 'payment_approved',
  PAYMENT_REJECTED = 'payment_rejected',
  PAYMENT_CANCELLED = 'payment_cancelled',
  PAYMENT_REFUNDED = 'payment_refunded',
  WEBHOOK_RECEIVED = 'webhook_received',
  WEBHOOK_PROCESSED = 'webhook_processed',
  WEBHOOK_FAILED = 'webhook_failed',
  ORDER_CREATED = 'order_created',
  ORDER_UPDATED = 'order_updated',
  REDIRECT_INITIATED = 'redirect_initiated',
  CONFIG_ERROR = 'config_error',
  API_ERROR = 'api_error'
}

export interface PaymentLogEntry {
  id?: string;
  timestamp: string;
  level: LogLevel;
  event: PaymentEvent;
  gateway: string;
  orderId?: string;
  paymentId?: string;
  customerId?: string;
  amount?: number;
  currency?: string;
  status?: string;
  metadata?: Record<string, any>;
  error?: string;
  requestId?: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface PaymentTransaction {
  id?: string;
  orderId: string;
  paymentId: string;
  gateway: string;
  customerId: string;
  customerEmail: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded';
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
  };
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  failureReason?: string;
  webhookEvents?: PaymentLogEntry[];
}

class PaymentLogger {
  private static instance: PaymentLogger;
  private logLevel: LogLevel;
  private enableDbLogging: boolean;

  private constructor() {
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO;
    this.enableDbLogging = process.env.ENABLE_PAYMENT_LOGGING === 'true';
  }

  public static getInstance(): PaymentLogger {
    if (!PaymentLogger.instance) {
      PaymentLogger.instance = new PaymentLogger();
    }
    return PaymentLogger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
    const currentIndex = levels.indexOf(this.logLevel);
    const messageIndex = levels.indexOf(level);
    return messageIndex <= currentIndex;
  }

  private formatLogMessage(entry: PaymentLogEntry): string {
    const { timestamp, level, event, gateway, orderId, paymentId, error } = entry;

    let message = `[${timestamp}] ${level.toUpperCase()} [${gateway}] ${event}`;

    if (orderId) message += ` | Order: ${orderId}`;
    if (paymentId) message += ` | Payment: ${paymentId}`;
    if (error) message += ` | Error: ${error}`;

    return message;
  }

  private async saveToDatabase(entry: PaymentLogEntry): Promise<void> {
    if (!this.enableDbLogging) return;

    try {
      // En un entorno real, aquí conectarías con tu base de datos
      // Por ahora, simularemos el almacenamiento
      console.log('💾 Saving to database:', entry);

      // Ejemplo de implementación con Prisma:
      /*
      await prisma.paymentLog.create({
        data: {
          timestamp: entry.timestamp,
          level: entry.level,
          event: entry.event,
          gateway: entry.gateway,
          orderId: entry.orderId,
          paymentId: entry.paymentId,
          customerId: entry.customerId,
          amount: entry.amount,
          currency: entry.currency,
          status: entry.status,
          metadata: entry.metadata || {},
          error: entry.error,
          requestId: entry.requestId,
          userAgent: entry.userAgent,
          ipAddress: entry.ipAddress
        }
      });
      */
    } catch (error) {
      console.error('Failed to save log to database:', error);
    }
  }

  public async log(
    level: LogLevel,
    event: PaymentEvent,
    gateway: string,
    data: Partial<PaymentLogEntry> = {}
  ): Promise<void> {
    if (!this.shouldLog(level)) return;

    const entry: PaymentLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      event,
      gateway,
      ...data
    };

    // Console logging
    const message = this.formatLogMessage(entry);

    switch (level) {
      case LogLevel.ERROR:
        console.error(message, entry.metadata);
        break;
      case LogLevel.WARN:
        console.warn(message, entry.metadata);
        break;
      case LogLevel.INFO:
        console.info(message, entry.metadata);
        break;
      case LogLevel.DEBUG:
        console.debug(message, entry.metadata);
        break;
    }

    // Database logging
    await this.saveToDatabase(entry);
  }

  public async logPaymentInitiated(
    gateway: string,
    orderId: string,
    amount: number,
    customerId: string
  ): Promise<void> {
    await this.log(LogLevel.INFO, PaymentEvent.PAYMENT_INITIATED, gateway, {
      orderId,
      amount,
      customerId,
      metadata: { initiatedAt: new Date().toISOString() }
    });
  }

  public async logPaymentStatusChange(
    gateway: string,
    orderId: string,
    paymentId: string,
    oldStatus: string,
    newStatus: string
  ): Promise<void> {
    const event = this.getEventFromStatus(newStatus);

    await this.log(LogLevel.INFO, event, gateway, {
      orderId,
      paymentId,
      status: newStatus,
      metadata: {
        oldStatus,
        newStatus,
        changedAt: new Date().toISOString()
      }
    });
  }

  public async logWebhookReceived(
    gateway: string,
    payload: any,
    headers: Record<string, string>
  ): Promise<void> {
    await this.log(LogLevel.INFO, PaymentEvent.WEBHOOK_RECEIVED, gateway, {
      metadata: {
        payloadSize: JSON.stringify(payload).length,
        headers: headers,
        receivedAt: new Date().toISOString()
      }
    });
  }

  public async logError(
    gateway: string,
    error: Error,
    context: Partial<PaymentLogEntry> = {}
  ): Promise<void> {
    await this.log(LogLevel.ERROR, PaymentEvent.API_ERROR, gateway, {
      ...context,
      error: error.message,
      metadata: {
        ...context.metadata,
        stack: error.stack,
        errorAt: new Date().toISOString()
      }
    });
  }

  private getEventFromStatus(status: string): PaymentEvent {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'success':
        return PaymentEvent.PAYMENT_APPROVED;
      case 'pending':
        return PaymentEvent.PAYMENT_PENDING;
      case 'rejected':
      case 'failed':
        return PaymentEvent.PAYMENT_REJECTED;
      case 'cancelled':
        return PaymentEvent.PAYMENT_CANCELLED;
      case 'refunded':
        return PaymentEvent.PAYMENT_REFUNDED;
      default:
        return PaymentEvent.PAYMENT_PENDING;
    }
  }

  // Transaction tracking methods
  public async saveTransaction(transaction: PaymentTransaction): Promise<void> {
    if (!this.enableDbLogging) return;

    try {
      console.log('💳 Saving transaction:', transaction);

      // En producción, aquí guardarías en tu base de datos
      /*
      await prisma.paymentTransaction.create({
        data: {
          orderId: transaction.orderId,
          paymentId: transaction.paymentId,
          gateway: transaction.gateway,
          customerId: transaction.customerId,
          customerEmail: transaction.customerEmail,
          amount: transaction.amount,
          currency: transaction.currency,
          status: transaction.status,
          items: transaction.items,
          shippingAddress: transaction.shippingAddress,
          metadata: transaction.metadata,
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt
        }
      });
      */
    } catch (error) {
      console.error('Failed to save transaction:', error);
    }
  }

  public async updateTransactionStatus(
    orderId: string,
    status: PaymentTransaction['status'],
    metadata: Record<string, any> = {}
  ): Promise<void> {
    if (!this.enableDbLogging) return;

    try {
      console.log(`🔄 Updating transaction ${orderId} to ${status}`);

      // En producción:
      /*
      await prisma.paymentTransaction.update({
        where: { orderId },
        data: {
          status,
          updatedAt: new Date().toISOString(),
          processedAt: status === 'approved' ? new Date().toISOString() : undefined,
          metadata: {
            ...metadata,
            statusHistory: {
              push: {
                status,
                changedAt: new Date().toISOString()
              }
            }
          }
        }
      });
      */
    } catch (error) {
      console.error('Failed to update transaction:', error);
    }
  }

  // Analytics and reporting methods
  public async getTransactionStats(
    gateway?: string,
    startDate?: string,
    endDate?: string
  ): Promise<any> {
    // En producción, esto consultaría tu base de datos
    return {
      totalTransactions: 0,
      successfulPayments: 0,
      failedPayments: 0,
      totalAmount: 0,
      averageOrderValue: 0,
      gatewayBreakdown: {}
    };
  }
}

// Export singleton instance
export const paymentLogger = PaymentLogger.getInstance();

// Helper functions
export const logPaymentEvent = (
  level: LogLevel,
  event: PaymentEvent,
  gateway: string,
  data?: Partial<PaymentLogEntry>
) => paymentLogger.log(level, event, gateway, data);

export const logPaymentError = (
  gateway: string,
  error: Error,
  context?: Partial<PaymentLogEntry>
) => paymentLogger.logError(gateway, error, context);
