"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface VtexConfig {
  storeName: string;
  environment: 'stable' | 'beta';
  appKey: string;
  appToken: string;
  baseUrl: string;
}

export interface VtexProduct {
  id: string;
  name: string;
  description: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  productReference: string;
  linkText: string;
  metaTagDescription: string;
  releaseDate: string;
  keywords: string[];
  title: string;
  isVisible: boolean;
  isActive: boolean;
  taxCode: string;
  metatagTitle: string;
  supplierId: string;
  showWithoutStock: boolean;
  adWordsRemarketingCode: string;
  lomadeeCampaignCode: string;
  score: number;
  skus: VtexSku[];
}

export interface VtexSku {
  id: string;
  productId: string;
  nameComplete: string;
  productName: string;
  productDescription: string;
  taxCode: string;
  skuName: string;
  isActive: boolean;
  isTransported: boolean;
  isInventoried: boolean;
  isGiftCardRecharge: boolean;
  imageUrl: string;
  detailUrl: string;
  cscIdentification: string;
  brandId: string;
  brandName: string;
  dimension: {
    cubicweight: number;
    height: number;
    length: number;
    weight: number;
    width: number;
  };
  realDimension: {
    realCubicWeight: number;
    realHeight: number;
    realLength: number;
    realWeight: number;
    realWidth: number;
  };
  manufacturerCode: string;
  isKit: boolean;
  kitItems: any[];
  services: any[];
  categories: string[];
  categoriesFullPath: string[];
  attachments: any[];
  collections: any[];
  SkuSellers: VtexSkuSeller[];
  SalesChannels: number[];
  Images: VtexImage[];
  Videos: any[];
  SkuSpecifications: VtexSpecification[];
  ProductSpecifications: VtexSpecification[];
  ProductClustersIds: string;
  ProductCategoryIds: string;
  ProductGlobalCategoryId: number;
  ProductCategories: Record<string, string>;
  CommercialConditionId: number;
  RewardValue: number;
  AlternateIds: Record<string, string>;
  AlternateIdValues: string[];
  EstimatedDateArrival: string;
  MeasurementUnit: string;
  UnitMultiplier: number;
  InformationSource: string;
  ModalType: string;
  KeyWords: string;
  IsKit: boolean;
  IsActive: boolean;
}

export interface VtexSkuSeller {
  SellerId: string;
  StockKeepingUnitId: number;
  SellerStockKeepingUnitId: string;
  IsActive: boolean;
  FreightCommissionPercentage: number;
  ProductCommissionPercentage: number;
}

export interface VtexImage {
  ImageId: string;
  ImageName: string;
  FileId: number;
  ImageUrl: string;
  ImageText: string;
  LastModified: string;
}

export interface VtexSpecification {
  FieldId: number;
  FieldName: string;
  FieldValueIds: number[];
  FieldValues: string[];
  IsFilter: boolean;
  FieldGroupId: number;
  FieldGroupName: string;
}

export interface VtexOrder {
  orderId: string;
  sequence: number;
  marketplaceOrderId: string;
  marketplaceServicesEndpoint: string;
  sellerOrderId: string;
  origin: string;
  affiliateId: string;
  salesChannel: string;
  merchantName: string;
  status: string;
  statusDescription: string;
  value: number;
  creationDate: string;
  lastChange: string;
  orderGroup: string;
  totals: VtexOrderTotal[];
  items: VtexOrderItem[];
  marketplaceItems: any[];
  clientProfileData: VtexClientProfile;
  giftRegistryData: any;
  marketingData: any;
  ratesAndBenefitsData: any;
  shippingData: VtexShippingData;
  paymentData: VtexPaymentData;
  packageAttachment: any;
  sellers: VtexSeller[];
  callCenterOperatorData: any;
  followUpEmail: string;
  lastMessage: any;
  hostname: string;
  invoiceData: any;
  changesAttachment: any;
  openTextField: any;
  roundingError: number;
  orderFormId: string;
  commercialConditionData: any;
  isCompleted: boolean;
  customData: any;
  storePreferencesData: any;
  allowCancellation: boolean;
  allowEdition: boolean;
  isCheckedIn: boolean;
  marketplace: any;
  authorizedDate: string;
  invoicedDate: string;
}

export interface VtexOrderTotal {
  id: string;
  name: string;
  value: number;
}

export interface VtexOrderItem {
  uniqueId: string;
  id: string;
  productId: string;
  ean: string;
  lockId: string;
  itemAttachment: any;
  attachments: any[];
  quantity: number;
  seller: string;
  name: string;
  refId: string;
  productRefId: string;
  brand: string;
  brandId: string;
  category: string;
  categoryId: string;
  categoryIds: string[];
  categories: string[];
  priceValidUntil: string;
  tax: number;
  price: number;
  listPrice: number;
  manualPrice: number;
  sellingPrice: number;
  rewardValue: number;
  isGift: boolean;
  additionalInfo: any;
  preSaleDate: string;
  productCategoryIds: string;
  productCategories: Record<string, string>;
  sellerChain: string[];
  imageUrl: string;
  detailUrl: string;
  components: any[];
  bundleItems: any[];
  params: Record<string, string>;
  offerings: any[];
  priceTags: any[];
  measurementUnit: string;
  unitMultiplier: number;
  sellingPriceWithAssemblies: number;
}

