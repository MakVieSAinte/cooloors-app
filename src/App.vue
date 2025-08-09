<template>
  <div class="app" :class="{ dark: isDarkMode }">
    <Toaster position="bottom-center" :expand="false" :theme="isDarkMode ? 'dark' : 'light'" />

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
import { defineComponent } from "vue";
import { useColorStore } from "@/stores/colorStore";
import { supabase } from "./supabase";
import jsPDF from "jspdf";
import { Toaster, toast } from "vue-sonner";
import "vue-sonner/style.css";

// Import des composants
import Navbar from "@/components/layout/Navbar.vue";
import PalettesModal from "@/components/layout/PalettesModal.vue";
import DeleteConfirmationModal from "@/components/layout/DeleteConfirmationModal.vue";
import ProfileModal from "@/components/layout/ProfileModal.vue";

export default defineComponent({
  name: "App",
  components: {
    Toaster,
    Navbar,
    PalettesModal,
    DeleteConfirmationModal,
    ProfileModal
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
    };
  },
  async created() {
    // Restaure le thème depuis localStorage, sinon light par défaut
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      this.isDarkMode = true;
    } else {
      // Par défaut : light
      this.isDarkMode = false;
    }
    // Écouter les changements de préférence système
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        this.isDarkMode = e.matches;
      }
    });
    // Modal de bienvenue (une seule fois)
    if (!localStorage.getItem("cooloors_welcome_shown")) {
      this.showWelcomeModal = true;
      localStorage.setItem("cooloors_welcome_shown", "1");
    }
    // Vérifier si l'utilisateur est déjà connecté
    const {
      data: { user },
    } = await supabase.auth.getUser();
    this.user = user;
    // Écoute les changements d'auth
    supabase.auth.onAuthStateChange((event, session) => {
      this.user = session?.user || null;
    });
  },
  computed: {
    canUndo(): boolean {
      return this.store.currentIndex > 0;
    },
    canRedo(): boolean {
      return this.store.currentIndex < this.store.history.length - 1;
    },
  },
  methods: {
    // Navigation et actions utilisateur
    handleUndo() {
      this.store.undo();
    },
    handleRedo() {
      this.store.redo();
    },
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem("theme", this.isDarkMode ? "dark" : "light");
    },
    async loginFigma() {
      await supabase.auth.signInWithOAuth({ provider: "figma" });
      toast.success("Redirection vers Figma");
    },
    async logout() {
      await supabase.auth.signOut();
      this.user = null;
      toast.success("Déconnexion réussie");
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
    closeMobileMenu() {
      this.mobileMenuOpen = false;
    },
    closeWelcomeModal() {
      this.showWelcomeModal = false;
    },
    async savePalette() {
      if (!this.user) {
        toast.error("Connexion requise pour sauvegarder vos palettes", {
          richColors: true,
        });
        return;
      }
      if (!this.store.colors || this.store.colors.length === 0) {
        toast.warning("Palette vide", {
          richColors: true,
        });
        return;
      }
      const colors = this.store.colors.map((c) => c.hex);
      // Vérifie si une palette identique existe déjà
      const { data: existingPalettes, error: fetchError } = await supabase
        .from("palettes")
        .select("colors")
        .eq("user_id", this.user.id);
      if (fetchError) {
        toast.error("Erreur lors de la vérification des palettes existantes", { richColors: true });
        return;
      }
      if (existingPalettes && existingPalettes.some(p => Array.isArray(p.colors) && p.colors.length === colors.length && p.colors.every((col, idx) => col === colors[idx]))) {
        toast.info("Cette palette existe déjà dans vos favoris.", { richColors: true });
        return;
      }
      let error = null;
      try {
        const res = await supabase.from("palettes").insert([
          {
            user_id: this.user.id,
            colors: colors,
            name: "Palette du " + new Date().toLocaleString(),
          },
        ]);
        error = res.error;
      } catch (e) {
        toast.error("Erreur réseau. Vérifiez votre connexion.", {
          richColors: true,
        });
        return;
      }
      if (error) {
        if (error.code === "42501" || error.code === "permission_denied") {
          toast.error("Accès refusé", {
            richColors: true,
          });
        } else {
          toast.error("Erreur lors de la sauvegarde", {
            richColors: true,
          });
        }
      } else {
        toast.success("Palette sauvegardée !", {
          richColors: true,
        });
      }
    },

    async OpenModalProfil() {
      this.showModalProfil = true;
    },

    togglePaletteActions(palette) {
      console.log("Toggle palette actions for palette:", palette.id);

      // Copier le tableau pour déclencher la réactivité
      const newPalettes = [...this.palettes];

      // Ferme tous les autres menus d'abord
      newPalettes.forEach(p => {
        if (p.id !== palette.id && p.showActions) {
          p.showActions = false;
        }
      });

      // Trouver la palette spécifique et basculer son état
      const targetPalette = newPalettes.find(p => p.id === palette.id);
      if (targetPalette) {
        targetPalette.showActions = !targetPalette.showActions;
        console.log("Setting showActions to:", targetPalette.showActions);
      }

      // Mettre à jour le tableau de palettes
      this.palettes = newPalettes;
    },

    closePaletteActions(palette) {
      if (!palette) return;
      console.log("Closing palette actions for palette:", palette.id);

      // Copier le tableau pour déclencher la réactivité
      const newPalettes = [...this.palettes];
      const targetPalette = newPalettes.find(p => p.id === palette.id);

      if (targetPalette) {
        targetPalette.showActions = false;
        this.palettes = newPalettes;
      }
    },    async fetchPalettes() {
      if (!this.user) {
        toast.info("Connectez-vous pour voir vos palettes.", {
          richColors: true,
        });
        return;
      }
      this.loadingPalettes = true;
      let data = null,
        error = null;
      try {
        const res = await supabase
          .from("palettes")
          .select("*")
          .eq("user_id", this.user.id)
          .order("created_at", { ascending: false });
        data = res.data;
        error = res.error;
      } catch (e) {
        this.loadingPalettes = false;
        toast.error("Impossible de charger les palettes.", {
          richColors: true,
        });
        return;
      }
      this.loadingPalettes = false;
      if (error) {
        toast.error("Erreur lors du chargement", {
          richColors: true,
        });
        return;
      }
      if (!data || data.length === 0) {
        toast.info("Aucune palette trouvée", {
          richColors: true,
        });
      }
      // Initialiser la propriété showActions pour chaque palette
      this.palettes = (data || []).map(palette => ({
        ...palette,
        showActions: false
      }));
      this.showPalettesModal = true;
    },
    loadPalette(palette) {
      if (!palette.colors) return;
      this.store.setColors(palette.colors);
      this.showPalettesModal = false;
    },
    deletePalette(palette) {
      if (!palette.id) return;
      this.paletteToDelete = palette;
      this.showDeletePaletteModal = true;
    },
    cancelDeletePalette() {
      this.showDeletePaletteModal = false;
      this.paletteToDelete = null;
    },
    async confirmDeletePalette() {
      if (!this.paletteToDelete || !this.paletteToDelete.id) return;
      let error = null;
      try {
        const res = await supabase.from("palettes").delete().eq("id", this.paletteToDelete.id);
        error = res.error;
      } catch (e) {
        toast.error("Impossible de supprimer la palette.", {
          richColors: true,
        });
        this.cancelDeletePalette();
        return;
      }
      if (error) {
        toast.error("Erreur lors de la suppression", {
          richColors: true,
        });
      } else {
        toast.success("Palette supprimée", {
          richColors: true,
        });
        this.palettes = this.palettes.filter((p) => p.id !== this.paletteToDelete.id);
      }
      this.cancelDeletePalette();
    },
    printPalette(palette) {
      // Génération PDF avec jsPDF, style grille 2x3 (5 couleurs, 1 case vide), cartes maximisées
      const pdfW = 1091;
      const pdfH = 768;
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [pdfW, pdfH],
      });

      // Intégration police Karla (nécessite le fichier Karla-Regular.ttf dans public/)
      fetch('/Karla-Regular.ttf')
        .then((res) => res.arrayBuffer())
        .then((fontBuffer) => {
          // Convertir ArrayBuffer en base64
          const uint8 = new Uint8Array(fontBuffer);
          let binary = '';
          for (let i = 0; i < uint8.length; i++) binary += String.fromCharCode(uint8[i]);
          const base64 = btoa(binary);
          doc.addFileToVFS('Karla-Regular.ttf', base64);
          doc.addFont('Karla-Regular.ttf', 'Karla', 'normal');
          doc.setFont('Karla');
          renderPalettePDF();
        })
        .catch(() => {
          // Si échec, fallback police par défaut
          renderPalettePDF();
        });

      const renderPalettePDF = () => {
        // Marges minimales
        const marginX = 24;
        const marginY = 24;
        const gap = 24;
        // Calcul dynamique pour occuper presque tout l'espace
        const cellW = Math.floor((pdfW - marginX * 2 - gap * 2) / 3);
        const cellH = Math.floor((pdfH - marginY * 2 - gap) / 2);
        const startX = marginX;
        const startY = marginY;

        for (let i = 0; i < 5; i++) {
          const row = Math.floor(i / 3);
          const col = i % 3;
          const x = startX + col * (cellW + gap);
          const y = startY + row * (cellH + gap);
          const color = palette.colors[i];
          if (!color) continue;
          doc.setFillColor(color);
          doc.roundedRect(x, y, cellW, cellH, 28, 28, 'F');
          // Code hex en bas à gauche
          doc.setFontSize(28);
          // Détermine la couleur du texte selon la couleur de fond
          const hexTextColor = getContrastText(color);
          doc.setTextColor(hexTextColor);
          doc.text(color.replace('#','').toUpperCase(), x + 22, y + cellH - 22);
        }

        // Logo Coolors en bas à droite
        const logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Coolors_logo.svg';
        const img = new window.Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function() {
          doc.addImage(img, 'PNG', pdfW - 180, pdfH - 70, 120, 40);
          doc.setFontSize(18);
          doc.setTextColor('#0073ff');
          doc.text('Made with Coolors.co', pdfW - 180, pdfH - 18);
          doc.save((palette.name || 'palette') + '.pdf');
        };
        img.onerror = function() {
          doc.setFontSize(18);
          doc.setTextColor('#0073ff');
          doc.text('Made with Coolors.co', pdfW - 180, pdfH - 18);
          doc.save((palette.name || 'palette') + '.pdf');
        };
        img.src = logoUrl;
      };
