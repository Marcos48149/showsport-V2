"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface InventoryItem {
  productId: number;
  sku: string;
  stock: number;
  reserved: number;
  lowStockThreshold: number;
  lastUpdated: string;
  location: string;
  supplier?: string;
}

export interface StockMovement {
  id: string;
  productId: number;
  type: 'in' | 'out' | 'adjustment' | 'reserved' | 'unreserved';
  quantity: number;
  reason: string;
  date: string;
  userId: string;
  orderId?: string;
}

export interface LowStockAlert {
  id: string;
  productId: number;
  productName: string;
  currentStock: number;
  threshold: number;
  severity: 'low' | 'critical' | 'out_of_stock';
  date: string;
  acknowledged: boolean;
}

interface InventoryState {
  inventory: InventoryItem[];
  movements: StockMovement[];
  alerts: LowStockAlert[];
  isLoading: boolean;
}

type InventoryAction =
  | { type: 'SET_INVENTORY'; payload: InventoryItem[] }
  | { type: 'UPDATE_STOCK'; payload: { productId: number; quantity: number; reason: string; userId: string } }
  | { type: 'RESERVE_STOCK'; payload: { productId: number; quantity: number; orderId: string } }
  | { type: 'UNRESERVE_STOCK'; payload: { productId: number; quantity: number; orderId: string } }
  | { type: 'ADD_MOVEMENT'; payload: StockMovement }
  | { type: 'ADD_ALERT'; payload: LowStockAlert }
  | { type: 'ACKNOWLEDGE_ALERT'; payload: { alertId: string } }
  | { type: 'SET_LOADING'; payload: boolean };

const initialInventory: InventoryItem[] = [
  {
    productId: 1,
    sku: 'ADI-UB22-001',
    stock: 25,
    reserved: 3,
    lowStockThreshold: 10,
    lastUpdated: new Date().toISOString(),
    location: 'Warehouse A',
    supplier: 'Adidas Argentina'
  },
  {
    productId: 2,
    sku: 'NIK-AM270-001',
    stock: 8,
    reserved: 2,
    lowStockThreshold: 10,
    lastUpdated: new Date().toISOString(),
    location: 'Warehouse A',
    supplier: 'Nike Argentina'
  },
  {
    productId: 3,
    sku: 'PUM-RSX-001',
    stock: 3,
    reserved: 1,
    lowStockThreshold: 5,
    lastUpdated: new Date().toISOString(),
    location: 'Warehouse B',
    supplier: 'Puma Argentina'
  },
  {
    productId: 4,
    sku: 'NIK-LEB20-001',
    stock: 15,
    reserved: 1,
    lowStockThreshold: 8,
    lastUpdated: new Date().toISOString(),
    location: 'Warehouse A',
    supplier: 'Nike Argentina'
  },
  {
    productId: 5,
    sku: 'ADI-DAME8-001',
    stock: 12,
    reserved: 2,
    lowStockThreshold: 10,
    lastUpdated: new Date().toISOString(),
    location: 'Warehouse B',
    supplier: 'Adidas Argentina'
  },
  {
    productId: 6,
    sku: 'NIK-PEG40-001',
    stock: 18,
    reserved: 0,
    lowStockThreshold: 12,
    lastUpdated: new Date().toISOString(),
    location: 'Warehouse A',
    supplier: 'Nike Argentina'
  }
];

const initialState: InventoryState = {
  inventory: initialInventory,
  movements: [],
  alerts: [],
  isLoading: false
};

function inventoryReducer(state: InventoryState, action: InventoryAction): InventoryState {
  switch (action.type) {
    case 'SET_INVENTORY':
      return { ...state, inventory: action.payload };

    case 'UPDATE_STOCK': {
      const { productId, quantity, reason, userId } = action.payload;

      const updatedInventory = state.inventory.map(item => {
        if (item.productId === productId) {
          const newStock = Math.max(0, item.stock + quantity);
          return {
            ...item,
            stock: newStock,
            lastUpdated: new Date().toISOString()
          };
        }
        return item;
      });

      // Add movement record
      const movement: StockMovement = {
        id: Date.now().toString(),
        productId,
        type: quantity > 0 ? 'in' : 'out',
        quantity: Math.abs(quantity),
        reason,
        date: new Date().toISOString(),
        userId
      };

      return {
        ...state,
        inventory: updatedInventory,
        movements: [movement, ...state.movements]
      };
    }

    case 'RESERVE_STOCK': {
      const { productId, quantity, orderId } = action.payload;

      const updatedInventory = state.inventory.map(item => {
        if (item.productId === productId) {
          const availableStock = item.stock - item.reserved;
          if (availableStock >= quantity) {
            return {
              ...item,
              reserved: item.reserved + quantity,
              lastUpdated: new Date().toISOString()
            };
          }
        }
        return item;
      });

      const movement: StockMovement = {
        id: Date.now().toString(),
        productId,
        type: 'reserved',
        quantity,
        reason: 'Stock reserved for order',
        date: new Date().toISOString(),
        userId: 'system',
        orderId
      };

      return {
        ...state,
        inventory: updatedInventory,
        movements: [movement, ...state.movements]
      };
    }

    case 'UNRESERVE_STOCK': {
      const { productId, quantity, orderId } = action.payload;

      const updatedInventory = state.inventory.map(item => {
        if (item.productId === productId) {
          return {
            ...item,
            reserved: Math.max(0, item.reserved - quantity),
            lastUpdated: new Date().toISOString()
          };
        }
        return item;
      });

      const movement: StockMovement = {
        id: Date.now().toString(),
        productId,
        type: 'unreserved',
        quantity,
        reason: 'Stock unreserved from cancelled order',
        date: new Date().toISOString(),
        userId: 'system',
        orderId
      };

      return {
        ...state,
        inventory: updatedInventory,
        movements: [movement, ...state.movements]
      };
    }

    case 'ADD_MOVEMENT':
      return {
        ...state,
        movements: [action.payload, ...state.movements]
      };

    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [action.payload, ...state.alerts]
      };

    case 'ACKNOWLEDGE_ALERT': {
      const updatedAlerts = state.alerts.map(alert =>
        alert.id === action.payload.alertId
          ? { ...alert, acknowledged: true }
          : alert
      );
      return { ...state, alerts: updatedAlerts };
    }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    default:
      return state;
  }
}