export interface VtexClientProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  documentType: string;
  document: string;
  phone: string;
  corporateName: string;
  tradeName: string;
  corporateDocument: string;
  stateInscription: string;
  corporatePhone: string;
  isCorporate: boolean;
  userProfileId: string;
  customerClass: string;
}

export interface VtexShippingData {
  id: string;
  address: VtexAddress;
  logisticsInfo: VtexLogisticsInfo[];
  trackingHints: any[];
  selectedAddresses: VtexAddress[];
}

export interface VtexAddress {
  addressType: string;
  receiverName: string;
  addressId: string;
  isDisposable: boolean;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  reference: string;
  geoCoordinates: number[];
}

export interface VtexLogisticsInfo {
  itemIndex: number;
  selectedSla: string;
  lockTTL: string;
  price: number;
  listPrice: number;
  sellingPrice: number;
  deliveryWindow: any;
  deliveryCompany: string;
  shippingEstimate: string;
  shippingEstimateDate: string;
  slas: VtexSla[];
  shipsTo: string[];
  deliveryIds: any[];
  deliveryChannel: string;
  pickupStoreInfo: any;
  addressId: string;
  polygonName: string;
  pickupPointId: string;
  transitTime: string;
}

export interface VtexSla {
  id: string;
  name: string;
  shippingEstimate: string;
  deliveryWindow: any;
  price: number;
  deliveryChannel: string;
  pickupStoreInfo: any;
  polygonName: string;
  lockTTL: string;
  pickupPointId: string;
  transitTime: string;
  tax: number;
}

export interface VtexPaymentData {
  giftCards: any[];
  transactions: VtexTransaction[];
}

export interface VtexTransaction {
  isActive: boolean;
  transactionId: string;
  merchantName: string;
  payments: VtexPayment[];
}

export interface VtexPayment {
  id: string;
  paymentSystem: string;
  paymentSystemName: string;
  value: number;
  installments: number;
  referenceValue: number;
  cardHolder: string;
  cardNumber: string;
  firstDigits: string;
  lastDigits: string;
  cvv2: string;
  expireMonth: string;
  expireYear: string;
  url: string;
  giftCardId: string;
  giftCardName: string;
  giftCardCaption: string;
  redemptionCode: string;
  group: string;
  tid: string;
  dueDate: string;
  connectorResponses: Record<string, any>;
}

export interface VtexSeller {
  id: string;
  name: string;
  logo: string;
  fulfillmentEndpoint: string;
}

interface VtexState {
  config: VtexConfig | null;
  products: VtexProduct[];
  orders: VtexOrder[];
  inventory: Record<string, number>;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  lastSync: string | null;
}

type VtexAction =
  | { type: 'SET_CONFIG'; payload: VtexConfig }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PRODUCTS'; payload: VtexProduct[] }
  | { type: 'SET_ORDERS'; payload: VtexOrder[] }
  | { type: 'UPDATE_INVENTORY'; payload: Record<string, number> }
  | { type: 'SET_LAST_SYNC'; payload: string };

const initialState: VtexState = {
  config: null,
  products: [],
  orders: [],
  inventory: {},
  isConnected: false,
  isLoading: false,
  error: null,
  lastSync: null
};

function vtexReducer(state: VtexState, action: VtexAction): VtexState {
  switch (action.type) {
    case 'SET_CONFIG':
      return { ...state, config: action.payload };
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'UPDATE_INVENTORY':
      return { ...state, inventory: { ...state.inventory, ...action.payload } };
    case 'SET_LAST_SYNC':
      return { ...state, lastSync: action.payload };
    default:
      return state;
  }
}

const VtexContext = createContext<{
  state: VtexState;
  dispatch: React.Dispatch<VtexAction>;
  connectToVtex: (config: VtexConfig) => Promise<boolean>;
  syncProducts: () => Promise<void>;
  syncOrders: () => Promise<void>;
  syncInventory: () => Promise<void>;
  createOrder: (orderData: any) => Promise<string | null>;
  updateInventory: (skuId: string, quantity: number) => Promise<boolean>;
  getProduct: (productId: string) => Promise<VtexProduct | null>;
  searchProducts: (term: string) => Promise<VtexProduct[]>;
} | null>(null);

