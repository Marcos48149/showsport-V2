"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface ReturnRequest {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  type: 'change' | 'return';
  resolution: 'coupon' | 'refund';
  status: 'pending' | 'approved' | 'shipped' | 'received' | 'completed' | 'rejected';
  reason: string;
  items: Array<{
    productId: string;
    productName: string;
    productImage: string;
    size: string;
    quantity: number;
    price: number;
    reason: string;
  }>;
  couponCode?: string;
  couponAmount?: number;
  refundAmount?: number;
  shippingLabel?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  photos?: string[];
}

export interface ReturnNotification {
  id: string;
  returnId: string;
  type: 'email' | 'sms' | 'whatsapp';
  status: 'sent' | 'pending' | 'failed';
  content: string;
  sentAt?: string;
}

interface ReturnsState {
  requests: ReturnRequest[];
  notifications: ReturnNotification[];
  isLoading: boolean;
  error: string | null;
}

type ReturnsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_REQUEST'; payload: ReturnRequest }
  | { type: 'UPDATE_REQUEST'; payload: { id: string; updates: Partial<ReturnRequest> } }
  | { type: 'SET_REQUESTS'; payload: ReturnRequest[] }
  | { type: 'ADD_NOTIFICATION'; payload: ReturnNotification }
  | { type: 'SET_NOTIFICATIONS'; payload: ReturnNotification[] };

const initialState: ReturnsState = {
  requests: [],
  notifications: [],
  isLoading: false,
  error: null
};

function returnsReducer(state: ReturnsState, action: ReturnsAction): ReturnsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_REQUEST':
      return { ...state, requests: [action.payload, ...state.requests] };
    case 'UPDATE_REQUEST':
      return {
        ...state,
        requests: state.requests.map(request =>
          request.id === action.payload.id
            ? { ...request, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : request
        )
      };
    case 'SET_REQUESTS':
      return { ...state, requests: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    default:
      return state;
  }
}

