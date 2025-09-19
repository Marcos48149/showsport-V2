"use client";

import { useEffect, useState } from 'react';
import { Clock, Eye, Share2 } from 'lucide-react';

interface ReadingProgressBarProps {
  postId: string;
  estimatedReadTime: number;
  onProgressChange?: (progress: number) => void;
}

export default function ReadingProgressBar({
  postId,
  estimatedReadTime,
  onProgressChange
}: ReadingProgressBarProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let startTime = Date.now();
    let interval: NodeJS.Timeout;

    const updateProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollTop / docHeight) * 100, 100);

      setScrollProgress(progress);
      setIsVisible(progress > 5);

      if (onProgressChange) {
        onProgressChange(progress);
      }
    };

    const updateTimeSpent = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setTimeSpent(elapsed);
    };

    // Initialize
    updateProgress();
    interval = setInterval(updateTimeSpent, 1000);

    // Event listeners
    window.addEventListener('scroll', updateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateProgress);
      clearInterval(interval);
    };
  }, [onProgressChange]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const completionPercentage = Math.min((timeSpent / (estimatedReadTime * 60)) * 100, 100);

  if (!isVisible) return null;

  return (
    <>
      {/* Fixed Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Reading Stats Panel - Desktop */}
      <div className="hidden lg:block fixed left-4 top-1/2 transform -translate-y-1/2 z-40">
        <div className="bg-white rounded-lg shadow-lg border p-4 w-48">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Eye className="h-4 w-4" />
              <span>Progreso: {Math.round(scrollProgress)}%</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeSpent)} / {estimatedReadTime}min</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: document.title,
                    url: window.location.href
                  });
                }
              }}
              className="flex items-center gap-2 text-sm text-orange-500 hover:text-orange-600 w-full justify-center py-2 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Compartir
            </button>
          </div>
        </div>
      </div>

      {/* Reading Stats Panel - Mobile */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <div className="bg-white rounded-full shadow-lg border px-4 py-2 flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Clock className="h-3 w-3" />
            <span>{formatTime(timeSpent)}</span>
          </div>

          <div className="w-12 bg-gray-200 rounded-full h-1">
            <div
              className="bg-orange-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>

          <span className="text-xs text-gray-600">{Math.round(scrollProgress)}%</span>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {scrollProgress > 50 && (
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="fixed bottom-4 left-4 z-40 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors lg:hidden"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </>
  );
}