export function VtexProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(vtexReducer, initialState);

  const connectToVtex = async (config: VtexConfig): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Test connection with VTEX API
      const response = await fetch(`${config.baseUrl}/api/catalog_system/pvt/products/GetProductAndSkuIds`, {
        method: 'GET',
        headers: {
          'X-VTEX-API-AppKey': config.appKey,
          'X-VTEX-API-AppToken': config.appToken,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        dispatch({ type: 'SET_CONFIG', payload: config });
        dispatch({ type: 'SET_CONNECTED', payload: true });
        localStorage.setItem('vtex_config', JSON.stringify(config));

        // Initial sync
        await syncProducts();
        await syncOrders();
        await syncInventory();

        return true;
      } else {
        throw new Error(`VTEX API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Connection failed' });
      dispatch({ type: 'SET_CONNECTED', payload: false });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const makeVtexRequest = async (endpoint: string, options: RequestInit = {}) => {
    if (!state.config) throw new Error('VTEX not configured');

    const response = await fetch(`${state.config.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'X-VTEX-API-AppKey': state.config.appKey,
        'X-VTEX-API-AppToken': state.config.appToken,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`VTEX API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  };

  const syncProducts = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Get product IDs first
      const productIds = await makeVtexRequest('/api/catalog_system/pvt/products/GetProductAndSkuIds');

      // Get detailed product information
      const products: VtexProduct[] = [];
      const batchSize = 50; // Process in batches to avoid rate limits

      for (let i = 0; i < productIds.data.length; i += batchSize) {
        const batch = productIds.data.slice(i, i + batchSize);
        const batchPromises = batch.map(async (item: any) => {
          try {
            return await makeVtexRequest(`/api/catalog_system/pvt/products/ProductGet/${item.ProductId}`);
          } catch (error) {
            console.error(`Error fetching product ${item.ProductId}:`, error);
            return null;
          }
        });

        const batchResults = await Promise.all(batchPromises);
        products.push(...batchResults.filter(Boolean));

        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      dispatch({ type: 'SET_PRODUCTS', payload: products });
      dispatch({ type: 'SET_LAST_SYNC', payload: new Date().toISOString() });

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Product sync failed' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const syncOrders = async () => {
    try {
      const endDate = new Date().toISOString();
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(); // Last 30 days

      const orders = await makeVtexRequest(
        `/api/oms/pvt/orders?f_creationDate=creationDate:[${startDate} TO ${endDate}]&per_page=100`
      );

      dispatch({ type: 'SET_ORDERS', payload: orders.list || [] });

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Order sync failed' });
    }
  };

  const syncInventory = async () => {
    try {
      if (state.products.length === 0) return;

      const inventory: Record<string, number> = {};

      // Get inventory for all SKUs
      for (const product of state.products) {
        for (const sku of product.skus || []) {
          try {
            const skuInventory = await makeVtexRequest(`/api/logistics/pvt/inventory/skus/${sku.id}`);
            inventory[sku.id] = skuInventory.balance || 0;
          } catch (error) {
            console.error(`Error fetching inventory for SKU ${sku.id}:`, error);
            inventory[sku.id] = 0;
          }
        }

        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      dispatch({ type: 'UPDATE_INVENTORY', payload: inventory });

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Inventory sync failed' });
    }
  };

  const createOrder = async (orderData: any): Promise<string | null> => {
    try {
      const order = await makeVtexRequest('/api/oms/pvt/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });

      return order.orderId || null;

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Order creation failed' });
      return null;
    }
  };

  const updateInventory = async (skuId: string, quantity: number): Promise<boolean> => {
    try {
      await makeVtexRequest(`/api/logistics/pvt/inventory/skus/${skuId}`, {
        method: 'PUT',
        body: JSON.stringify({
          quantity,
          warehouseId: '1_1', // Default warehouse
          dateUtcOnBalanceSystem: new Date().toISOString()
        })
      });

      // Update local inventory
      dispatch({ type: 'UPDATE_INVENTORY', payload: { [skuId]: quantity } });

      return true;

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Inventory update failed' });
      return false;
    }
  };

  const getProduct = async (productId: string): Promise<VtexProduct | null> => {
    try {
      const product = await makeVtexRequest(`/api/catalog_system/pvt/products/ProductGet/${productId}`);
      return product;

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Product fetch failed' });
      return null;
    }
  };

  const searchProducts = async (term: string): Promise<VtexProduct[]> => {
    try {
      const searchResult = await makeVtexRequest(`/api/catalog_system/pub/products/search?ft=${encodeURIComponent(term)}`);
      return searchResult || [];

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Product search failed' });
      return [];
    }
  };

  // Load saved configuration on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('vtex_config');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        dispatch({ type: 'SET_CONFIG', payload: config });
        // Auto-connect if config is available
        connectToVtex(config);
      } catch (error) {
        console.error('Error loading VTEX config:', error);
      }
    }
  }, []);

  return (
    <VtexContext.Provider value={{
      state,
      dispatch,
      connectToVtex,
      syncProducts,
      syncOrders,
      syncInventory,
      createOrder,
      updateInventory,
      getProduct,
      searchProducts
    }}>
      {children}
    </VtexContext.Provider>
  );
}

export function useVtex() {
  const context = useContext(VtexContext);
  if (!context) {
    throw new Error('useVtex must be used within a VtexProvider');
  }
  return context;
}
