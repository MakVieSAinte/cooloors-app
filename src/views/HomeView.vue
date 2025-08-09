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
            class="icon-svg"
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
            class="icon-svg"
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
            class="icon-svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
          <span>Suivant</span>
        </button>

        <button class="footer-btn" @click="savePalette" title="Sauvegarder la palette">
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
          <span>Enregistrer</span>
        </button>

        <button class="footer-btn" @click="fetchPalettes" title="Mes palettes">
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
              d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z"
            />
          </svg>
          <span>Palettes</span>
        </button>
      </div>
    </main>
  </div>
</template>
<script lang="ts">
import { useColorStore } from '@/stores/colorStore'
import ColorBox from '@/components/ColorBox.vue'
import AddColumnButton from '@/components/AddColumnButton.vue'
import ProfileModal from '@/components/ProfileModal.vue'
import { Toaster, toast } from 'vue-sonner'

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

  methods: {
    generatePalette() {
      this.store.generatePalette()
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
      toast.info('Chargement des palettes', {
        richColors: true,
      })
      // Ici, vous pouvez ajouter la logique pour charger les palettes enregistrées
      this.showProfileModal = true // Pour l'instant, on ouvre juste le modal profil
    },
  },

  mounted() {
    this.generatePalette()

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
