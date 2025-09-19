import { paymentService, type OrderData, type PaymentResponse } from './paymentService';
import { webhookSecurity } from './webhookSecurity';
import { paymentLogger, LogLevel, PaymentEvent } from './logger';
import { config } from './config';

export interface TestResult {
  gateway: string;
  test: string;
  passed: boolean;
  message: string;
  duration: number;
  details?: any;
}

export interface GatewayTestSuite {
  gateway: string;
  results: TestResult[];
  overallPass: boolean;
  totalTests: number;
  passedTests: number;
  duration: number;
}

export interface PaymentTestReport {
  timestamp: string;
  environment: string;
  gateways: GatewayTestSuite[];
  summary: {
    totalGateways: number;
    totalTests: number;
    passedTests: number;
    failedTests: number;
    overallPass: boolean;
    duration: number;
  };
}

class PaymentTestingService {
  private static instance: PaymentTestingService;

  private constructor() {}

  public static getInstance(): PaymentTestingService {
    if (!PaymentTestingService.instance) {
      PaymentTestingService.instance = new PaymentTestingService();
    }
    return PaymentTestingService.instance;
  }

  /**
   * Run comprehensive tests for all payment gateways
   */
  public async runAllTests(): Promise<PaymentTestReport> {
    const startTime = Date.now();

    console.log('🧪 Starting payment gateway tests...\n');

    const gateways = ['mercadopago', 'gocuotas', 'modo'];
    const gatewayResults: GatewayTestSuite[] = [];

    for (const gateway of gateways) {
      console.log(`Testing ${gateway.toUpperCase()}...`);
      const result = await this.testGateway(gateway);
      gatewayResults.push(result);
      console.log(`${gateway.toUpperCase()}: ${result.passedTests}/${result.totalTests} tests passed\n`);
    }

    const totalDuration = Date.now() - startTime;
    const totalTests = gatewayResults.reduce((sum, g) => sum + g.totalTests, 0);
    const passedTests = gatewayResults.reduce((sum, g) => sum + g.passedTests, 0);

    const report: PaymentTestReport = {
      timestamp: new Date().toISOString(),
      environment: config.isProduction() ? 'production' : 'test',
      gateways: gatewayResults,
      summary: {
        totalGateways: gatewayResults.length,
        totalTests,
        passedTests,
        failedTests: totalTests - passedTests,
        overallPass: passedTests === totalTests,
        duration: totalDuration
      }
    };

    this.printTestReport(report);
    return report;
  }

  /**
   * Test a specific payment gateway
   */
  public async testGateway(gateway: string): Promise<GatewayTestSuite> {
    const startTime = Date.now();
    const results: TestResult[] = [];

    // Test 1: Configuration validation
    results.push(await this.testConfiguration(gateway));

    // Test 2: Payment creation
    results.push(await this.testPaymentCreation(gateway));

    // Test 3: Webhook signature validation
    results.push(await this.testWebhookValidation(gateway));

    // Test 4: Error handling
    results.push(await this.testErrorHandling(gateway));

    // Test 5: Rate limiting
    results.push(await this.testRateLimiting(gateway));

    const duration = Date.now() - startTime;
    const passedTests = results.filter(r => r.passed).length;

    return {
      gateway,
      results,
      overallPass: passedTests === results.length,
      totalTests: results.length,
      passedTests,
      duration
    };
  }

  /**
   * Test configuration validation
   */
  private async testConfiguration(gateway: string): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const paymentConfig = config.getPaymentConfig();
      let hasRequiredConfig = false;
      let configDetails: any = {};

