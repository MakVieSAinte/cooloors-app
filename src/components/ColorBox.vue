<template>
    <div class="color-box" :style="{ backgroundColor: color.hex }">
      <div class="content">

        <div class="controls">
          <div class="tooltip-group">
            <button @click="toggleLock" class="control-btn lock" :class="color.locked ? 'locked' : ''">
              <Lock v-if="color.locked" class="icon" :style="{ color: getContrastText(color.hex) }" />
              <Unlock v-else class="icon" :style="{ color: getContrastText(color.hex) }" />
              <span class="tooltip">{{ color.locked ? 'Déverrouiller' : 'Verrouiller' }}</span>
            </button>
          </div>
          <div class="tooltip-group">
            <button @click="copyToClipboard" class="control-btn">
              <Check v-if="copied" class="icon" :style="{ color: getContrastText(color.hex) }" />
              <Copy v-else class="icon" :style="{ color: getContrastText(color.hex) }" />
              <span class="tooltip">Copier</span>
            </button>
          </div>
          <div class="tooltip-group" v-if="showRemove">
            <button @click="removeColumn" class="control-btn">
              <X class="icon" :style="{ color: getContrastText(color.hex) }" />
              <span class="tooltip">Supprimer</span>
            </button>
          </div>
        </div>

        <div
          class="hex-code"
          @click="copyToClipboard"
          :style="{ color: getContrastText(color.hex) }"
        >
          {{ color.hex.substring(1).toUpperCase() }}
        </div>
        <div class="color-name-label" :style="{ color: getContrastText(color.hex) }">{{ colorName }}</div>
      </div>
    </div>
</template>


<script lang="ts">
import { ref, computed } from 'vue'
import type { Color } from '../types/types'
import { Lock, Unlock, Clipboard, Check, X, Copy } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { getColorName } from '../utils/colorName'

export default {
  name: 'ColorBox',
  components: {
    Lock,
    Unlock,
    Clipboard,
    Check,
    X,
    Copy
  },

  props: {
    color: {
      type: Object as () => Color,
      required: true
    },
    showRemove: {
      type: Boolean,
      default: false
    }
  },

  emits: ['toggle-lock', 'remove'],

  data() {
    return {
      copied: false
    }
  },

  computed: {
    colorName() {
      return getColorName(this.color.hex)
    }
  },

  methods: {
    getContrastText(hex) {
      // Enlève le # si présent
      hex = hex.replace('#', '');
      // Convertit en RGB
      const r = parseInt(hex.substr(0,2),16);
      const g = parseInt(hex.substr(2,2),16);
      const b = parseInt(hex.substr(4,2),16);
      // Calcul de la luminance
      const luminance = (0.299*r + 0.587*g + 0.114*b)/255;
      // Retourne noir si fond clair, blanc si fond foncé
      return luminance > 0.6 ? '#222' : '#fff';
    },
    async copyToClipboard() {
      await navigator.clipboard.writeText(this.color.hex)
      this.copied = true
      toast.success('Couleur copiée', {
        description: this.color.hex,
        richColors: true,
      })
      setTimeout(() => {
        this.copied = false
      }, 2000)
    },
    toggleLock() {
      this.$emit('toggle-lock', this.color.id)
      if (this.color.locked) {
        toast.success('Colonne verrouillée', {
          description: `La couleur ${this.color.hex} est maintenant verrouillée.`,
          richColors: true,
        })
      } else {
        toast.warning('Colonne déverrouillée', {
          description: `La couleur ${this.color.hex} est maintenant modifiable.`,
          richColors: true,
        })
      }
    },
    removeColumn() {
      this.$emit('remove')
      toast.error('Colonne supprimée', {
        description: `La couleur ${this.color.hex} a été retirée.`,
        richColors: true,
      })
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Karla:wght@400;700&display=swap');

.color-box {
  height: calc(100vh - 56px);
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.3s ease;
  font-family: 'Karla', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  min-width: 0;
}

@media (max-width: 768px) {
  .color-box {
    width: 100vw;
    min-width: 100vw;
    max-width: 100vw;
    height: calc(100vh / var(--color-count, 5));
    min-height: 56px;
    max-height: none;
    flex: 1 1 0%;
    border-radius: 0 !important;
    margin: 0 !important;
    box-shadow: none !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0;
    gap: 0;
    position: relative;
  }
  .controls {
    padding: 10px 0 0 0;
    position: absolute;
    top: 0;
    right: 0;
  }
  .hex-code {
    font-size: 1.3em;
    padding: 0;
    color: #222;
    text-shadow: none;
    font-weight: bold;
    letter-spacing: 1.5px;
    text-align: left;
    margin-left: 18px;
  }
}

@media (max-width: 480px) {
  .color-box {
    height: calc(100vh / var(--color-count, 5));
    min-height: 48px;
  }
  .hex-code {
    font-size: 1.1em;
    margin-left: 12px;
  }
}
/* Tooltips façon Coolors */

.tooltip-group {
  position: relative;
  display: inline-block;
}
.tooltip {
  visibility: hidden;
  opacity: 0;
  width: max-content;
  background: #000;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 10px;
  position: absolute;
  z-index: 999999999999999999px;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  bottom: 110%;
  font-size: 0.95em;
  font-weight: 500;
  pointer-events: none;
  transition: opacity 0.18s, visibility 0.18s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.13);
  white-space: nowrap;
}
.tooltip-group:hover .tooltip,
.tooltip-group:focus-within .tooltip {
  z-index: 9999999999999999999999px;
  visibility: visible;
  opacity: 1;
}

/* Supprimer tout scroll horizontal et palette-row en mobile */
@media (max-width: 768px) {
  .palette-row {
    display: block !important;
    flex-direction: column !important;
    overflow-x: unset !important;
    width: 100vw !important;
    padding: 0 !important;
    gap: 0 !important;
    scroll-snap-type: none !important;
  }
}

.color-box:hover {
  flex: 1.2;
}

.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 100px;
}

.controls {
  display: flex;
  flex-direction: column-reverse;
  gap: 15px;
  padding: 0px;
  display: flex;
  transition: opacity 0.3s ease;
}

.control-btn {
  background: none;
  border-radius: 5px;
  border: none;
  padding: 8px;
  cursor: pointer;
  font-size: 1.2em;
  color: white;
  opacity: 0;
  transition: all 0.33s ease;
  will-change: auto;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.color-box:hover .controls .control-btn {
  opacity: 0.8;
}

.color-box:hover .controls .control-btn.locked {
  opacity: 1;
}

.control-btn:hover {
  background: #ffffff15;
  opacity: 1;
}

.control-btn.locked {
  opacity: 1;
}

.hex-code {
  color: white;
  font-size: 1.8em;
  font-weight: bold;
  letter-spacing: 2px;
  cursor: pointer;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  padding: 4px 20px;
  margin-top: 20px;
  border-radius: 7px;
  will-change: auto;
  text-align: center;
  font-family: 'Karla', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.hex-code:hover {
  background: #ffffff15;
}

.remove {
  color: rgba(255, 255, 255, 0.8);
}

.icon {
  width: 1.5em;
  height: 1.5em;
  vertical-align: middle;
}

.color-name-label {
  font-size: 0.85em;
  opacity: 0.8;
  text-align: center;
  margin-top: 0px;
  margin-bottom: 0px;
  letter-spacing: 0.5px;
  font-family: 'Karla', Arial, sans-serif;
}
</style>


