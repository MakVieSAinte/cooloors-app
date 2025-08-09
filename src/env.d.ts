/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'chroma-js' {
  const chroma: import('./types/types').ChromaStatic
  export default chroma
}

declare module 'color-namer' {
  function namer(color: string): {
    [key: string]: Array<{ name: string; hex: string; distance: number }>
  }
  export default namer
}
