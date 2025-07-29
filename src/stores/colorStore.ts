import { defineStore } from 'pinia'
import type { Color, ColorHistory } from '../types/types'

export const useColorStore = defineStore('color', {
  state: () => ({
    colors: [] as Color[],
    history: [] as ColorHistory[],
    currentIndex: -1,
    minColors: 4, // Minimum de 4 couleurs
    maxColors: 7, // Maximum de 7 couleurs
  }),

  actions: {
    generateRandomColor(): string {
      return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    },

    createColor(): Color {
      return {
        id: crypto.randomUUID(),
        hex: this.generateRandomColor(),
        locked: false,
      }
    },

    generatePalette() {
      const newColors = this.colors.length > 0
        ? this.colors.map(color => ({
            id: color.locked ? color.id : crypto.randomUUID(),
            hex: color.locked ? color.hex : this.generateRandomColor(),
            locked: color.locked
          }))
        : Array(4).fill(null).map(() => this.createColor()) // 4 couleurs par défaut

      this.addToHistory(newColors)
      this.colors = newColors
    },

    addToHistory(colors: Color[]) {
      this.currentIndex++
      this.history = this.history.slice(0, this.currentIndex)
      this.history.push({
        colors: JSON.parse(JSON.stringify(colors)),
        timestamp: Date.now(),
      })
    },

    toggleLock(id: string) {
      const color = this.colors.find(c => c.id === id)
      if (color) {
        color.locked = !color.locked
      }
    },

    undo() {
      if (this.currentIndex > 0) {
        this.currentIndex--
        this.colors = JSON.parse(JSON.stringify(this.history[this.currentIndex].colors))
      }
    },

    redo() {
      if (this.currentIndex < this.history.length - 1) {
        this.currentIndex++
        this.colors = JSON.parse(JSON.stringify(this.history[this.currentIndex].colors))
      }
    },

    addColorColumn(index: number) {
      if (this.colors.length >= this.maxColors) return // Vérifie si on a atteint le maximum
      const newColors = [...this.colors]
      newColors.splice(index + 1, 0, this.createColor())
      this.addToHistory(newColors)
      this.colors = newColors
    },

    removeColorColumn(index: number) {
      if (this.colors.length <= this.minColors) return // Garde au moins 4 colonnes
      const newColors = this.colors.filter((_, i) => i !== index)
      this.addToHistory(newColors)
      this.colors = newColors
    },
    setColors(hexArray: string[]) {
      // Remplace la palette actuelle par un tableau de couleurs hexadécimales (sans lock)
      this.colors = hexArray.map(hex => ({
        id: crypto.randomUUID(),
        hex,
        locked: false
      }))
      this.addToHistory(this.colors)
    },
  },
})
