<template>
  <div class="app" :class="{ dark: isDarkMode }">
  <Toaster :position="toasterPosition" :expand="false" :theme="isDarkMode ? 'dark' : 'light'" />

    <Navbar
      :canUndo="canUndo"
      :canRedo="canRedo"
      :isDarkMode="isDarkMode"
      :user="user"
      :mobileMenuOpen="mobileMenuOpen"
      @undo="handleUndo"
      @redo="handleRedo"
      @toggle-theme="toggleTheme"
      @save-palette="savePalette"
      @fetch-palettes="fetchPalettes"
      @login-figma="loginFigma"
      @logout="logout"
      @show-modal-profil="showModalProfil = true"
      @toggle-mobile-menu="toggleMobileMenu"
      @close-mobile-menu="closeMobileMenu"
    />

    <router-view />

    <PalettesModal
      :showPalettesModal="showPalettesModal"
      :palettes="palettes"
      :loadingPalettes="loadingPalettes"
      @close="showPalettesModal = false"
      @toggle-actions="togglePaletteActions"
      @close-actions="closePaletteActions"
      @load-palette="loadPalette"
      @print-palette="printPalette"
      @share-palette="sharePalette"
      @delete-palette="deletePalette"
    />

    <DeleteConfirmationModal
      :show="showDeletePaletteModal"
      @cancel="cancelDeletePalette"
      @confirm="confirmDeletePalette"
    />

    <ProfileModal
      v-if="user"
      :user="user"
      :show="showModalProfil"
      @close="showModalProfil = false"
      @logout="logout"
    />

    <!-- Modal de bienvenue (affiché une seule fois) -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useColorStore } from '@/stores/colorStore'
import { supabase } from './supabase'
import jsPDF from 'jspdf'
import { Toaster, toast } from 'vue-sonner'
import 'vue-sonner/style.css'

// Import des composants
import Navbar from '@/components/layout/Navbar.vue'
import PalettesModal from '@/components/layout/PalettesModal.vue'
import DeleteConfirmationModal from '@/components/layout/DeleteConfirmationModal.vue'
import ProfileModal from '@/components/layout/ProfileModal.vue'

