<template>
  <!-- <div> -->
    <div class="color-box" :style="{ backgroundColor: color.hex }">
      <div class="controls">
        <div class="controls-right">
          <button @click="toggleLock" class="control-btn" :title="color.locked ? 'Déverrouiller' : 'Verrouiller'">
            <Lock v-if="color.locked" class="icon" />
            <Unlock v-else class="icon" />
          </button>
          <button @click="copyToClipboard" class="control-btn" title="Copier le code">
            <Check v-if="copied" class="icon" />
            <Clipboard v-else class="icon" />
          </button>
          <button v-if="showRemove" @click="removeColumn" class="control-btn" title="Supprimer la colonne">
            <X class="icon" />
          </button>
        </div>
      </div>
      <div class="content">
        <div class="hex-code" @click="copyToClipboard">{{ color.hex.substring(1).toUpperCase() }}</div>
      </div>
    </div>
  <!-- </div> -->
</template>


<script lang="ts">
import { ref } from 'vue'
import type { Color } from '../types/types'
import { Lock, Unlock, Clipboard, Check, X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

export default {
  name: 'ColorBox',
  components: {
    Lock,
    Unlock,
    Clipboard,
    Check,
    X
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

  methods: {
    async copyToClipboard() {
      await navigator.clipboard.writeText(this.color.hex)
      this.copied = true
      toast.success('Couleur copiée', {
        description: this.color.hex,
      })
      setTimeout(() => {
        this.copied = false
      }, 2000)
    },
    toggleLock() {
      this.$emit('toggle-lock', this.color.id)
      if (this.color.locked) {
        toast.warning('Déverrouillée', {
          description: `La couleur ${this.color.hex} est maintenant modifiable.`
        })
      } else {
        toast.success('Verrouillée', {
          description: `La couleur ${this.color.hex} est maintenant verrouillée.`
        })
      }
    },
    removeColumn() {
      this.$emit('remove')
      toast.error('Colonne supprimée', {
        description: `La couleur ${this.color.hex} a été retirée.`
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

.controls {
  position: absolute;
  top: 0;
  right: 0;
  padding: 20px;
  display: flex;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.color-box:hover .controls {
  opacity: 1;
}

.controls-right {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 10px;
}

.control-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  font-size: 1.2em;
  color: white;
  opacity: 0.8;
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.control-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.lock-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2.5em;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 60px; /* Pour compenser l'espace des boutons en haut */
}

.hex-code {
  color: white;
  font-size: 1.8em;
  font-weight: bold;
  letter-spacing: 2px;
  cursor: pointer;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  text-align: center;
  font-family: 'Karla', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.hex-code:hover {
  transform: scale(1.1);
}

.remove {
  color: rgba(255, 255, 255, 0.8);
}


.icon {
  width: 1.5em;
  height: 1.5em;
  vertical-align: middle;
}
</style>