const InventoryContext = createContext<{
  state: InventoryState;
  dispatch: React.Dispatch<InventoryAction>;
  getProductStock: (productId: number) => { available: number; reserved: number; total: number };
  checkStock: (productId: number, quantity: number) => boolean;
  reserveStock: (productId: number, quantity: number, orderId: string) => boolean;
  unreserveStock: (productId: number, quantity: number, orderId: string) => void;
  updateStock: (productId: number, quantity: number, reason: string, userId: string) => void;
  getLowStockAlerts: () => LowStockAlert[];
  acknowledgeAlert: (alertId: string) => void;
} | null>(null);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(inventoryReducer, initialState);

  // Check for low stock and generate alerts
  useEffect(() => {
    const checkLowStock = () => {
      const productNames: Record<number, string> = {
        1: 'Adidas Ultraboost 22',
        2: 'Nike Air Max 270',
        3: 'Puma RS-X Efekt',
        4: 'Nike LeBron 20',
        5: 'Adidas Dame 8',
        6: 'Nike Pegasus 40'
      };

      state.inventory.forEach(item => {
        const availableStock = item.stock - item.reserved;
        const existingAlert = state.alerts.find(
          alert => alert.productId === item.productId && !alert.acknowledged
        );

        let severity: 'low' | 'critical' | 'out_of_stock' | null = null;

        if (availableStock === 0) {
          severity = 'out_of_stock';
        } else if (availableStock <= item.lowStockThreshold / 2) {
          severity = 'critical';
        } else if (availableStock <= item.lowStockThreshold) {
          severity = 'low';
        }

        if (severity && !existingAlert) {
          const alert: LowStockAlert = {
            id: `alert-${item.productId}-${Date.now()}`,
            productId: item.productId,
            productName: productNames[item.productId] || `Product ${item.productId}`,
            currentStock: availableStock,
            threshold: item.lowStockThreshold,
            severity,
            date: new Date().toISOString(),
            acknowledged: false
          };

          dispatch({ type: 'ADD_ALERT', payload: alert });
        }
      });
    };

    const interval = setInterval(checkLowStock, 30000); // Check every 30 seconds
    checkLowStock(); // Initial check

    return () => clearInterval(interval);
  }, [state.inventory, state.alerts]);

  const getProductStock = (productId: number) => {
    const item = state.inventory.find(inv => inv.productId === productId);
    if (!item) return { available: 0, reserved: 0, total: 0 };

    return {
      available: item.stock - item.reserved,
      reserved: item.reserved,
      total: item.stock
    };
  };

  const checkStock = (productId: number, quantity: number): boolean => {
    const stock = getProductStock(productId);
    return stock.available >= quantity;
  };

  const reserveStock = (productId: number, quantity: number, orderId: string): boolean => {
    if (!checkStock(productId, quantity)) return false;

    dispatch({
      type: 'RESERVE_STOCK',
      payload: { productId, quantity, orderId }
    });
    return true;
  };

  const unreserveStock = (productId: number, quantity: number, orderId: string) => {
    dispatch({
      type: 'UNRESERVE_STOCK',
      payload: { productId, quantity, orderId }
    });
  };

  const updateStock = (productId: number, quantity: number, reason: string, userId: string) => {
    dispatch({
      type: 'UPDATE_STOCK',
      payload: { productId, quantity, reason, userId }
    });
  };

  const getLowStockAlerts = (): LowStockAlert[] => {
    return state.alerts
      .filter(alert => !alert.acknowledged)
      .sort((a, b) => {
        const severityOrder = { out_of_stock: 3, critical: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      });
  };

  const acknowledgeAlert = (alertId: string) => {
    dispatch({ type: 'ACKNOWLEDGE_ALERT', payload: { alertId } });
  };

  return (
    <InventoryContext.Provider value={{
      state,
      dispatch,
      getProductStock,
      checkStock,
      reserveStock,
      unreserveStock,
      updateStock,
      getLowStockAlerts,
      acknowledgeAlert
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
