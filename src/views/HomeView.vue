<template>
  <div>
  <ProfileModal :visible="showProfileModal" @close="showProfileModal = false" />
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
            v-if="index < colors.length - 1 && !showProfileModal"
            @add="addColorColumn(index)"
            class="add-btn"
          />
        </div>

        <!-- Bouton pour ouvrir le modal profil (exemple en haut à droite) -->
        <button class="open-profile-btn" @click="showProfileModal = true">
          <img :src="profilImg" alt="" /> MakVieSAinte
        </button>
      </div>

      <!-- Footer mobile (maquette) -->
      <div class="mobile-footer">
        <button
          class="generate-btn"
          @click="generatePalette"
          title="Générer une nouvelle palette"
        >
          Generer
        </button>

        <div class="footer-icons">
          <button class="footer-icon" :disabled="!canUndo" @click="undo" title="Annuler">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="icon-svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>
          </button>
          <button class="footer-icon" :disabled="!canRedo" @click="redo" title="Rétablir">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="icon-svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
              />
            </svg>
          </button>
          <!-- Sauvegarder (coeur, même icône que desktop) -->
          <button class="footer-icon" @click="saveCurrentPalette" title="Sauvegarder">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="icon-svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>
          <button class="footer-icon" @click="fetchPalettes" title="Palettes">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="icon-svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z"/>
            </svg>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
<script lang="ts">
import { useColorStore } from '@/stores/colorStore'
import ColorBox from '@/components/ColorBox.vue'
import AddColumnButton from '@/components/AddColumnButton.vue'
import ProfileModal from '@/components/ProfileModal.vue'
import { toast } from 'vue-sonner'
import profilImg from '@/assets/profil.jpg'

export default {
  name: 'HomeView',

  components: {
    ColorBox,
    AddColumnButton,
    ProfileModal,
  },

  data() {
    return {
      store: useColorStore(),
  showProfileModal: false,
  profilImg,
    }
  },

  computed: {
    colors() {
      return this.store.colors
    },
    currentIndex() {
      return this.store.currentIndex
    },
    history() {
      return this.store.history
    },
    canUndo() {
      return this.store.currentIndex > 0
    },
    canRedo() {
      return this.store.currentIndex < this.store.history.length - 1
    },
  },

  watch: {
    showProfileModal(val: boolean) {
      document.documentElement.classList.toggle('modal-open', !!val)
    },
  },

  unmounted() {
    document.documentElement.classList.remove('modal-open')
  },

  methods: {
    generatePalette() {
      this.store.generatePalette()
    },
    saveCurrentPalette() {
      // Deleguer la sauvegarde réelle à App.vue pour réutiliser sa logique Supabase
      window.dispatchEvent(new Event('save-current-palette'))
    },
    toggleLock(id: string) {
      this.store.toggleLock(id)
    },
    addColorColumn(index: number) {
      if (this.colors.length >= 6) {
        toast.warning("Impossible d'ajouter plus de 6 colonne.", {
          richColors: true,
        })
        return
      }
      this.store.addColorColumn(index)
    },
    removeColorColumn(index: number) {
      this.store.removeColorColumn(index)
    },
    undo() {
      this.store.undo()
    },
    redo() {
      this.store.redo()
    },
    savePalette() {
      toast.info('Palette sauvegardée', {
        richColors: true,
      })
      // Ici, vous pouvez ajouter la logique pour sauvegarder la palette
    },
    fetchPalettes() {
      // Demander à l’app (App.vue) d’ouvrir la modale palettes
      window.dispatchEvent(new Event('open-palettes-modal'))
    },
  },

  mounted() {
    // Ne génère pas si des couleurs existent déjà (ex: import depuis la page de partage)
    if (!this.store.colors || this.store.colors.length === 0) {
      this.generatePalette()
    } else {
      // S'assure que la variable CSS est à jour pour le layout
      document.documentElement.style.setProperty('--color-count', String(this.store.colors.length))
    }

    // Gestion du modal de bienvenue (localStorage, expiration 3 jours)
    const welcomeKey = 'profileModalWelcome'
    const now = Date.now()
    const stored = localStorage.getItem(welcomeKey)
    let showModal = false
    if (stored) {
      try {
        const data = JSON.parse(stored)
        if (!data.expire || now > data.expire) {
          showModal = true
        }
      } catch {
        showModal = true
      }
    } else {
      showModal = true
    }
    if (showModal) {
      this.showProfileModal = true
      localStorage.setItem(welcomeKey, JSON.stringify({ expire: now + 3 * 24 * 60 * 60 * 1000 }))
    }

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault()
        this.generatePalette()
      }
    })
  },
}
</script>

<style scoped></style>