export default defineComponent({
  name: 'App',
  components: {
    Toaster,
    Navbar,
    PalettesModal,
    DeleteConfirmationModal,
    ProfileModal,
  },
  data() {
    return {
      store: useColorStore(),
      isDarkMode: false,
      user: null as any,
      showPalettesModal: false,
      showModalProfil: false,
      showDeletePaletteModal: false,
      showWelcomeModal: false,
      paletteToDelete: null,
      palettes: [],
      loadingPalettes: false,
      mobileMenuOpen: false,
  openPalettesHandler: null as ((e: Event) => void) | null,
  savePaletteHandler: null as ((e: Event) => void) | null,
  toasterPosition: 'bottom-center' as 'top-center' | 'bottom-center',
  toasterMedia: null as MediaQueryList | null,
  toasterMediaChangeHandler: null as ((e: MediaQueryListEvent) => void) | null,
    }
  },
  watch: {
    showPalettesModal: 'updateOverlayClass',
    showModalProfil: 'updateOverlayClass',
    showDeletePaletteModal: 'updateOverlayClass',
    showWelcomeModal: 'updateOverlayClass',
    mobileMenuOpen: 'updateOverlayClass',
  },
  async created() {
    // Restaure le thème depuis localStorage; par défaut: light
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      this.isDarkMode = true
    } else if (savedTheme === 'light' || savedTheme === null) {
      // Par défaut (aucune préférence): light
      this.isDarkMode = false
      if (savedTheme === null) {
        localStorage.setItem('theme', 'light')
      }
    } else {
      // Valeur spéciale éventuelle (ex: 'system') — fallback sur la préférence système
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    // Propager sur <html> pour CSS global et UA
  document.documentElement.classList.toggle('dark', this.isDarkMode)
  document.documentElement.style.colorScheme = this.isDarkMode ? 'dark' : 'light'
    // Écouter les changements de préférence système uniquement si l'utilisateur a choisi 'system'
    const prefersDarkMql = window.matchMedia('(prefers-color-scheme: dark)')
    prefersDarkMql.addEventListener('change', (e) => {
      if (localStorage.getItem('theme') === 'system') {
        this.isDarkMode = e.matches
        document.documentElement.classList.toggle('dark', this.isDarkMode)
        document.documentElement.style.colorScheme = this.isDarkMode ? 'dark' : 'light'
      }
    })
    // Modal de bienvenue (une seule fois)
    if (!localStorage.getItem('cooloors_welcome_shown')) {
      this.showWelcomeModal = true
      localStorage.setItem('cooloors_welcome_shown', '1')
    }
    // Vérifier si l'utilisateur est déjà connecté
    const {
      data: { user },
    } = await supabase.auth.getUser()
    this.user = user
    // Écoute les changements d'auth
    supabase.auth.onAuthStateChange((event, session) => {
      this.user = session?.user || null
    })

    // Écoute un événement global pour ouvrir la modale des palettes depuis d'autres vues
    this.openPalettesHandler = () => this.fetchPalettes()
    window.addEventListener('open-palettes-modal', this.openPalettesHandler)
    this.savePaletteHandler = () => this.savePalette()
    window.addEventListener('save-current-palette', this.savePaletteHandler)

    // Position responsive des toasts: top-center en mobile
    this.toasterMedia = window.matchMedia('(max-width: 768px)')
    const setToastPos = (matches: boolean) => {
      this.toasterPosition = matches ? 'top-center' : 'bottom-center'
    }
    setToastPos(this.toasterMedia.matches)
    this.toasterMediaChangeHandler = (e: MediaQueryListEvent) => setToastPos(e.matches)
    this.toasterMedia.addEventListener('change', this.toasterMediaChangeHandler)
  },
  beforeUnmount() {
    if (this.openPalettesHandler) {
      window.removeEventListener('open-palettes-modal', this.openPalettesHandler)
      this.openPalettesHandler = null
    }
    if (this.savePaletteHandler) {
      window.removeEventListener('save-current-palette', this.savePaletteHandler)
      this.savePaletteHandler = null
    }
    if (this.toasterMedia && this.toasterMediaChangeHandler) {
      this.toasterMedia.removeEventListener('change', this.toasterMediaChangeHandler)
      this.toasterMediaChangeHandler = null
      this.toasterMedia = null
    }
  },
  computed: {
    canUndo(): boolean {
      return this.store.currentIndex > 0
    },
    canRedo(): boolean {
      return this.store.currentIndex < this.store.history.length - 1
    },
  },
  methods: {
    // Génère un nom de palette générique du style "XDT787536" (alphanumérique)
    // length par défaut: 9, et plafonné à 15 caractères
    generatePaletteName(length: number = 15): string {
      // Style par défaut: 3 lettres + chiffres (ex: XDT787536)
      const maxLen = Math.min(Math.max(4, length), 15)
      const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ' // éviter I et O pour lisibilité
      const digits = '0123456789'
      const pick = (pool: string) => pool[Math.floor(Math.random() * pool.length)]
      let name = ''
      for (let i = 0; i < 3 && i < maxLen; i++) name += pick(letters)
      for (let i = name.length; i < maxLen; i++) name += pick(digits)
      return name
    },
    updateOverlayClass() {
      const anyOpen =
        this.showPalettesModal ||
        this.showModalProfil ||
        this.showDeletePaletteModal ||
        this.showWelcomeModal ||
        this.mobileMenuOpen
      document.documentElement.classList.toggle('modal-open', !!anyOpen)
    },
    // Navigation et actions utilisateur
    handleUndo() {
      this.store.undo()
    },
    handleRedo() {
      this.store.redo()
    },
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light')
  document.documentElement.classList.toggle('dark', this.isDarkMode)
  document.documentElement.style.colorScheme = this.isDarkMode ? 'dark' : 'light'
    },
    async loginFigma() {
      await supabase.auth.signInWithOAuth({ provider: 'figma' })
      toast.success('Redirection vers Figma')
    },
    async logout() {
      await supabase.auth.signOut()
      this.user = null
      toast.success('Déconnexion réussie')
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    closeMobileMenu() {
      this.mobileMenuOpen = false
    },
    closeWelcomeModal() {
      this.showWelcomeModal = false
    },
    async savePalette() {
      if (!this.user) {
        toast.error('Connexion requise pour sauvegarder vos palettes', {
          richColors: true,
        })
        return
      }
      if (!this.store.colors || this.store.colors.length === 0) {
        toast.warning('Palette vide', {
          richColors: true,
        })
        return
      }
      const colors = this.store.colors.map((c) => c.hex)
      // Vérifie si une palette identique existe déjà
      const { data: existingPalettes, error: fetchError } = await supabase
        .from('palettes')
        .select('colors')
        .eq('user_id', this.user.id)
      if (fetchError) {
        toast.error('Erreur lors de la vérification des palettes existantes', { richColors: true })
        return
      }
      if (
        existingPalettes &&
        existingPalettes.some(
          (p) =>
            Array.isArray(p.colors) &&
            p.colors.length === colors.length &&
            p.colors.every((col, idx) => col === colors[idx])
        )
      ) {
        toast.info('Cette palette existe déjà dans vos favoris.', { richColors: true })
        return
      }
      let error = null
  try {
        const res = await supabase.from('palettes').insert([
          {
            user_id: this.user.id,
            colors: colors,
    // Nom générique de type alphanumérique (ex: XDT787536), <= 15 caractères
    name: this.generatePaletteName(9),
          },
        ])
        error = res.error
      } catch (e) {
        console.error(e)
        toast.error('Erreur réseau. Vérifiez votre connexion.', {
          richColors: true,
        })
        return
      }
  if (error) {
        if (error.code === '42501' || error.code === 'permission_denied') {
          toast.error('Accès refusé', {
            richColors: true,
          })
        } else {
          toast.error('Erreur lors de la sauvegarde', {
            richColors: true,
          })
        }
      } else {
        toast.success('Palette sauvegardée !', {
          richColors: true,
        })
      }
    },

    async OpenModalProfil() {
      this.showModalProfil = true
    },

    togglePaletteActions(palette) {
      console.log('Toggle palette actions for palette:', palette.id)

      // Copier le tableau pour déclencher la réactivité
      const newPalettes = [...this.palettes]

      // Ferme tous les autres menus d'abord
      newPalettes.forEach((p) => {
        if (p.id !== palette.id && p.showActions) {
          p.showActions = false
        }
      })

      // Trouver la palette spécifique et basculer son état
      const targetPalette = newPalettes.find((p) => p.id === palette.id)
      if (targetPalette) {
        targetPalette.showActions = !targetPalette.showActions
        console.log('Setting showActions to:', targetPalette.showActions)
      }

      // Mettre à jour le tableau de palettes
      this.palettes = newPalettes
    },

    closePaletteActions(palette) {
      if (!palette) return
      console.log('Closing palette actions for palette:', palette.id)

      // Copier le tableau pour déclencher la réactivité
      const newPalettes = [...this.palettes]
      const targetPalette = newPalettes.find((p) => p.id === palette.id)

      if (targetPalette) {
        targetPalette.showActions = false
        this.palettes = newPalettes
      }
    },
    async fetchPalettes() {
      if (!this.user) {
        toast.info('Connectez-vous pour voir vos palettes.', {
          richColors: true,
        })
        return
      }
      this.loadingPalettes = true
      let data = null,
        error = null
      try {
        const res = await supabase
          .from('palettes')
          .select('*')
          .eq('user_id', this.user.id)
          .order('created_at', { ascending: false })
        data = res.data
        error = res.error
      } catch (e) {
        console.error(e)
        this.loadingPalettes = false
        toast.error('Impossible de charger les palettes.', {
          richColors: true,
        })
        return
      }
      this.loadingPalettes = false
      if (error) {
        toast.error('Erreur lors du chargement', {
          richColors: true,
        })
        return
      }
      if (!data || data.length === 0) {
        toast.info('Aucune palette trouvée', {
          richColors: true,
        })
      }
      // Initialiser la propriété showActions pour chaque palette
      this.palettes = (data || []).map((palette) => ({
        ...palette,
        showActions: false,
      }))
      this.showPalettesModal = true
    },
    loadPalette(palette) {
      if (!palette.colors) return
      this.store.setColors(palette.colors)
      this.showPalettesModal = false
    },
    deletePalette(palette) {
      if (!palette.id) return
      this.paletteToDelete = palette
      this.showDeletePaletteModal = true
    },
    cancelDeletePalette() {
      this.showDeletePaletteModal = false
      this.paletteToDelete = null
    },
    async confirmDeletePalette() {
      if (!this.paletteToDelete || !this.paletteToDelete.id) return
      let error = null
      try {
        const res = await supabase.from('palettes').delete().eq('id', this.paletteToDelete.id)
        error = res.error
      } catch (e) {
        console.error(e)
        toast.error('Impossible de supprimer la palette.', {
          richColors: true,
        })
        this.cancelDeletePalette()
        return
      }
      if (error) {
        toast.error('Erreur lors de la suppression', {
          richColors: true,
        })
      } else {
        toast.success('Palette supprimée', {
          richColors: true,
        })
        this.palettes = this.palettes.filter((p) => p.id !== this.paletteToDelete.id)
      }
      this.cancelDeletePalette()
    },
    printPalette(palette) {
  // Génération PDF avec jsPDF, style grille 2x3 (5 couleurs, 1 case vide), cartes maximisées
      const pdfW = 1091
      const pdfH = 768
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [pdfW, pdfH],
      })
  // Utiliser une police intégrée pour éviter tout chargement asynchrone
  doc.setFont('helvetica', 'normal')

      const renderPalettePDF = () => {
        // Marges minimales
  const marginX = 24
  const marginY = 24
  const gap = 16 // gap réduit pour gagner un peu de place visuelle
  // Calcul dynamique pour occuper presque tout l'espace
  const cellW = Math.floor((pdfW - marginX * 2 - gap * 2) / 3)
  // Réserver de l'espace en bas pour le texte du footer (augmentation pour un meilleur dégagement)
  const footerReserve = 56
  const cellH = Math.floor((pdfH - marginY * 2 - gap - footerReserve) / 2)
        const startX = marginX
        const startY = marginY

        // 6 cases: 2 lignes x 3 colonnes
        for (let i = 0; i < 6; i++) {
          const row = Math.floor(i / 3)
          const col = i % 3
          const x = startX + col * (cellW + gap)
          const y = startY + row * (cellH + gap)
          const color = palette.colors[i]
          if (color) {
            // Case remplie
            doc.setFillColor(color)
            doc.roundedRect(x, y, cellW, cellH, 28, 28, 'F')
            // Code hex en bas à gauche
            doc.setFontSize(28)
            const hexTextColor = getContrastText(color)
            doc.setTextColor(hexTextColor)
            doc.text(color.replace('#', '').toUpperCase(), x + 22, y + cellH - 22)
          } else {
            // Case vide: contour gris
            doc.setDrawColor('#CCCCCC')
            doc.setLineWidth(1)
            doc.roundedRect(x, y, cellW, cellH, 28, 28, 'S')
          }
        }

        // Footer: petit texte centré en bas
  const footerText = 'make with Kolor'
  const footerFontSize = 18 // plus lisible
  const padding = 32 // marge un peu plus large du bord
  doc.setFontSize(footerFontSize)
  doc.setTextColor('#111111')
  // Aligné à droite avec une marge
  doc.text(footerText, pdfW - padding, pdfH - padding, { align: 'right' })

  // Sauvegarde immédiate (sous geste utilisateur)
  doc.save((palette.name || 'palette') + '.pdf')
      }
      // Rendu synchrone
      renderPalettePDF()
      // Fonction utilitaire pour déterminer la couleur du texte (noir/blanc) selon le fond
      function getContrastText(hex) {
        // Enlève le # si présent
        hex = hex.replace('#', '')
        // Convertit en RGB
        const r = parseInt(hex.substr(0, 2), 16)
        const g = parseInt(hex.substr(2, 2), 16)
        const b = parseInt(hex.substr(4, 2), 16)
        // Calcul de la luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
        // Retourne noir si fond clair, blanc si fond foncé
        return luminance > 0.6 ? '#222' : '#fff'
      }
    },
    sharePalette(palette) {
      // Génère un lien de partage avec les couleurs encodées dans l'URL
      const colors = encodeURIComponent(palette.colors.join(','))
      const url = `${window.location.origin}/share/${colors}`
      navigator.clipboard.writeText(url)
      toast.success('Lien de partage copié !', {
        richColors: true,
      })

    },
  },
})
</script>
