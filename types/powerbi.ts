export interface PowerBIEmbedProps {
  src?: string
  title?: string
}

export interface RefreshState {
  isLoading: boolean
  lastRefresh: Date | null
}

export type AnioFilter = '2025' | '2026'
