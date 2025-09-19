"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  type: 'order_confirmation' | 'stock_alert' | 'welcome' | 'password_reset' | 'shipping_update';
  htmlContent: string;
  textContent: string;
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  template: string;
  status: 'sent' | 'failed' | 'pending';
  sentAt: string;
  metadata?: Record<string, any>;
}

interface EmailState {
  templates: EmailTemplate[];
  emailLogs: EmailLog[];
  isLoading: boolean;
}

type EmailAction =
  | { type: 'ADD_EMAIL_LOG'; payload: EmailLog }
  | { type: 'UPDATE_EMAIL_STATUS'; payload: { emailId: string; status: 'sent' | 'failed' } }
  | { type: 'SET_LOADING'; payload: boolean };

const emailTemplates: EmailTemplate[] = [
  {
    id: 'order_confirmation',
    name: 'Confirmación de Pedido',
    subject: 'Confirmación de tu pedido #{orderNumber} - Showsport',
    type: 'order_confirmation',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">¡Gracias por tu compra!</h1>
        </div>

        <div style="padding: 20px; background: white;">
          <h2 style="color: #333;">Hola {customerName},</h2>
          <p style="color: #666; line-height: 1.6;">
            Hemos recibido tu pedido <strong>#{orderNumber}</strong> y lo estamos preparando para el envío.
          </p>

          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Detalles del Pedido</h3>
            <p><strong>Número de pedido:</strong> #{orderNumber}</p>
            <p><strong>Fecha:</strong> {orderDate}</p>
            <p><strong>Total:</strong> {orderTotal}</p>
          </div>

          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Dirección de Envío</h3>
            <p>{shippingAddress}</p>
          </div>

          <p style="color: #666; line-height: 1.6;">
            Te enviaremos otro email cuando tu pedido esté en camino.
            Si tienes alguna pregunta, no dudes en contactarnos.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="{trackingUrl}" style="background: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Seguir mi pedido
            </a>
          </div>
        </div>

        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p>© 2024 Showsport - Todos los derechos reservados</p>
        </div>
      </div>
    `,
    textContent: `
      ¡Gracias por tu compra!

      Hola {customerName},

      Hemos recibido tu pedido #{orderNumber} y lo estamos preparando para el envío.

      Detalles del Pedido:
      - Número de pedido: #{orderNumber}
      - Fecha: {orderDate}
      - Total: {orderTotal}

      Dirección de Envío:
      {shippingAddress}

      Te enviaremos otro email cuando tu pedido esté en camino.

      © 2024 Showsport - Todos los derechos reservados
    `
  },
  {
    id: 'stock_alert',
    name: 'Alerta de Stock Bajo',
    subject: 'Alerta: Stock bajo para {productName} - Showsport Admin',
    type: 'stock_alert',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #FEF3C7; border: 1px solid #F59E0B; padding: 15px; border-radius: 8px;">
          <h2 style="color: #92400E; margin: 0; display: flex; align-items: center;">
            ⚠️ Alerta de Stock Bajo
          </h2>
        </div>

        <div style="padding: 20px; background: white;">
          <p style="color: #333; font-size: 16px;">
            El producto <strong>{productName}</strong> tiene stock bajo y requiere atención inmediata.
          </p>

          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Detalles del Producto</h3>
            <p><strong>Producto:</strong> {productName}</p>
            <p><strong>SKU:</strong> {productSku}</p>
            <p><strong>Stock actual:</strong> {currentStock} unidades</p>
            <p><strong>Umbral mínimo:</strong> {threshold} unidades</p>
            <p><strong>Estado:</strong> <span style="color: {alertColor};">{alertSeverity}</span></p>
          </div>

          <p style="color: #666;">
            Se recomienda reabastecer este producto lo antes posible para evitar quedarse sin stock.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="{adminUrl}" style="background: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Ver en Panel Admin
            </a>
          </div>
        </div>
      </div>
    `,
    textContent: `
      ⚠️ Alerta de Stock Bajo

      El producto {productName} tiene stock bajo y requiere atención inmediata.

      Detalles del Producto:
      - Producto: {productName}
      - SKU: {productSku}
      - Stock actual: {currentStock} unidades
      - Umbral mínimo: {threshold} unidades
      - Estado: {alertSeverity}

      Se recomienda reabastecer este producto lo antes posible para evitar quedarse sin stock.
    `
  },
  {
    id: 'shipping_update',
    name: 'Actualización de Envío',
    subject: 'Tu pedido #{orderNumber} está en camino - Showsport',
    type: 'shipping_update',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">¡Tu pedido está en camino! 📦</h1>
        </div>

        <div style="padding: 20px; background: white;">
          <h2 style="color: #333;">Hola {customerName},</h2>
          <p style="color: #666; line-height: 1.6;">
            ¡Buenas noticias! Tu pedido <strong>#{orderNumber}</strong> ha sido enviado y está en camino.
          </p>

          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3B82F6;">
            <h3 style="margin-top: 0; color: #1E40AF;">Información de Seguimiento</h3>
            <p><strong>Número de seguimiento:</strong> {trackingNumber}</p>
            <p><strong>Transportista:</strong> {carrier}</p>
            <p><strong>Fecha estimada de entrega:</strong> {estimatedDelivery}</p>
          </div>

          <p style="color: #666; line-height: 1.6;">
            Puedes seguir el estado de tu envío haciendo clic en el botón de abajo.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="{trackingUrl}" style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Seguir mi envío
            </a>
          </div>
        </div>
      </div>
    `,
    textContent: `
      ¡Tu pedido está en camino!

      Hola {customerName},

      ¡Buenas noticias! Tu pedido #{orderNumber} ha sido enviado y está en camino.

      Información de Seguimiento:
      - Número de seguimiento: {trackingNumber}
      - Transportista: {carrier}
      - Fecha estimada de entrega: {estimatedDelivery}

      Puedes seguir el estado de tu envío en nuestro sitio web.
    `
  }
];

const initialState: EmailState = {
  templates: emailTemplates,
  emailLogs: [],
  isLoading: false
};

function emailReducer(state: EmailState, action: EmailAction): EmailState {
  switch (action.type) {
    case 'ADD_EMAIL_LOG':
      return {
        ...state,
        emailLogs: [action.payload, ...state.emailLogs]
      };

    case 'UPDATE_EMAIL_STATUS': {
      const updatedLogs = state.emailLogs.map(log =>
        log.id === action.payload.emailId
          ? { ...log, status: action.payload.status }
          : log
      );
      return { ...state, emailLogs: updatedLogs };
    }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    default:
      return state;
  }
}

const EmailContext = createContext<{
  state: EmailState;
  dispatch: React.Dispatch<EmailAction>;
  sendEmail: (type: string, to: string, variables: Record<string, any>) => Promise<boolean>;
  sendOrderConfirmation: (orderData: any) => Promise<boolean>;
  sendStockAlert: (productData: any, adminEmail: string) => Promise<boolean>;
  sendShippingUpdate: (orderData: any) => Promise<boolean>;
} | null>(null);

export function EmailProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(emailReducer, initialState);

  const replaceVariables = (template: string, variables: Record<string, any>): string => {
    let result = template;
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{${key}}`, 'g');
      result = result.replace(regex, variables[key] || '');
    });
    return result;
  };

  const sendEmail = async (type: string, to: string, variables: Record<string, any>): Promise<boolean> => {
    const template = state.templates.find(t => t.id === type);
    if (!template) return false;

    const emailLog: EmailLog = {
      id: Date.now().toString(),
      to,
      subject: replaceVariables(template.subject, variables),
      template: template.name,
      status: 'pending',
      sentAt: new Date().toISOString(),
      metadata: variables
    };

    dispatch({ type: 'ADD_EMAIL_LOG', payload: emailLog });

    // Mock email sending - in production, this would integrate with SendGrid, Mailgun, etc.
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      dispatch({
        type: 'UPDATE_EMAIL_STATUS',
        payload: {
          emailId: emailLog.id,
          status: success ? 'sent' : 'failed'
        }
      });
    }, 1000);

    console.log('📧 Email sent:', {
      to,
      subject: emailLog.subject,
      template: template.name,
      variables
    });

    return true;
  };

  const sendOrderConfirmation = async (orderData: {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    orderDate: string;
    orderTotal: string;
    shippingAddress: string;
  }): Promise<boolean> => {
    return sendEmail('order_confirmation', orderData.customerEmail, {
      customerName: orderData.customerName,
      orderNumber: orderData.orderNumber,
      orderDate: orderData.orderDate,
      orderTotal: orderData.orderTotal,
      shippingAddress: orderData.shippingAddress,
      trackingUrl: `${window.location.origin}/pedidos/${orderData.orderNumber}`
    });
  };

  const sendStockAlert = async (productData: {
    productName: string;
    productSku: string;
    currentStock: number;
    threshold: number;
    alertSeverity: string;
  }, adminEmail: string): Promise<boolean> => {
    const alertColors = {
      'low': '#F59E0B',
      'critical': '#EF4444',
      'out_of_stock': '#DC2626'
    };

    return sendEmail('stock_alert', adminEmail, {
      productName: productData.productName,
      productSku: productData.productSku,
      currentStock: productData.currentStock,
      threshold: productData.threshold,
      alertSeverity: productData.alertSeverity,
      alertColor: alertColors[productData.alertSeverity as keyof typeof alertColors] || '#F59E0B',
      adminUrl: `${window.location.origin}/admin`
    });
  };

  const sendShippingUpdate = async (orderData: {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    trackingNumber: string;
    carrier: string;
    estimatedDelivery: string;
  }): Promise<boolean> => {
    return sendEmail('shipping_update', orderData.customerEmail, {
      customerName: orderData.customerName,
      orderNumber: orderData.orderNumber,
      trackingNumber: orderData.trackingNumber,
      carrier: orderData.carrier,
      estimatedDelivery: orderData.estimatedDelivery,
      trackingUrl: `${window.location.origin}/seguimiento/${orderData.trackingNumber}`
    });
  };

  return (
    <EmailContext.Provider value={{
      state,
      dispatch,
      sendEmail,
      sendOrderConfirmation,
      sendStockAlert,
      sendShippingUpdate
    }}>
      {children}
    </EmailContext.Provider>
  );
}

export function useEmail() {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error('useEmail must be used within an EmailProvider');
  }
  return context;
}
