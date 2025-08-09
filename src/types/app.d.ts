// app.d.ts
import { ComponentCustomProperties } from 'vue'
import { Palette } from './types'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $palette: Palette
  }
}

export {}