      switch (gateway) {
        case 'mercadopago':
          hasRequiredConfig = !!(paymentConfig.mercadoPago.accessToken &&
                                paymentConfig.mercadoPago.publicKey);
          configDetails = {
            hasAccessToken: !!paymentConfig.mercadoPago.accessToken,
            hasPublicKey: !!paymentConfig.mercadoPago.publicKey,
            testMode: paymentConfig.mercadoPago.testMode
          };
          break;
        case 'gocuotas':
          hasRequiredConfig = !!(paymentConfig.goCuotas.apiKey &&
                               paymentConfig.goCuotas.merchantId);
          configDetails = {
            hasApiKey: !!paymentConfig.goCuotas.apiKey,
            hasMerchantId: !!paymentConfig.goCuotas.merchantId,
            testMode: paymentConfig.goCuotas.testMode
          };
          break;
        case 'modo':
          hasRequiredConfig = !!(paymentConfig.modo.apiKey &&
                               paymentConfig.modo.merchantId);
          configDetails = {
            hasApiKey: !!paymentConfig.modo.apiKey,
            hasMerchantId: !!paymentConfig.modo.merchantId,
            testMode: paymentConfig.modo.testMode
          };
          break;
      }

      return {
        gateway,
        test: 'Configuration Validation',
        passed: hasRequiredConfig,
        message: hasRequiredConfig
          ? 'All required configuration present'
          : 'Missing required configuration',
        duration: Date.now() - startTime,
        details: configDetails
      };
    } catch (error) {
      return {
        gateway,
        test: 'Configuration Validation',
        passed: false,
        message: `Configuration test failed: ${(error as Error).message}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test payment creation
   */
  private async testPaymentCreation(gateway: string): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const testOrder: OrderData = {
        orderId: `TEST-${Date.now()}`,
        amount: 10000,
        currency: 'ARS',
        description: 'Test payment',
        customerInfo: {
          email: 'test@showsport.com',
          name: 'Test Customer',
          phone: '+54 11 1234-5678'
        },
        items: [{
          id: 'test-item',
          title: 'Test Product',
          quantity: 1,
          unitPrice: 10000
        }]
      };

      const response = await paymentService.createPayment(gateway, testOrder);

      const passed = response.success && (!!response.paymentUrl || !!response.deepLink);

      return {
        gateway,
        test: 'Payment Creation',
        passed,
        message: passed
          ? 'Payment created successfully'
          : response.error || 'Payment creation failed',
        duration: Date.now() - startTime,
        details: {
          orderId: testOrder.orderId,
          paymentId: response.paymentId,
          hasPaymentUrl: !!response.paymentUrl,
          hasDeepLink: !!response.deepLink
        }
      };
    } catch (error) {
      return {
        gateway,
        test: 'Payment Creation',
        passed: false,
        message: `Payment creation test failed: ${(error as Error).message}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test webhook signature validation
   */
  private async testWebhookValidation(gateway: string): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const testPayload = JSON.stringify({
        id: 'test-payment-123',
        topic: 'payment',
        action: 'payment.created',
        external_reference: 'TEST-ORDER-123'
      });

      // Get webhook secret for testing
      const paymentConfig = config.getPaymentConfig();
      let webhookSecret = '';

      switch (gateway) {
        case 'mercadopago':
          webhookSecret = paymentConfig.mercadoPago.webhookSecret || 'test-secret';
          break;
        case 'gocuotas':
          webhookSecret = paymentConfig.goCuotas.webhookSecret || 'test-secret';
          break;
        case 'modo':
          webhookSecret = paymentConfig.modo.webhookSecret || 'test-secret';
          break;
      }

      if (!webhookSecret || webhookSecret === 'test-secret') {
        return {
          gateway,
          test: 'Webhook Validation',
          passed: false,
          message: 'Webhook secret not configured',
          duration: Date.now() - startTime
        };
      }

      // Test invalid signature
      const invalidResult = await webhookSecurity.validateWebhook(
        gateway,
        testPayload,
        { 'x-signature': 'invalid-signature' }
      );

      const invalidPassed = !invalidResult.isValid;

      return {
        gateway,
        test: 'Webhook Validation',
        passed: invalidPassed,
        message: invalidPassed
          ? 'Webhook validation working correctly'
          : 'Webhook validation failed to reject invalid signature',
        duration: Date.now() - startTime,
        details: {
          invalidSignatureRejected: !invalidResult.isValid,
          error: invalidResult.error
        }
      };
    } catch (error) {
      return {
        gateway,
        test: 'Webhook Validation',
        passed: false,
        message: `Webhook validation test failed: ${(error as Error).message}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test error handling
   */
  private async testErrorHandling(gateway: string): Promise<TestResult> {
    const startTime = Date.now();

    try {
      // Test with invalid order data
      const invalidOrder: OrderData = {
        orderId: '',
        amount: -100,
        currency: '',
        description: '',
        customerInfo: {
          email: 'invalid-email',
          name: '',
        },
        items: []
      };

      const response = await paymentService.createPayment(gateway, invalidOrder);

      // Should fail gracefully
      const passed = !response.success && !!response.error;

      return {
        gateway,
        test: 'Error Handling',
        passed,
        message: passed
          ? 'Error handling working correctly'
          : 'Error handling not working as expected',
        duration: Date.now() - startTime,
        details: {
          errorMessage: response.error,
          success: response.success
        }
      };
    } catch (error) {
      // If it throws an error, that's also acceptable error handling
      return {
        gateway,
        test: 'Error Handling',
        passed: true,
        message: 'Error properly thrown for invalid input',
        duration: Date.now() - startTime,
        details: {
          errorThrown: (error as Error).message
        }
      };
    }
  }

  /**
   * Test rate limiting
   */
  private async testRateLimiting(gateway: string): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const testIp = '192.168.1.100';

      // Test normal requests
      const firstCheck = webhookSecurity.checkRateLimit(testIp, 5, 60000);
      const secondCheck = webhookSecurity.checkRateLimit(testIp, 5, 60000);

      const passed = firstCheck.allowed &&
                    secondCheck.allowed &&
                    firstCheck.remainingAttempts > secondCheck.remainingAttempts;

      return {
        gateway,
        test: 'Rate Limiting',
        passed,
        message: passed
          ? 'Rate limiting working correctly'
          : 'Rate limiting not working as expected',
        duration: Date.now() - startTime,
        details: {
          firstCheck,
          secondCheck
        }
      };
    } catch (error) {
      return {
        gateway,
        test: 'Rate Limiting',
        passed: false,
        message: `Rate limiting test failed: ${(error as Error).message}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Print detailed test report
   */
  private printTestReport(report: PaymentTestReport): void {
    console.log('🧪 ======== PAYMENT GATEWAY TEST REPORT ========');
    console.log(`📅 Timestamp: ${report.timestamp}`);
    console.log(`🌍 Environment: ${report.environment}`);
    console.log(`⏱️  Total Duration: ${report.summary.duration}ms`);
    console.log(`📊 Overall: ${report.summary.passedTests}/${report.summary.totalTests} tests passed`);
    console.log(`${report.summary.overallPass ? '✅' : '❌'} Overall Status: ${report.summary.overallPass ? 'PASS' : 'FAIL'}\n`);

    for (const gateway of report.gateways) {
      console.log(`🏦 ${gateway.gateway.toUpperCase()} Gateway:`);
      console.log(`   ${gateway.overallPass ? '✅' : '❌'} ${gateway.passedTests}/${gateway.totalTests} tests passed (${gateway.duration}ms)\n`);

      for (const test of gateway.results) {
        const status = test.passed ? '✅' : '❌';
        console.log(`   ${status} ${test.test}: ${test.message} (${test.duration}ms)`);

        if (test.details && !test.passed) {
          console.log(`      Details:`, JSON.stringify(test.details, null, 6));
        }
      }
      console.log('');
    }

    console.log('===============================================\n');
  }

  /**
   * Quick health check for all gateways
   */
  public async quickHealthCheck(): Promise<{ [gateway: string]: boolean }> {
    const gateways = ['mercadopago', 'gocuotas', 'modo'];
    const results: { [gateway: string]: boolean } = {};

    for (const gateway of gateways) {
      try {
        const configTest = await this.testConfiguration(gateway);
        results[gateway] = configTest.passed;
      } catch (error) {
        results[gateway] = false;
      }
    }

    return results;
  }
}

// Export singleton instance
export const paymentTesting = PaymentTestingService.getInstance();

// Helper functions
export const runPaymentTests = () => paymentTesting.runAllTests();
export const testPaymentGateway = (gateway: string) => paymentTesting.testGateway(gateway);
export const checkPaymentHealth = () => paymentTesting.quickHealthCheck();
