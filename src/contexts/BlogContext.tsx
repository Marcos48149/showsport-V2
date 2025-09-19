"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
  isPublished: boolean;
  readingTime: number;
  views?: number;
  relatedProducts?: string[];
  schemaType?: 'Article' | 'FAQ' | 'HowTo' | 'Review';
  faqItems?: Array<{
    question: string;
    answer: string;
  }>;
  howToSteps?: Array<{
    name: string;
    text: string;
    image?: string;
  }>;
  reviewRating?: {
    ratingValue: number;
    bestRating: number;
    worstRating: number;
    reviewCount: number;
  };
}

export interface BlogCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  featuredImage: string;
  postCount: number;
  color: string;
  icon: string;
}

interface BlogState {
  posts: BlogPost[];
  categories: BlogCategory[];
  featuredPosts: BlogPost[];
  isLoading: boolean;
  error: string | null;
}

interface BlogContextType {
  state: BlogState;
  getPostsByCategory: (categorySlug: string) => Promise<BlogPost[]>;
  getPostBySlug: (categorySlug: string, postSlug: string) => Promise<BlogPost | null>;
  getCategoryBySlug: (slug: string) => BlogCategory | null;
  getRelatedPosts: (postId: string, limit?: number) => Promise<BlogPost[]>;
  getFeaturedPosts: (limit?: number) => BlogPost[];
  searchPosts: (query: string) => Promise<BlogPost[]>;
  refreshData: () => Promise<void>;
  createPost: (postData: any) => Promise<BlogPost>;
  updatePost: (id: string, postData: any) => Promise<BlogPost>;
  deletePost: (id: string) => Promise<boolean>;
  createCategory: (categoryData: any) => Promise<BlogCategory>;
  updateCategory: (id: string, categoryData: any) => Promise<BlogCategory>;
  deleteCategory: (id: string) => Promise<boolean>;
}

const BlogContext = createContext<BlogContextType | null>(null);

export function BlogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BlogState>({
    posts: [],
    categories: [],
    featuredPosts: [],
    isLoading: true,
    error: null
  });

  // Load initial data
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const [categoriesRes, postsRes] = await Promise.all([
        fetch('/api/blog/categories'),
        fetch('/api/blog/posts?published=true&limit=50')
      ]);

      if (!categoriesRes.ok || !postsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const categories = await categoriesRes.json();
      const postsData = await postsRes.json();
      const posts = postsData.posts || [];

      const featuredPosts = posts
        .sort((a: BlogPost, b: BlogPost) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        )
        .slice(0, 6);

      setState({
        posts,
        categories,
        featuredPosts,
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('Error loading blog data:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load blog data'
      }));
    }
  };

  const getPostsByCategory = async (categorySlug: string): Promise<BlogPost[]> => {
    try {
      const response = await fetch(`/api/blog/posts?category=${categorySlug}&published=true`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      return data.posts || [];
    } catch (error) {
      console.error('Error fetching posts by category:', error);
      return [];
    }
  };

  const getPostBySlug = async (categorySlug: string, postSlug: string): Promise<BlogPost | null> => {
    try {
      // Find from existing posts first (for performance)
      const existingPost = state.posts.find(
        post => post.category.slug === categorySlug && post.slug === postSlug
      );

      if (existingPost) {
        return existingPost;
      }

      // If not found, search in database
      const response = await fetch(`/api/blog/posts?category=${categorySlug}&published=true`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      const posts = data.posts || [];

      return posts.find((post: BlogPost) => post.slug === postSlug) || null;
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      return null;
    }
  };

  const getCategoryBySlug = (slug: string): BlogCategory | null => {
    return state.categories.find(category => category.slug === slug) || null;
  };

  const getRelatedPosts = async (postId: string, limit = 3): Promise<BlogPost[]> => {
    try {
      const response = await fetch(`/api/blog/search?related=${postId}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch related posts');
      return await response.json();
    } catch (error) {
      console.error('Error fetching related posts:', error);
      return [];
    }
  };

  const getFeaturedPosts = (limit = 6): BlogPost[] => {
    return state.featuredPosts.slice(0, limit);
  };

  const searchPosts = async (query: string): Promise<BlogPost[]> => {
    try {
      const response = await fetch(`/api/blog/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search posts');
      return await response.json();
    } catch (error) {
      console.error('Error searching posts:', error);
      return [];
    }
  };

  // Admin functions for CMS
  const createPost = async (postData: any): Promise<BlogPost> => {
    try {
      const response = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create post');
      }

      const newPost = await response.json();

      // Update local state
      setState(prev => ({
        ...prev,
        posts: [newPost, ...prev.posts],
        featuredPosts: [newPost, ...prev.featuredPosts.slice(0, 5)]
      }));

      return newPost;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const updatePost = async (id: string, postData: any): Promise<BlogPost> => {
    try {
      const response = await fetch(`/api/blog/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update post');
      }

      const updatedPost = await response.json();

      // Update local state
      setState(prev => ({
        ...prev,
        posts: prev.posts.map(post => post.id === id ? updatedPost : post),
        featuredPosts: prev.featuredPosts.map(post => post.id === id ? updatedPost : post)
      }));

      return updatedPost;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  };

  const deletePost = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/blog/posts/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete post');
      }

      // Update local state
      setState(prev => ({
        ...prev,
        posts: prev.posts.filter(post => post.id !== id),
        featuredPosts: prev.featuredPosts.filter(post => post.id !== id)
      }));

      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  };

  const createCategory = async (categoryData: any): Promise<BlogCategory> => {
    try {
      const response = await fetch('/api/blog/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create category');
      }

      const newCategory = await response.json();

      // Update local state
      setState(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory]
      }));

      return newCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  };

  const updateCategory = async (id: string, categoryData: any): Promise<BlogCategory> => {
    try {
      const response = await fetch(`/api/blog/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update category');
      }

      const updatedCategory = await response.json();

      // Update local state
      setState(prev => ({
        ...prev,
        categories: prev.categories.map(cat => cat.id === id ? updatedCategory : cat)
      }));

      return updatedCategory;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/blog/categories/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete category');
      }

      // Update local state
      setState(prev => ({
        ...prev,
        categories: prev.categories.filter(cat => cat.id !== id)
      }));

      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  return (
    <BlogContext.Provider value={{
      state,
      getPostsByCategory,
      getPostBySlug,
      getCategoryBySlug,
      getRelatedPosts,
      getFeaturedPosts,
      searchPosts,
      refreshData,
      createPost,
      updatePost,
      deletePost,
      createCategory,
      updateCategory,
      deleteCategory
    }}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
}
