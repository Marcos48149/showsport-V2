"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string;
  image: string;
  category: string;
  discount?: string;
  description?: string;
  sizes?: string[];
  images?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; size?: string } }
  | { type: 'REMOVE_ITEM'; payload: { id: number; size?: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number; size?: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean };

const initialState: CartState = {
  items: [],
  isOpen: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, size } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.id === product.id && item.selectedSize === size
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += 1;
        return { ...state, items: updatedItems };
      }

      return {
        ...state,
        items: [...state.items, { ...product, quantity: 1, selectedSize: size }]
      };
    }

    case 'REMOVE_ITEM': {
      const { id, size } = action.payload;
      return {
        ...state,
        items: state.items.filter(item =>
          !(item.id === id && item.selectedSize === size)
        )
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity, size } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item =>
            !(item.id === id && item.selectedSize === size)
          )
        };
      }

      const updatedItems = state.items.map(item =>
        item.id === id && item.selectedSize === size
          ? { ...item, quantity }
          : item
      );
      return { ...state, items: updatedItems };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'SET_CART_OPEN':
      return { ...state, isOpen: action.payload };

    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
