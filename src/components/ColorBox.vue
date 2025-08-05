<template>
    <div class="color-box" :style="{ backgroundColor: color.hex }">
      <!-- Affichage desktop (colonnes verticales) -->
      <div class="content desktop-layout">
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

      <!-- Affichage mobile (bandes horizontales) -->
      <div class="content mobile-layout">
        <!-- Code hex à gauche -->
        <div class="mobile-hex" @click="copyToClipboard" :style="{ color: getContrastText(color.hex) }">
          {{ color.hex.toUpperCase() }}
        </div>

        <!-- Actions à droite -->
        <div class="mobile-actions">
          <button @click="toggleLock" class="mobile-action-btn" :class="color.locked ? 'locked' : ''">
            <Lock v-if="color.locked" class="icon" />
            <Unlock v-else class="icon" />
          </button>
          <button @click="copyToClipboard" class="mobile-action-btn">
            <Check v-if="copied" class="icon" />
            <Copy v-else class="icon" />
          </button>
          <button v-if="showRemove" @click="removeColumn" class="mobile-action-btn remove">
            <X class="icon" />
          </button>
          <button v-if="showAdd" @click="addColumn" class="mobile-action-btn add">
            <Plus class="icon" />
          </button>
        </div>
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

.color-box:hover {
  flex: 1.2;
}

/* Layout desktop par défaut */
.desktop-layout {
  display: flex;
  flex: 1;
  justify-content: end;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 90px;
}

.mobile-layout {
  display: none;
}

.controls {
  display: flex;
  flex-direction: column-reverse;
  gap: 2px;
  padding: 0px;
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

.color-name-label {
  font-size: 0.85em;
  opacity: 0.8;
  text-align: center;
  margin-top: 0px;
  margin-bottom: 0px;
  letter-spacing: 0.5px;
  font-family: 'Karla', Arial, sans-serif;
}

.icon {
  width: 1.2em;
  height: 1.2em;
  vertical-align: middle;
}

/* Tooltips */
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
  bottom: 90%;
  font-size: 0.70em;
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

/* Styles mobile - bandes horizontales inspirées de Coolors */
@media (max-width: 768px) {
  .color-box {
    width: 100%;
    height: auto;
    min-height: 80px;
    max-height: none;
    flex: 1;
    border-radius: 0;
    margin: 0;
    box-shadow: none;
    display: flex;
    position: relative;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .color-box:hover {
    flex: 1; /* Pas d'agrandissement sur mobile */
  }

  /* Masquer le layout desktop */
  .desktop-layout {
    display: none;
  }

  /* Afficher le layout mobile */
  .mobile-layout {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 20px;
    min-height: 80px;
  }

  /* Actions à gauche */
  .mobile-actions {
    display: flex;
    gap: 15px;
    align-items: center;
  }

  .mobile-action-btn {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    opacity: 0.8;
  }

  .mobile-action-btn:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }

  .mobile-action-btn.locked {
    opacity: 1;
    background: rgba(255, 255, 255, 0.4);
  }

  .mobile-action-btn.remove {
    background: rgba(255, 0, 0, 0.2);
  }

  .mobile-action-btn.remove:hover {
    background: rgba(255, 0, 0, 0.3);
  }

  .mobile-action-btn .icon {
    width: 20px;
    height: 20px;
    color: inherit;
  }

  /* Code hex à droite */
  .mobile-hex {
    font-size: 1.2em;
    font-weight: bold;
    letter-spacing: 1px;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.2s ease;
    font-family: 'Karla', monospace;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }

  .mobile-hex:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.02);
  }
}

@media (max-width: 480px) {
  .mobile-layout {
    padding: 0 15px;
    min-height: 70px;
  }

  .mobile-actions {
    gap: 12px;
  }

  .mobile-action-btn {
    width: 36px;
    height: 36px;
  }

  .mobile-action-btn .icon {
    width: 18px;
    height: 18px;
  }

  .mobile-hex {
    font-size: 1.1em;
    padding: 6px 10px;
  }
}
</style>


