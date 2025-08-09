<template>
  <div class="color-box" :style="{ backgroundColor: color.hex }">
    <!-- Affichage desktop (colonnes verticales) -->
    <div class="content desktop-layout">
      <div class="controls">
        <div class="tooltip-group">
          <button
            @click="toggleLock"
            class="control-btn lock"
            :class="color.locked ? 'locked' : ''"
          >
            <Lock v-if="color.locked" class="icon" :style="{ color: getContrastText(color.hex) }" />
            <Unlock v-else class="icon" :style="{ color: getContrastText(color.hex) }" />
          </button>
          <span class="tooltip">{{ color.locked ? "Déverrouiller" : "Verrouiller" }}</span>
        </div>
        <div class="tooltip-group">
          <button @click="copyToClipboard" class="control-btn">
            <Check v-if="copied" class="icon" :style="{ color: getContrastText(color.hex) }" />
            <Copy v-else class="icon" :style="{ color: getContrastText(color.hex) }" />
          </button>
          <span class="tooltip">Copier</span>
        </div>
        <div class="tooltip-group" v-if="showRemove">
          <button @click="removeColumn" class="control-btn">
            <X class="icon" :style="{ color: getContrastText(color.hex) }" />
          </button>
          <span class="tooltip">Supprimer</span>
        </div>
      </div>

      <div class="hex-code" @click="copyToClipboard" :style="{ color: getContrastText(color.hex) }">
        {{ color.hex.substring(1).toUpperCase() }}
      </div>
      <div class="color-name-label" :style="{ color: getContrastText(color.hex) }">
        {{ colorName }}
      </div>
    </div>

    <!-- Affichage mobile (bandes horizontales) -->
    <div class="content mobile-layout">
      <!-- Code hex à gauche -->
      <div
        class="mobile-hex"
        @click="copyToClipboard"
        :style="{ color: getContrastText(color.hex) }"
      >
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
import { ref, computed } from "vue";
import type { Color } from "../types/types";
import { Lock, Unlock, Clipboard, Check, X, Copy } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { getColorName } from "../utils/colorName";

export default {
  name: "ColorBox",
  components: {
    Lock,
    Unlock,
    Clipboard,
    Check,
    X,
    Copy,
  },

  props: {
    color: {
      type: Object as () => Color,
      required: true,
    },
    showRemove: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["toggle-lock", "remove"],

  data() {
    return {
      copied: false,
    };
  },

  computed: {
    colorName() {
      return getColorName(this.color.hex);
    },
  },

  methods: {
    getContrastText(hex) {
      // Enlève le # si présent
      hex = hex.replace("#", "");
      // Convertit en RGB
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      // Calcul de la luminance
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      // Retourne noir si fond clair, blanc si fond foncé
      return luminance > 0.6 ? "#222" : "#fff";
    },
    async copyToClipboard() {
      await navigator.clipboard.writeText(this.color.hex);
      this.copied = true;
      toast.success("Couleur copiée", {
        richColors: true,
      });
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    },
    toggleLock() {
      this.$emit("toggle-lock", this.color.id);
      if (this.color.locked) {
        toast.info("Colonne verrouillée", {
          richColors: true,
        });
      } else {
        toast.warning("Colonne déverrouillée", {
          richColors: true,
        });
      }
    },
    removeColumn() {
      this.$emit("remove");
      toast.error("Colonne supprimée", {
        richColors: true,
      });
    },
  },
};
</script>

<style scoped>
/* Les styles ont été déplacés dans src/assets/main.css */
</style>
