<template>
  <div>
    <ProfileModal
      :visible="showProfileModal"
      profileName="VieSAinte Mak"
      profileImg="/profile.jpg"
      @close="showProfileModal = false"
    />
    <main>
      <div class="colors-container">
        <div v-for="(color, index) in colors" :key="color.id" class="color-column">
          <ColorBox
            :color="color"
            :show-remove="colors.length > 3"
            :show-add="colors.length < 6"
            :color-index="index"
            @toggle-lock="toggleLock"
            @remove="removeColorColumn(index)"
            @add="addColorColumn(index)"
          />
          <AddColumnButton
            v-if="index < colors.length - 1"
            @add="addColorColumn(index)"
            class="add-btn"
          />
        </div>

        <!-- Bouton pour ouvrir le modal profil (exemple en haut à droite) -->
        <button class="open-profile-btn" @click="showProfileModal = true">
          <img src="@/assets/profil.jpg" alt="" /> MakVieSAinte
        </button>
      </div>

      <!-- Footer mobile avec les actions principales -->
      <div class="mobile-footer">
        <button class="footer-btn" :disabled="!canUndo" @click="undo" title="Palette précédente">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          <span>Précédent</span>
        </button>

        <button
          class="footer-btn primary"
          @click="generatePalette"
          title="Générer une nouvelle palette"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          <span>Générer</span>
        </button>

        <button class="footer-btn" :disabled="!canRedo" @click="redo" title="Palette suivante">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
          <span>Suivant</span>
        </button>
      </div>
    </main>
  </div>
</template>
<script lang="ts">
import { useColorStore } from "@/stores/colorStore";
import ColorBox from "@/components/ColorBox.vue";
import AddColumnButton from "@/components/AddColumnButton.vue";
import ProfileModal from "@/components/ProfileModal.vue";
import { Toaster, toast } from "vue-sonner";

export default {
  name: "HomeView",

  components: {
    ColorBox,
    AddColumnButton,
    ProfileModal,
  },

  data() {
    return {
      store: useColorStore(),
      showProfileModal: false,
    };
  },

  computed: {
    colors() {
      return this.store.colors;
    },
    currentIndex() {
      return this.store.currentIndex;
    },
    history() {
      return this.store.history;
    },
    canUndo() {
      return this.store.currentIndex > 0;
    },
    canRedo() {
      return this.store.currentIndex < this.store.history.length - 1;
    },
  },

  methods: {
    generatePalette() {
      this.store.generatePalette();
    },
    toggleLock(id: string) {
      this.store.toggleLock(id);
    },
    addColorColumn(index: number) {
      if (this.colors.length >= 6) {
        toast.warning("Impossible d'ajouter plus de 6 colonne.", {
          richColors: true,
        });
        return;
      }
      this.store.addColorColumn(index);
    },
    removeColorColumn(index: number) {
      this.store.removeColorColumn(index);
    },
    undo() {
      this.store.undo();
    },
    redo() {
      this.store.redo();
    },
  },

  mounted() {
    this.generatePalette();

    // Gestion du modal de bienvenue (localStorage, expiration 3 jours)
    const welcomeKey = "profileModalWelcome";
    const now = Date.now();
    const stored = localStorage.getItem(welcomeKey);
    let showModal = false;
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (!data.expire || now > data.expire) {
          showModal = true;
        }
      } catch {
        showModal = true;
      }
    } else {
      showModal = true;
    }
    if (showModal) {
      this.showProfileModal = true;
      localStorage.setItem(welcomeKey, JSON.stringify({ expire: now + 3 * 24 * 60 * 60 * 1000 }));
    }

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        this.generatePalette();
      }
    });
  },
};
</script>

<style scoped>
/* Bouton d'ouverture du profil */
.open-profile-btn {
  position: fixed;
  bottom: 13px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-items: start;
  gap: 3px;
  z-index: 1100;
  background: linear-gradient(90deg, #f3f3f2 0%, #fdfefd 100%);
  color: #333;
  border: 1px solid #f3f3f2;
  border-radius: 99999999px;
  padding: 3px 8px 3px 4px;
  font-weight: 600;
  font-size: 0.6rem;
  line-height: 0px;
  cursor: pointer;
  transform: scale(1);
  transform-origin: right;
  will-change: auto;
  transition:
    background 0.3s,
    color 0.3s,
    border 0.3s,
    transform 0.3s,
    all 0.3s ease;
}

.open-profile-btn img {
  width: 20px;
  height: 20px;
  border-radius: 999999px;
}

.open-profile-btn:hover {
  will-change: auto;
  transform: scale(1.1);
}

.colors-container {
  display: flex;
  flex: 1;
  height: calc(100vh - 56px);
  padding: 0;
  margin: 0;
}

.color-column {
  height: 100% !important;
  flex: 1;
  position: relative;
  display: flex;
}

.color-column:hover .add-btn {
  opacity: 1;
}

/* Masquer les éléments mobiles sur desktop */
.mobile-add-column,
.mobile-footer {
  display: none;
}

/* Styles pour mobile inspirés de Coolors */
/* Styles responsive */
@media (max-width: 768px) {
  main {
    height: calc(100vh - 56px - 80px);
  }

  .colors-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .add-btn {
    display: none;
  }

  .mobile-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding: 12px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    z-index: 100;
    height: 80px;
    box-sizing: border-box;
  }

  .footer-btn {
    flex: 1;
    background: transparent;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    padding: 12px 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #666;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .footer-btn:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.2);
  }

  .footer-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .footer-btn.primary {
    background: #007aff;
    color: white;
    border-color: #007aff;
  }

  .footer-btn.primary:hover {
    background: #0056cc;
    border-color: #0056cc;
  }

  .footer-btn svg {
    width: 20px;
    height: 20px;
  }
}
</style>
