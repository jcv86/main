// Navigation links to add to your main navigation menu

export const BETTERME_NAVIGATION = [
  {
    name: 'Aprendizaje Personalizado',
    href: '/personalized-learning',
    icon: 'Sparkles',
    description: 'Toma el assessment para personalizar tu experiencia'
  },
  {
    name: 'Centro de Aprendizaje',
    href: '/betterme-hub',
    icon: 'BookOpen',
    description: 'Dashboard central con progreso, recomendaciones y ranking'
  },
  {
    name: 'Mi Progreso',
    href: '/betterme-hub?tab=progress',
    icon: 'TrendingUp',
    description: 'Sigue tu progreso, racha y puntos'
  },
  {
    name: 'Ranking de Lectores',
    href: '/leaderboard',
    icon: 'Trophy',
    description: 'Compite con otros usuarios en el leaderboard'
  },
  {
    name: 'Recomendaciones',
    href: '/betterme-hub?tab=recommendations',
    icon: 'Sparkles',
    description: 'Libros personalizados según tu nivel e intereses'
  },
]

// Integration checklist for your app
export const BETTERME_INTEGRATION_CHECKLIST = [
  {
    task: 'Add navigation links',
    status: 'todo',
    files: ['app/layout.tsx'],
    description: 'Add BETTERME_NAVIGATION links to your header/sidebar'
  },
  {
    task: 'Connect to Supabase',
    status: 'todo',
    files: ['app/personalized-learning/assessment.tsx', 'components/recommendation-engine.tsx'],
    description: 'Replace localStorage with Supabase calls for user profiles'
  },
  {
    task: 'Implement progress tracking',
    status: 'todo',
    files: ['components/progress-dashboard.tsx'],
    description: 'Connect to user_reading_stats and user_progress tables'
  },
  {
    task: 'Setup leaderboard data',
    status: 'todo',
    files: ['components/leaderboard.tsx'],
    description: 'Connect to real user data for ranking'
  },
  {
    task: 'Add achievement system',
    status: 'todo',
    files: ['components/progress-dashboard.tsx'],
    description: 'Integrate with achievements table for badges'
  },
  {
    task: 'Create recommendation algorithm',
    status: 'todo',
    files: ['components/recommendation-engine.tsx'],
    description: 'Connect to knowledge_base table and match scoring'
  },
]
