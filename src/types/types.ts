export interface Color {
  id: string
  hex: string
  locked: boolean
}

export interface ColorHistory {
  colors: Color[]
  timestamp: number
}

export interface Palette: any {
  id: string 
  name: string
  colors: Color[]
  created_at: string
  showActions?: boolean
  user_id?: string
}

export interface ColorBoxProps {
  color: Color
  showRemove?: boolean
  showAdd?: boolean
  colorIndex: number
}

export interface PaletteModalProps {
  palettes: Palette[]
  visible: boolean
  onClose: () => void
  onToggleActions: (palette: Palette) => void
  onCloseActions: (palette: Palette) => void
  onLoadPalette: (palette: Palette) => void
  onPrintPalette: (palette: Palette) => void
  onSharePalette: (palette: Palette) => void
  onDeletePalette: (palette: Palette) => void
}

export interface ChromaColor {
  hex: () => string
  set: (channel: string, value: string | number) => ChromaColor
  analogous: (count?: number) => ChromaColor[]
  brighten: (value: number) => ChromaColor
  darken: (value: number) => ChromaColor
}

export interface ChromaScale {
  mode: (mode: string) => {
    colors: (count: number) => string[]
  }
}

export interface ChromaStatic {
  scale: (colors: ChromaColor[] | string[]) => ChromaScale
  random: () => ChromaColor
  (color: string): ChromaColor
}
