"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReviews, Review } from "@/contexts/ReviewsContext";
import { useAuth } from "@/contexts/AuthContext";
import { Star, ThumbsUp, CheckCircle, User } from "lucide-react";

interface ProductReviewsProps {
  productId: number;
  productName: string;
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const { getProductReviews, getProductRating, addReview, markHelpful } = useReviews();
  const { state: authState } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  const reviews = getProductReviews(productId);
  const { average, count } = getProductRating(productId);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (!authState.user) {
      alert('Debes iniciar sesión para escribir una reseña');
      return;
    }

    if (!newReview.title.trim() || !newReview.comment.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    addReview({
      productId,
      userId: authState.user.id,
      userName: `${authState.user.name} ${authState.user.lastName.charAt(0)}.`,
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      verified: true,
      helpful: 0
    });

    setNewReview({ rating: 5, title: '', comment: '' });
    setShowReviewForm(false);
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
            className={interactive ? "hover:scale-110 transition-transform" : ""}
          >
            <Star
              className={`h-4 w-4 ${
                star <= rating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();

  return (
    <div className="py-12 border-t">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold mb-8">Reseñas de Clientes</h3>

        {/* Rating Summary */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-bold">{average}</div>
              <div>
                {renderStars(Math.round(average))}
                <p className="text-sm text-gray-600 mt-1">
                  Basado en {count} reseña{count !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2 text-sm">
                  <span className="w-12">{stars} ⭐</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: count > 0 ? `${(distribution[stars as keyof typeof distribution] / count) * 100}%` : '0%'
                      }}
                    />
                  </div>
                  <span className="w-8 text-right">
                    {distribution[stars as keyof typeof distribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">¿Compraste este producto?</h4>
            <p className="text-gray-600 mb-4">
              Comparte tu experiencia con otros clientes
            </p>
            {authState.user ? (
              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Escribir Reseña
              </Button>
            ) : (
              <p className="text-sm text-gray-500">
                Inicia sesión para escribir una reseña
              </p>
            )}
          </div>
        </div>

        {/* Review Form */}
        {showReviewForm && authState.user && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h4 className="font-semibold mb-4">Escribir Reseña</h4>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calificación *
                </label>
                {renderStars(newReview.rating, true, (rating) =>
                  setNewReview({ ...newReview, rating })
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título de la reseña *
                </label>
                <Input
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  placeholder="Resumen de tu experiencia"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu reseña *
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Comparte los detalles de tu experiencia con este producto"
                  className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {newReview.comment.length}/500 caracteres
                </p>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                  Publicar Reseña
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aún no hay reseñas</p>
              <p className="text-gray-400 mt-2">Sé el primero en compartir tu experiencia</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {renderStars(review.rating)}
                      {review.verified && (
                        <div className="flex items-center gap-1 text-green-600 text-xs">
                          <CheckCircle className="h-3 w-3" />
                          <span>Compra verificada</span>
                        </div>
                      )}
                    </div>
                    <h4 className="font-semibold">{review.title}</h4>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{review.userName}</p>
                    <p>{new Date(review.date).toLocaleDateString('es-AR')}</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{review.comment}</p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => markHelpful(review.id)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>Útil ({review.helpful})</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {reviews.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline">
              Ver Más Reseñas
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