const ReturnsContext = createContext<{
  state: ReturnsState;
  dispatch: React.Dispatch<ReturnsAction>;
  submitReturnRequest: (request: Omit<ReturnRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<ReturnRequest>;
  generateCoupon: (returnId: string, amount: number) => Promise<string>;
  processRefund: (returnId: string, amount: number) => Promise<boolean>;
  updateReturnStatus: (returnId: string, status: ReturnRequest['status'], notes?: string) => Promise<void>;
  sendNotification: (returnId: string, type: 'email' | 'sms' | 'whatsapp', content: string) => Promise<void>;
  validateOrder: (orderNumber: string, email: string) => Promise<{ valid: boolean; orderData?: any }>;
  generateShippingLabel: (returnId: string) => Promise<string>;
} | null>(null);

export function ReturnsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(returnsReducer, initialState);

  const submitReturnRequest = async (
    requestData: Omit<ReturnRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<ReturnRequest> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const newRequest: ReturnRequest = {
        ...requestData,
        id: `RET-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // If it's a change with coupon, generate coupon immediately
      if (requestData.type === 'change' && requestData.resolution === 'coupon') {
        const couponCode = await generateCoupon(newRequest.id, requestData.items.reduce((total, item) => total + (item.price * item.quantity), 0));
        newRequest.couponCode = couponCode;
        newRequest.couponAmount = requestData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        newRequest.status = 'approved';
      }

      dispatch({ type: 'ADD_REQUEST', payload: newRequest });

      // Send initial notification
      await sendNotification(newRequest.id, 'email', 'Su solicitud de cambio/devolución ha sido recibida');

      return newRequest;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al procesar la solicitud' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const generateCoupon = async (returnId: string, amount: number): Promise<string> => {
    try {
      // Generate unique coupon code
      const couponCode = `CAMBIO-${Date.now().toString().slice(-6)}`;

      // Simulate API call to create coupon in system
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update request with coupon info
      dispatch({
        type: 'UPDATE_REQUEST',
        payload: {
          id: returnId,
          updates: {
            couponCode,
            couponAmount: amount,
            status: 'approved'
          }
        }
      });

      // Send coupon notification
      await sendNotification(returnId, 'email', `Su cupón de cambio ${couponCode} por $${amount.toLocaleString()} ha sido generado`);

      return couponCode;
    } catch (error) {
      throw new Error('Error al generar el cupón');
    }
  };

  const processRefund = async (returnId: string, amount: number): Promise<boolean> => {
    try {
      // Simulate refund processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      dispatch({
        type: 'UPDATE_REQUEST',
        payload: {
          id: returnId,
          updates: {
            refundAmount: amount,
            status: 'completed'
          }
        }
      });

      await sendNotification(returnId, 'email', `Su reembolso de $${amount.toLocaleString()} ha sido procesado`);

      return true;
    } catch (error) {
      throw new Error('Error al procesar el reembolso');
    }
  };

  const updateReturnStatus = async (
    returnId: string,
    status: ReturnRequest['status'],
    notes?: string
  ): Promise<void> => {
    try {
      dispatch({
        type: 'UPDATE_REQUEST',
        payload: {
          id: returnId,
          updates: { status, notes }
        }
      });

      // Send status update notification
      const statusMessages = {
        pending: 'Su solicitud está pendiente de revisión',
        approved: 'Su solicitud ha sido aprobada',
        shipped: 'Hemos recibido su producto en camino',
        received: 'Hemos recibido su producto en nuestro depósito',
        completed: 'Su solicitud ha sido completada',
        rejected: 'Su solicitud ha sido rechazada'
      };

      await sendNotification(returnId, 'email', statusMessages[status]);
    } catch (error) {
      throw new Error('Error al actualizar el estado');
    }
  };

  const sendNotification = async (
    returnId: string,
    type: 'email' | 'sms' | 'whatsapp',
    content: string
  ): Promise<void> => {
    try {
      const notification: ReturnNotification = {
        id: `NOT-${Date.now()}`,
        returnId,
        type,
        status: 'pending',
        content
      };

      // Simulate sending notification
      await new Promise(resolve => setTimeout(resolve, 500));

      notification.status = 'sent';
      notification.sentAt = new Date().toISOString();

      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    } catch (error) {
      const notification: ReturnNotification = {
        id: `NOT-${Date.now()}`,
        returnId,
        type,
        status: 'failed',
        content
      };
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    }
  };

  const validateOrder = async (orderNumber: string, email: string): Promise<{ valid: boolean; orderData?: any }> => {
    try {
      // Simulate order validation
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation - in real app, this would check against database
      const mockOrderData = {
        orderNumber,
        customerEmail: email,
        customerName: 'Juan Pérez',
        items: [
          {
            productId: '1',
            productName: 'Adidas Ultraboost 22',
            productImage: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/8ea578f6c07847fca2e0af4901531b95_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg',
            size: '42',
            quantity: 1,
            price: 149000
          }
        ],
        total: 149000,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
      };

      return { valid: true, orderData: mockOrderData };
    } catch (error) {
      return { valid: false };
    }
  };

  const generateShippingLabel = async (returnId: string): Promise<string> => {
    try {
      // Generate tracking number
      const trackingNumber = `AR${Date.now().toString().slice(-8)}`;

      // Simulate label generation
      await new Promise(resolve => setTimeout(resolve, 1000));

      const labelUrl = `https://shipping.andreani.com/label/${trackingNumber}`;

      dispatch({
        type: 'UPDATE_REQUEST',
        payload: {
          id: returnId,
          updates: {
            shippingLabel: labelUrl,
            trackingNumber,
            status: 'shipped'
          }
        }
      });

      await sendNotification(returnId, 'email', `Su etiqueta de envío está lista. Número de seguimiento: ${trackingNumber}`);

      return labelUrl;
    } catch (error) {
      throw new Error('Error al generar la etiqueta de envío');
    }
  };

  return (
    <ReturnsContext.Provider value={{
      state,
      dispatch,
      submitReturnRequest,
      generateCoupon,
      processRefund,
      updateReturnStatus,
      sendNotification,
      validateOrder,
      generateShippingLabel
    }}>
      {children}
    </ReturnsContext.Provider>
  );
}

export function useReturns() {
  const context = useContext(ReturnsContext);
  if (!context) {
    throw new Error('useReturns must be used within a ReturnsProvider');
  }
  return context;
}
