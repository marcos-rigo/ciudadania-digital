export interface PowerBIEmbedProps {
  src?: string
  title?: string
  autoRefreshMinutes?: number
}

export interface RefreshState {
  isLoading: boolean
  lastRefresh: Date | null
  isPaused: boolean
}

export type AnioFilter = '2025' | '2026'
