declare module 'chroma-js' {
  import type { ChromaStatic } from '@/types/types'
  const chroma: ChromaStatic
  export default chroma
}

declare module 'color-namer' {
  function namer(color: string): {
    [key: string]: Array<{
      name: string
      hex: string
      distance: number
    }>
  }
  export default namer
}

declare module 'virtual:pwa-register' {
  export interface RegisterSWOptions {
    immediate?: boolean
    onNeedRefresh?: () => void
    onOfflineReady?: () => void
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
    onRegisterError?: (error: any) => void
  }

  export function registerSW(options?: RegisterSWOptions): () => void
}
