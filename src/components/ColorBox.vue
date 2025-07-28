<template>
  <div class="color-box" :style="{ backgroundColor: color.hex }">
    <div class="controls">
      <div class="controls-right">
        <button @click="toggleLock" class="control-btn" :title="color.locked ? 'Déverrouiller' : 'Verrouiller'">
          {{ color.locked ? '🔒' : '🔓' }}
        </button>
        <button @click="copyToClipboard" class="control-btn" title="Copier le code">
          {{ copied ? '✓' : '📋' }}
        </button>
        <button v-if="showRemove" @click="$emit('remove')" class="control-btn" title="Supprimer la colonne">
          ✕
        </button>
      </div>
    </div>
    <div class="content">
      <div class="hex-code" @click="copyToClipboard">{{ color.hex.toUpperCase() }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import type { Color } from '../types/types'

export default {
  name: 'ColorBox',

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
      setTimeout(() => {
        this.copied = false
      }, 2000)
    },
    toggleLock() {
      this.$emit('toggle-lock', this.color.id)
    }
  }
}
</script>

<style scoped>
.color-box {
  height: calc(100vh - 56px);
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.3s ease;
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
}

.hex-code:hover {
  transform: scale(1.1);
}

.remove {
  color: rgba(255, 255, 255, 0.8);
}
</style>


