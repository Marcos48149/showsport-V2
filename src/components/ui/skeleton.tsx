"use client";

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer',
        className
      )}
    />
  );
}

// Blog Post Card Skeleton
export function BlogPostSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="aspect-video w-full" />

      {/* Content Skeleton */}
      <div className="p-4 md:p-6">
        {/* Category Badge */}
        <Skeleton className="h-6 w-20 mb-3" />

        {/* Title */}
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4 mb-4" />

        {/* Excerpt */}
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />

        {/* Meta Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Tags */}
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>

        {/* Button */}
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

// Blog Category Card Skeleton
export function BlogCategorySkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
      <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
        <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-5 w-24 mb-1" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />

      <Skeleton className="h-4 w-20" />
    </div>
  );
}

// Blog Post Header Skeleton
export function BlogPostHeaderSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Back Button */}
      <Skeleton className="h-10 w-32 mb-6" />

      {/* Article Meta */}
      <div className="mb-8">
        {/* Badges */}
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-28 rounded-full" />
        </div>

        {/* Title */}
        <Skeleton className="h-10 w-full mb-2" />
        <Skeleton className="h-10 w-3/4 mb-4" />

        {/* Excerpt */}
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-5/6 mb-6" />

        {/* Meta Info */}
        <div className="flex flex-wrap gap-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>

      {/* Featured Image */}
      <Skeleton className="aspect-video w-full rounded-lg" />
    </div>
  );
}

// Search Results Skeleton
export function SearchResultsSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-4 border-b border-gray-100">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-5/6 mb-2" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Grid Skeleton for multiple posts
export function BlogGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <BlogPostSkeleton key={i} />
      ))}
    </div>
  );
}

// Category Grid Skeleton
export function CategoryGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCategorySkeleton key={i} />
      ))}
    </div>
  );
}

// CMS Table Skeleton
export function CMSTableSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <Skeleton className="h-4 w-16" />
              </th>
              <th className="px-6 py-3 text-left">
                <Skeleton className="h-4 w-20" />
              </th>
              <th className="px-6 py-3 text-left">
                <Skeleton className="h-4 w-12" />
              </th>
              <th className="px-6 py-3 text-left">
                <Skeleton className="h-4 w-16" />
              </th>
              <th className="px-6 py-3 text-left">
                <Skeleton className="h-4 w-14" />
              </th>
              <th className="px-6 py-3 text-left">
                <Skeleton className="h-4 w-18" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Skeleton className="h-10 w-16 rounded mr-4" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-20" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-20" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
