/**
 * Dynamic Import Configuration for Performance Optimization
 * 
 * This utility enables code-splitting and lazy loading of heavy components
 * to reduce initial bundle size and improve Core Web Vitals
 */

import React from 'react'
import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

// Fallback loading component for lazy-loaded components
const LoadingFallback = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-pulse">
      <div className="h-4 w-32 bg-muted rounded mb-2" />
      <div className="h-4 w-48 bg-muted rounded" />
    </div>
  </div>
)

/**
 * Lazy load heavy components that aren't immediately visible
 * These are loaded on-demand to reduce initial page weight
 */

// Helper to create dynamic imports with loading fallback
function createDynamicComponent(
  importFn: () => Promise<any>,
  options?: { ssr?: boolean }
) {
  return dynamic(importFn, {
    loading: LoadingFallback,
    ...options,
  })
}

export const dynamicComponents = {
  // AI Coach (1034 lines) - Load on user interaction
  ConversationalInterviewSimulator: createDynamicComponent(
    () => import('@/components/conversational-interview-simulator' as any),
    { ssr: false }
  ),

  // AI Coach (951 lines)
  PersistentAICoach: createDynamicComponent(
    () => import('@/components/persistent-ai-coach' as any),
    { ssr: false }
  ),

  // Enhanced AI Coach (737 lines)
  EnhancedAICoach: createDynamicComponent(
    () => import('@/components/enhanced-ai-coach' as any),
    { ssr: false }
  ),

  // Mobile Gesture Tester (730 lines)
  MobileGestureTester: createDynamicComponent(
    () => import('@/components/mobile-gesture-tester' as any),
    { ssr: false }
  ),

  // Quick Book Access (686 lines)
  QuickBookAccess: createDynamicComponent(
    () => import('@/components/quick-book-access' as any),
    { ssr: true }
  ),

  // Enhanced Coach Flow (672 lines)
  EnhancedCoachFlow: createDynamicComponent(
    () => import('@/components/enhanced-coach-flow' as any),
    { ssr: false }
  ),

  // Brain Chat Interface (463 lines)
  BrainChatInterface: createDynamicComponent(
    () => import('@/components/brain-chat-interface' as any),
    { ssr: false }
  ),

  // Gamification System (465 lines)
  GamificationSystem: createDynamicComponent(
    () => import('@/components/gamification-system' as any),
    { ssr: true }
  ),

  // Application Status Tracker (558 lines)
  ApplicationStatusTracker: createDynamicComponent(
    () => import('@/components/application-status-tracker' as any),
    { ssr: true }
  ),
} as const

/**
 * Configuration for image optimization
 * Use these presets for consistent image loading strategies
 */
export const imageOptimizationConfig = {
  // Hero/Banner images: high priority, eager loading
  heroImage: {
    priority: true,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  },
  
  // Card/List images: lazy load, lower priority
  cardImage: {
    priority: false,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  },
  
  // Thumbnail images: lazy load, small sizes
  thumbnailImage: {
    priority: false,
    sizes: '(max-width: 640px) 80px, (max-width: 1024px) 120px, 150px',
  },
  
  // Background images: lazy load, cover entire viewport
  backgroundImage: {
    priority: false,
    sizes: '100vw',
    quality: 75, // Reduced quality for backgrounds
  },
} as const

/**
 * API caching strategy
 * Configures how long different types of API responses are cached
 */
export const apiCachingStrategy = {
  // User profile data - cache for 10 minutes
  userProfile: {
    revalidate: 600,
    tags: ['user-profile'],
  },
  
  // Pillar progress data - cache for 5 minutes
  pillarProgress: {
    revalidate: 300,
    tags: ['pillar-progress'],
  },
  
  // Test results - cache for 30 minutes (rarely changes)
  testResults: {
    revalidate: 1800,
    tags: ['test-results'],
  },
  
  // Content pages - cache for 1 hour
  content: {
    revalidate: 3600,
    tags: ['content'],
  },
  
  // AI coach responses - cache for 5 minutes
  aiResponses: {
    revalidate: 300,
    tags: ['ai-responses'],
  },
} as const

/**
 * Component preload hints
 * Add these to page <head> for critical above-fold components
 */
export function generatePreloadHints() {
  return [
    // Preload critical fonts
    {
      rel: 'preload',
      as: 'font',
      href: '/fonts/montserrat.woff2',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preload',
      as: 'font',
      href: '/fonts/lora.woff2',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
  ]
}
