import { defineStore } from 'pinia'
import type { Color, ColorHistory } from '../types/types'

export const useColorStore = defineStore('color', {
  state: () => ({
    colors: [] as Color[],
    history: [] as ColorHistory[],
    currentIndex: -1,
    minColors: 3, // Minimum de 4 couleurs
    maxColors: 6, // Maximum de 6 couleurs
    initialColumnCount: 4, // Nombre de colonnes à l'init
  }),

  actions: {
    generateRandomColor(): string {
      return (
        '#' +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, '0')
      )
    },

    createColor(): Color {
      return {
        id: crypto.randomUUID(),
        hex: this.generateRandomColor(),
        locked: false,
      }
    },

    generatePalette() {
      // Si aucune couleur, on regarde le localStorage pour le nombre de colonnes
      let nbCols = 4
      if (this.colors.length === 0) {
        const saved = localStorage.getItem('cooloors_column_count')
        if (saved) {
          const n = parseInt(saved, 10)
          if (!isNaN(n) && n >= this.minColors && n <= this.maxColors + 1) nbCols = n
        }
      } else {
        nbCols = this.colors.length
      }
      const newColors =
        this.colors.length > 0
          ? this.colors.map((color) => ({
              id: color.locked ? color.id : crypto.randomUUID(),
              hex: color.locked ? color.hex : this.generateRandomColor(),
              locked: color.locked,
            }))
          : Array(nbCols)
              .fill(null)
              .map(() => this.createColor())

      this.addToHistory(newColors)
      this.colors = newColors
      // Sauvegarde le nombre de colonnes
      localStorage.setItem('cooloors_column_count', String(newColors.length))

      // Mettre à jour la variable CSS pour le responsive
      document.documentElement.style.setProperty('--color-count', String(newColors.length))
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
      const color = this.colors.find((c) => c.id === id)
      if (color) {
        color.locked = !color.locked
      }
    },

    undo() {
      if (this.currentIndex > 0) {
        this.currentIndex--
        this.colors = JSON.parse(JSON.stringify(this.history[this.currentIndex].colors))
        // Mettre à jour la variable CSS
        document.documentElement.style.setProperty('--color-count', String(this.colors.length))
      }
    },

    redo() {
      if (this.currentIndex < this.history.length - 1) {
        this.currentIndex++
        this.colors = JSON.parse(JSON.stringify(this.history[this.currentIndex].colors))
        // Mettre à jour la variable CSS
        document.documentElement.style.setProperty('--color-count', String(this.colors.length))
      }
    },

    addColorColumn(index: number) {
      if (this.colors.length >= this.maxColors) return // Vérifie si on a atteint le maximum
      const newColors = [...this.colors]
      newColors.splice(index + 1, 0, this.createColor())
      this.addToHistory(newColors)
      this.colors = newColors
      // Sauvegarde le nombre de colonnes
      localStorage.setItem('cooloors_column_count', String(this.colors.length))
      // Mettre à jour la variable CSS
      document.documentElement.style.setProperty('--color-count', String(this.colors.length))
    },

    removeColorColumn(index: number) {
      if (this.colors.length <= this.minColors) return // Garde au moins 4 colonnes
      const newColors = this.colors.filter((_, i) => i !== index)
      this.addToHistory(newColors)
      this.colors = newColors
      // Sauvegarde le nombre de colonnes
      localStorage.setItem('cooloors_column_count', String(this.colors.length))
      // Mettre à jour la variable CSS
      document.documentElement.style.setProperty('--color-count', String(this.colors.length))
    },
    setColors(hexArray: string[]) {
      // Remplace la palette actuelle par un tableau de couleurs hexadécimales (sans lock)
      this.colors = hexArray.map((hex) => ({
        id: crypto.randomUUID(),
        hex,
        locked: false,
      }))
      this.addToHistory(this.colors)
      // Sauvegarde le nombre de colonnes
      localStorage.setItem('cooloors_column_count', String(this.colors.length))
      // Mettre à jour la variable CSS
      document.documentElement.style.setProperty('--color-count', String(this.colors.length))
    },
  },
})