// Fonction utilitaire pour déterminer la couleur du texte (noir/blanc) selon le fond
function getContrastText(hex) {
  // Enlève le # si présent
  hex = hex.replace('#', '');
  // Convertit en RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  // Calcul de la luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  // Retourne noir si fond clair, blanc si fond foncé
  return luminance > 0.6 ? '#222' : '#fff';
}

      // Logo Coolors en bas à droite
      const logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Coolors_logo.svg';
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function() {
        doc.addImage(img, 'PNG', pdfW - 180, pdfH - 70, 120, 40);
        doc.setFontSize(18);
        doc.setTextColor('#0073ff');
        doc.text('Made with Coolors.co', pdfW - 180, pdfH - 18);
        doc.save((palette.name || 'palette') + '.pdf');
      };
      img.onerror = function() {
        doc.setFontSize(18);
        doc.setTextColor('#0073ff');
        doc.text('Made with Coolors.co', pdfW - 180, pdfH - 18);
        doc.save((palette.name || 'palette') + '.pdf');
      };
      img.src = logoUrl;
    },
    sharePalette(palette) {
      // Génère un lien de partage avec les couleurs encodées dans l'URL
      const colors = encodeURIComponent(palette.colors.join(","));
      const url = `${window.location.origin}/share/${colors}`;
      navigator.clipboard.writeText(url);
      toast.success("Lien de partage copié !", {
        richColors: true,
      });
    },
  },
});
</script>


