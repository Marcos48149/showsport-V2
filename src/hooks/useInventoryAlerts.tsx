"use client";

import { useEffect } from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { useEmail } from '@/contexts/EmailContext';

export function useInventoryAlerts() {
  const { getLowStockAlerts, state: inventoryState } = useInventory();
  const { sendStockAlert } = useEmail();

  useEffect(() => {
    const alerts = getLowStockAlerts();

    // Send email alerts for new critical stock issues
    alerts.forEach(async (alert) => {
      if (alert.severity === 'critical' || alert.severity === 'out_of_stock') {
        // Check if this is a new alert (created in the last minute)
        const alertTime = new Date(alert.date).getTime();
        const now = Date.now();
        const isNewAlert = (now - alertTime) < 60000; // 1 minute

        if (isNewAlert) {
          await sendStockAlert({
            productName: alert.productName,
            productSku: `SKU-${alert.productId}`,
            currentStock: alert.currentStock,
            threshold: alert.threshold,
            alertSeverity: alert.severity
          }, 'admin@showsport.com');
        }
      }
    });
  }, [inventoryState.alerts, getLowStockAlerts, sendStockAlert]);

  return {
    alerts: getLowStockAlerts()
  };
}
