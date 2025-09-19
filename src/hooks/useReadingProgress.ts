"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

interface ReadingProgressConfig {
  postId: string;
  onProgress?: (progress: number, timeSpent: number) => void;
  trackingInterval?: number;
  milestones?: number[];
}

interface ReadingProgressData {
  progress: number;
  timeSpent: number;
  hasStartedReading: boolean;
  hasFinishedReading: boolean;
  currentMilestone: number;
}

export function useReadingProgress({
  postId,
  onProgress,
  trackingInterval = 1000,
  milestones = [25, 50, 75, 100]
}: ReadingProgressConfig) {
  const [readingData, setReadingData] = useState<ReadingProgressData>({
    progress: 0,
    timeSpent: 0,
    hasStartedReading: false,
    hasFinishedReading: false,
    currentMilestone: 0
  });

  const startTime = useRef<number>(Date.now());
  const lastScrollTime = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const milestonesReached = useRef<Set<number>>(new Set());

  const calculateProgress = useCallback(() => {
    if (typeof window === 'undefined') return 0;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollHeight <= 0) return 0;

    const progress = Math.min(Math.max((scrollTop / scrollHeight) * 100, 0), 100);
    return Math.round(progress);
  }, []);

  const updateProgress = useCallback(() => {
    const currentProgress = calculateProgress();
    const currentTime = Date.now();
    const timeSpent = Math.round((currentTime - startTime.current) / 1000);

    // Update reading data
    setReadingData(prev => {
      const newData = {
        ...prev,
        progress: currentProgress,
        timeSpent,
        hasStartedReading: prev.hasStartedReading || currentProgress > 5,
        hasFinishedReading: currentProgress >= 95,
        currentMilestone: milestones.find(m => currentProgress >= m && !milestonesReached.current.has(m)) || prev.currentMilestone
      };

      // Track milestones
      milestones.forEach(milestone => {
        if (currentProgress >= milestone && !milestonesReached.current.has(milestone)) {
          milestonesReached.current.add(milestone);

          // Call progress callback for milestone
          if (onProgress) {
            onProgress(milestone, timeSpent);
          }

          // Send to analytics
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'reading_milestone', {
              event_category: 'engagement',
              event_label: postId,
              value: milestone,
              custom_parameter_1: timeSpent
            });
          }
        }
      });

      return newData;
    });

    lastScrollTime.current = currentTime;
  }, [calculateProgress, milestones, onProgress, postId]);

  const handleScroll = useCallback(() => {
    updateProgress();
  }, [updateProgress]);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      // User switched tabs/minimized - pause tracking
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      // User returned - resume tracking
      startTime.current = Date.now() - readingData.timeSpent * 1000;
      if (!intervalRef.current) {
        intervalRef.current = setInterval(updateProgress, trackingInterval);
      }
    }
  }, [readingData.timeSpent, trackingInterval, updateProgress]);

  const startTracking = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Initialize tracking
    startTime.current = Date.now();
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start interval for time tracking
    intervalRef.current = setInterval(updateProgress, trackingInterval);

    // Initial progress calculation
    updateProgress();

    // Track page entry
    if ((window as any).gtag) {
      (window as any).gtag('event', 'reading_start', {
        event_category: 'engagement',
        event_label: postId
      });
    }
  }, [handleScroll, handleVisibilityChange, postId, trackingInterval, updateProgress]);

  const stopTracking = useCallback(() => {
    if (typeof window === 'undefined') return;

    window.removeEventListener('scroll', handleScroll);
    document.removeEventListener('visibilitychange', handleVisibilityChange);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Track reading completion
    if ((window as any).gtag) {
      (window as any).gtag('event', 'reading_complete', {
        event_category: 'engagement',
        event_label: postId,
        value: readingData.progress,
        custom_parameter_1: readingData.timeSpent
      });
    }

    // Final progress callback
    if (onProgress) {
      onProgress(readingData.progress, readingData.timeSpent);
    }
  }, [handleScroll, handleVisibilityChange, onProgress, postId, readingData.progress, readingData.timeSpent]);

  // Auto-start tracking on mount
  useEffect(() => {
    startTracking();

    return () => {
      stopTracking();
    };
  }, [startTracking, stopTracking]);

  // Auto-save progress to localStorage
  useEffect(() => {
    if (readingData.hasStartedReading) {
      localStorage.setItem(`reading-progress-${postId}`, JSON.stringify({
        progress: readingData.progress,
        timeSpent: readingData.timeSpent,
        lastVisit: Date.now()
      }));
    }
  }, [postId, readingData.hasStartedReading, readingData.progress, readingData.timeSpent]);

  // Load previous progress from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem(`reading-progress-${postId}`);
      if (savedProgress) {
        try {
          const parsed = JSON.parse(savedProgress);
          const timeSinceLastVisit = Date.now() - parsed.lastVisit;

          // Only restore if visited within last 24 hours
          if (timeSinceLastVisit < 24 * 60 * 60 * 1000) {
            setReadingData(prev => ({
              ...prev,
              timeSpent: parsed.timeSpent || 0
            }));
          }
        } catch (error) {
          console.warn('Failed to parse saved reading progress:', error);
        }
      }
    }
  }, [postId]);

  // Scroll to saved position on page load
  const scrollToSavedPosition = useCallback(() => {
    if (typeof window === 'undefined') return;

    const savedProgress = localStorage.getItem(`reading-progress-${postId}`);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        if (parsed.progress > 10 && parsed.progress < 90) {
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          const targetScroll = (parsed.progress / 100) * scrollHeight;

          setTimeout(() => {
            window.scrollTo({ top: targetScroll, behavior: 'smooth' });
          }, 1000);
        }
      } catch (error) {
        console.warn('Failed to restore scroll position:', error);
      }
    }
  }, [postId]);

  // Get reading statistics
  const getReadingStats = useCallback(() => {
    const wordsPerMinute = 200; // Average reading speed
    const estimatedReadingTime = Math.ceil(readingData.timeSpent / 60);
    const readingSpeed = readingData.timeSpent > 0 ? (readingData.progress / readingData.timeSpent) * 60 : 0;

    return {
      estimatedReadingTime,
      actualTimeSpent: readingData.timeSpent,
      readingSpeed: Math.round(readingSpeed),
      efficiency: readingSpeed > 0 ? Math.min((wordsPerMinute / readingSpeed) * 100, 100) : 0,
      completion: readingData.progress
    };
  }, [readingData.progress, readingData.timeSpent]);

  return {
    ...readingData,
    startTracking,
    stopTracking,
    scrollToSavedPosition,
    getReadingStats
  };
}
