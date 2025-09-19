"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Review {
  id: string;
  productId: number;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  date: string;
  images?: string[];
}

interface ReviewsState {
  reviews: Review[];
  averageRatings: Record<number, { average: number; count: number }>;
}

type ReviewsAction =
  | { type: 'ADD_REVIEW'; payload: Review }
  | { type: 'MARK_HELPFUL'; payload: { reviewId: string } }
  | { type: 'SET_REVIEWS'; payload: Review[] };

const initialState: ReviewsState = {
  reviews: [
    {
      id: '1',
      productId: 1,
      userId: '1',
      userName: 'Juan P.',
      rating: 5,
      title: 'Excelentes zapatillas',
      comment: 'Las zapatillas Adidas Ultraboost son increíbles. La comodidad es excepcional y el diseño es muy moderno. Las uso para correr y para el día a día.',
      verified: true,
      helpful: 12,
      date: '2024-02-15T10:30:00Z'
    },
    {
      id: '2',
      productId: 1,
      userId: '2',
      userName: 'María G.',
      rating: 4,
      title: 'Muy cómodas',
      comment: 'Son muy cómodas para correr. El único detalle es que tallan un poco grandes, recomiendo pedir medio talle menos.',
      verified: true,
      helpful: 8,
      date: '2024-02-10T15:45:00Z'
    },
    {
      id: '3',
      productId: 2,
      userId: '3',
      userName: 'Carlos M.',
      rating: 5,
      title: 'Perfectas para el día a día',
      comment: 'Las Nike Air Max 270 son perfectas para uso diario. Muy cómodas y el diseño es genial. La entrega fue rápida.',
      verified: true,
      helpful: 15,
      date: '2024-02-12T09:20:00Z'
    },
    {
      id: '4',
      productId: 3,
      userId: '4',
      userName: 'Ana L.',
      rating: 4,
      title: 'Buen diseño',
      comment: 'Las Puma RS-X tienen un diseño muy llamativo. Son cómodas aunque un poco pesadas para correr.',
      verified: false,
      helpful: 6,
      date: '2024-02-08T14:15:00Z'
    }
  ],
  averageRatings: {}
};

// Calculate initial average ratings
initialState.averageRatings = initialState.reviews.reduce((acc, review) => {
  if (!acc[review.productId]) {
    acc[review.productId] = { average: 0, count: 0 };
  }

  const current = acc[review.productId];
  const newCount = current.count + 1;
  const newAverage = ((current.average * current.count) + review.rating) / newCount;

  acc[review.productId] = {
    average: Math.round(newAverage * 10) / 10,
    count: newCount
  };

  return acc;
}, {} as Record<number, { average: number; count: number }>);

function reviewsReducer(state: ReviewsState, action: ReviewsAction): ReviewsState {
  switch (action.type) {
    case 'ADD_REVIEW': {
      const newReviews = [...state.reviews, action.payload];

      // Recalculate average ratings
      const averageRatings = newReviews.reduce((acc, review) => {
        if (!acc[review.productId]) {
          acc[review.productId] = { average: 0, count: 0 };
        }

        const current = acc[review.productId];
        const newCount = current.count + 1;
        const newAverage = ((current.average * current.count) + review.rating) / newCount;

        acc[review.productId] = {
          average: Math.round(newAverage * 10) / 10,
          count: newCount
        };

        return acc;
      }, {} as Record<number, { average: number; count: number }>);

      return {
        ...state,
        reviews: newReviews,
        averageRatings
      };
    }

    case 'MARK_HELPFUL': {
      const updatedReviews = state.reviews.map(review =>
        review.id === action.payload.reviewId
          ? { ...review, helpful: review.helpful + 1 }
          : review
      );

      return {
        ...state,
        reviews: updatedReviews
      };
    }

    case 'SET_REVIEWS': {
      return {
        ...state,
        reviews: action.payload
      };
    }

    default:
      return state;
  }
}

const ReviewsContext = createContext<{
  state: ReviewsState;
  dispatch: React.Dispatch<ReviewsAction>;
  getProductReviews: (productId: number) => Review[];
  getProductRating: (productId: number) => { average: number; count: number };
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  markHelpful: (reviewId: string) => void;
} | null>(null);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reviewsReducer, initialState);

  const getProductReviews = (productId: number) => {
    return state.reviews
      .filter(review => review.productId === productId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getProductRating = (productId: number) => {
    return state.averageRatings[productId] || { average: 0, count: 0 };
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      helpful: 0
    };

    dispatch({ type: 'ADD_REVIEW', payload: newReview });
  };

  const markHelpful = (reviewId: string) => {
    dispatch({ type: 'MARK_HELPFUL', payload: { reviewId } });
  };

  return (
    <ReviewsContext.Provider value={{
      state,
      dispatch,
      getProductReviews,
      getProductRating,
      addReview,
      markHelpful
    }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
}
