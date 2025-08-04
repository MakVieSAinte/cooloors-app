<template>
  <div class="app" :class="{ dark: isDarkMode }">
    <Toaster position="bottom-center" expand :theme="isDarkMode ? 'dark' : 'light'" />

    <nav class="navbar">
      <div class="nav-left">
        <img src="@/assets/logo.png" alt="Coolors" class="logo" />
        <div class="spacer"></div>
        <span class="nav-text">Appuyez sur la barre d'espace pour générer une palette.</span>
      </div>

      <!-- Menu desktop -->
      <div class="nav-right nav-desktop">
        <button class="nav-button" title="Retour" :disabled="!canUndo" @click="handleUndo">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 icon-svg">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
</svg>

        </button>
        <button class="nav-button" title="Suivant" :disabled="!canRedo" @click="handleRedo">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 icon-svg">
  <path stroke-linecap="round" stroke-linejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
</svg>

        </button>
        <button class="nav-button" title="Mode Sombre" @click="toggleTheme">

          <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 icon-svg2">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
</svg>

          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 icon-svg2">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
</svg>

        </button>
        <div class="spacer"></div>
        <button class="nav-button primary" @click="savePalette">
          <!-- <Heart class="icon" /> -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 icon-svg">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
</svg>

          Sauvegarder
        </button>
        <button v-if="user" class="nav-button" @click="fetchPalettes" title="Mes palettes">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 icon-svg2">
  <path stroke-linecap="round" stroke-linejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />
</svg>
 Mes palettes
        </button>

        <button v-if="!user" class="nav-button" @click="loginFigma" title="Connexion Figma">
          <img
            src="https://static.figma.com/app/icon/1/favicon.png"
            alt="Figma"
            style="width: 1.2em; height: 1.2em; vertical-align: middle; margin-right: 4px"
          />
          Connexion Figma
        </button>
        <!-- <span v-else style="display: flex; align-items: center; gap: 8px">
          <span style="font-size: 0.95em; opacity: 0.8">{{ user.email }}</span>
          <button class="nav-button" @click="logout" title="Déconnexion">Déconnexion</button>
        </span> -->
        <span v-else @click="showModalProfil = true" class="profil">
          <span class="initials">{{ user.email.charAt(0).toUpperCase() }}</span>
        </span>
      </div>

      <!-- Hamburger mobile -->
      <button
        class="nav-button nav-hamburger"
        @click="toggleMobileMenu"
        aria-label="Menu"
        title="Menu"
      >
        <AlignJustify class="icon" />
      </button>
      <transition name="fade">
        <div v-if="mobileMenuOpen" class="mobile-menu-overlay" @click.self="closeMobileMenu">
          <div class="mobile-menu">
            <button class="close-btn" @click="closeMobileMenu">
              <X class="icon" />
            </button>
            <button class="nav-button" :disabled="!canUndo" @click="handleUndo">
              <ChevronLeft class="icon" /> Précédent
            </button>
            <button class="nav-button" :disabled="!canRedo" @click="handleRedo">
              <ChevronRight class="icon" /> Suivant
            </button>
            <button class="nav-button" @click="toggleTheme">
              <Moon v-if="isDarkMode" class="icon" /><Sun v-else class="icon" />
              Thème
            </button>
            <button v-if="!user" class="nav-button" @click="loginFigma">
              <img
                src="https://static.figma.com/app/icon/1/favicon.png"
                alt="Figma"
                style="width: 1.2em; height: 1.2em; vertical-align: middle; margin-right: 4px"
              />Connexion Figma
            </button>
            <span v-else style="display: flex; align-items: center; gap: 8px">
              <span style="font-size: 0.95em; opacity: 0.8">{{ user.email }}</span>
              <button class="nav-button" @click="logout">Déconnexion</button>
            </span>
            <button class="nav-button primary" @click="savePalette">
              <Heart class="icon" /> Sauvegarder
            </button>
            <button v-if="user" class="nav-button" @click="fetchPalettes">📁 Mes palettes</button>
          </div>
        </div>
      </transition>
    </nav>

    <router-view />

    <div v-if="showPalettesModal" class="modal-overlay" @click.self="showPalettesModal = false">
      <div class="modal-content">
        <h2>Mes palettes sauvegardées</h2>
        <br/>
        <br/>
        <div v-if="loadingPalettes">Chargement...</div>
        <div v-else-if="palettes.length === 0">Aucune palette sauvegardée.</div>
        <ul v-else style="list-style: none; padding: 0; max-height: 50vh; overflow: auto">
          <li v-for="palette in palettes" :key="palette.id" style="margin-bottom: 18px">
            <div style="display: flex; align-items: center; gap: 8px">
              <div style="display: flex; gap: 2px">
                <div
                  v-for="color in palette.colors"
                  :key="color"
                  :style="{
                    background: color,
                    width: '32px',
                    height: '32px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }"
                ></div>
              </div>
              <span style="font-size: 0.95em; opacity: 0.7">{{ palette.name }}</span>
              <div style="display: flex; gap: 6px; align-items: center;">
                <button class="nav-button" @click="loadPalette(palette)">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 icon-svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>
                <button class="nav-button" @click="printPalette(palette)">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 icon-svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
                  </svg>
                </button>
                <button class="nav-button" @click="sharePalette(palette)">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 icon-svg">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
</svg>

                </button>
                <button class="nav-button" @click="deletePalette(palette)" style="color: #e74c3c">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 icon-svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>

            </div>
            <div style="font-size: 0.8em; opacity: 0.6">
              {{ new Date(palette.created_at).toLocaleString() }}
            </div>
          </li>
        </ul>
        <br>
        <button
          class="nav-button primary"
          @click="showPalettesModal = false"
          style="margin-top: 16px"
        >
          Fermer
        </button>
      </div>
    </div>

    <div v-if="showDeletePaletteModal" class="modal-overlay" @click.self="cancelDeletePalette">
      <div class="modal-content">
        <h2>Confirmer la suppression</h2>
        <p>Voulez-vous vraiment supprimer cette palette ? Cette action est irréversible.</p>
        <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px">
          <button class="nav-button" @click="cancelDeletePalette">Annuler</button>
          <button class="nav-button primary" style="background: #e74c3c; color: #fff" @click="confirmDeletePalette">Supprimer</button>
        </div>
      </div>
    </div>

    <div v-if="user && showModalProfil" class="modal-overlay" @click.self="showModalProfil = false">
      <div class="modal-content">
        <h2>Mon Profil</h2>
        <br>
        <div class="content-modal-profil">
          <div class="bloc-logout-profil">
            <span class="profil modal">
              <span class="initials">{{ user.email.charAt(0).toUpperCase() }}</span>
            </span>

            <button class="nav-button logout" @click="logout" title="Déconnexion">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 icon-svg">
  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
</svg>

              Déconnexion</button>
          </div>
          <p><strong>Email :</strong> {{ user.email }}</p>
          <p><strong>ID utilisateur :</strong> {{ (user.id).substring(0, 30) }}...</p>
        </div>
        <br>
        <button
          class="nav-button primary"
          @click="showModalProfil = false"
          style="margin-top: 16px"
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useColorStore } from "@/stores/colorStore";
import { ChevronLeft, ChevronRight, CornerUpLeft, Heart, Sun, Moon, AlignJustify, X } from "lucide-vue-next";
import { supabase } from "./supabase";
import jsPDF from "jspdf";
import { Toaster, toast } from "vue-sonner";
import "vue-sonner/style.css";

export default defineComponent({
  name: "App",
  components: {
    ChevronLeft,
    ChevronRight,
    CornerUpLeft,
    Heart,
    Sun,
    Moon,
    AlignJustify,
    X,
    Toaster,
  },
  data() {
    return {
      store: useColorStore(),
      isDarkMode: false,
      user: null as any,
      showPalettesModal: false,
      showModalProfil: false,
      showDeletePaletteModal: false,
      paletteToDelete: null,
      palettes: [],
      loadingPalettes: false,
      mobileMenuOpen: false,
      toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
      },
      closeMobileMenu() {
        this.mobileMenuOpen = false;
      },
    };
  },
  async created() {
    // Restaure le thème depuis localStorage ou la préférence système
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      this.isDarkMode = true;
    } else if (savedTheme === "light") {
      this.isDarkMode = false;
    } else {
      this.isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    // Écouter les changements de préférence système
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        this.isDarkMode = e.matches;
      }
    });
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
      toast.success("Redirection vers Figma", {
        description: "Vous allez être redirigé pour vous connecter avec Figma.",
      });
    },
    async logout() {
      await supabase.auth.signOut();
      this.user = null;
      toast.success("Déconnexion réussie", {
        description: "Vous êtes déconnecté.",
      });
    },
    async savePalette() {
      if (!this.user) {
        toast.error("Connexion requise", {
          description: "Connectez-vous avec Figma pour sauvegarder vos palettes !",
          richColors: true,
        });
        return;
      }
      if (!this.store.colors || this.store.colors.length === 0) {
        toast.warning("Palette vide", {
          description: "Ajoutez des couleurs avant de sauvegarder.",
        });
        return;
      }
      const colors = this.store.colors.map((c) => c.hex);
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
        toast.error("Erreur réseau", {
          description: "Impossible de contacter le serveur. Vérifiez votre connexion.",
        });
        return;
      }
      if (error) {
        if (error.code === "42501" || error.code === "permission_denied") {
          toast.error("Accès refusé", {
            description: "Vous n’avez pas les droits pour cette action.",
          });
        } else {
          toast.error("Erreur lors de la sauvegarde", {
            description: error.message,
          });
        }
      } else {
        toast.success("Palette sauvegardée !", {
          description: "Votre palette a bien été enregistrée.",
        });
      }
    },

    async OpenModalProfil() {
      this.showModalProfil = true;
    },

    async fetchPalettes() {
      if (!this.user) {
        toast.warning("Non connecté", {
          description: "Connectez-vous pour voir vos palettes.",
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
        toast.error("Erreur réseau", {
          description: "Impossible de charger les palettes. Vérifiez votre connexion.",
        });
        return;
      }
      this.loadingPalettes = false;
      if (error) {
        toast.error("Erreur lors du chargement", {
          description: error.message,
        });
        return;
      }
      if (!data || data.length === 0) {
        toast.info("Aucune palette trouvée", {
          description: "Vous n’avez pas encore sauvegardé de palette.",
        });
      }
      this.palettes = data || [];
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
        toast.error("Erreur réseau", {
          description: "Impossible de supprimer la palette.",
        });
        this.cancelDeletePalette();
        return;
      }
      if (error) {
        toast.error("Erreur lors de la suppression", {
          description: error.message,
        });
      } else {
        toast.success("Palette supprimée", {
          description: "La palette a bien été supprimée.",
        });
        this.palettes = this.palettes.filter((p) => p.id !== this.paletteToDelete.id);
      }
      this.cancelDeletePalette();
    },
    printPalette(palette) {
      // Génération PDF avec jsPDF
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(palette.name || "Palette", 15, 20);
      doc.setFontSize(12);
      doc.text("Date : " + new Date(palette.created_at).toLocaleString(), 15, 30);
      // Affichage des couleurs sous forme de rectangles
      const startY = 40;
      const rectH = 22;
      const rectW = 170;
      palette.colors.forEach((color, i) => {
        const y = startY + i * (rectH + 6);
        doc.setFillColor(color);
        doc.rect(15, y, rectW, rectH, "F");
        doc.setTextColor("#222");
        doc.setFontSize(14);
        doc.text(color.toUpperCase(), 20, y + rectH / 2 + 5);
      });
      doc.save((palette.name || "palette") + ".pdf");
    },
    sharePalette(palette) {
      // Génère un lien de partage avec les couleurs encodées dans l'URL
      const colors = encodeURIComponent(palette.colors.join(','));
      const url = `${window.location.origin}/share/${colors}`;
      navigator.clipboard.writeText(url);
      toast.success("Lien de partage copié !");
    },
  },
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Karla:wght@400;700&display=swap");

:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --navbar-bg: #ffffff;
  --navbar-shadow: rgba(0, 0, 0, 0.1);
  --button-hover: #f5f5f5;
  --button-text: #333333;
  --primary-button: #333333;
  --primary-button-text: #ffffff;
  --main-font: "Karla", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
}

html,
body,
#app,
.app {
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  min-width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dark {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
  --navbar-bg: #1a1a1a;
  --navbar-shadow: rgba(0, 0, 0, 0.3);
  --button-hover: #3d3d3d;
  --button-text: #ffffff;
  --primary-button: #ffffff;
  --primary-button-text: #1a1a1a;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: var(--main-font);
}

.app {
  min-height: 100vh;
  min-width: 100vw;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
  overflow: hidden;
  font-family: var(--main-font);
}

.navbar {
  height: 56px;
  padding: 0 20px;
  margin: 0px;
  background: var(--navbar-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px var(--navbar-shadow);
  position: relative;
  z-index: 1000;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo {
  height: 120px;
}

.spacer {
  width: 5px;
}

.nav-text {
  color: var(--text-color);
  font-size: 0.9rem;
  opacity: 0.8;
}

.nav-button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--button-text);
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.nav-button:hover {
  background: var(--button-hover);
}

.nav-button.primary {
  background: var(--primary-button);
  color: var(--primary-button-text);
}

.nav-button.primary:hover {
  opacity: 0.9;
}

.nav-button.logout {
  background: rgba(255, 0, 0, 0.098);
  color: var(--text-color);
}

.nav-button.logout:hover {
  background: rgba(255, 0, 0, 0.6);
}

.tools-btn {
  background: #f5f5f5;
}

.icon {
  font-size: 1.1rem;
}

.icon-svg {
  width: 1.2em;
}

.icon-svg2 {
  width: 1.4em;
}

.profil {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--text-color);
  background: linear-gradient(90deg, #f8ff00 0%, #3ad59f 100%);
  border: 3px solid #faf8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
}
.profil.modal {
  width: 80px;
  height: 80px;
  font-size: 2.2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (max-width: 768px) {
  .navbar {
    padding: 0 10px;
  }

  .nav-text {
    display: none;
  }

  .nav-button {
    padding: 6px 8px;
    font-size: 0.8rem;
  }

  .spacer {
    width: 10px;
  }

  .nav-left,
  .nav-right {
    gap: 6px;
  }

  .logo {
    height: 20px;
  }
}

@media (max-width: 480px) {
  .nav-button span.icon {
    margin: 0;
  }

  .nav-button:not(.primary) span:not(.icon) {
    display: none;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-content {
  background: #fff;
  color: #222;
  border-radius: 10px;
  padding: 32px 24px;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}
.dark .modal-content {
  background: #232323;
  color: #fff;
}

.content-modal-profil {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
}

.bloc-logout-profil {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}
/* Hamburger menu styles */
.nav-hamburger {
  display: none;
}
.nav-desktop {
  display: flex;
}
@media (max-width: 900px) {
  .nav-text {
    display: none;
  }
}
@media (max-width: 768px) {
  .nav-desktop {
    display: none !important;
  }
  .nav-hamburger {
    display: flex !important;
    background: none;
    border: none;
    font-size: 1.5em;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    z-index: 1100;
  }
}
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  z-index: 2000;
}
.mobile-menu {
  background: var(--bg-color);
  color: var(--text-color);
  width: 80vw;
  max-width: 320px;
  min-height: 100vh;
  box-shadow: -2px 0 16px rgba(0, 0, 0, 0.12);
  padding: 32px 18px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  position: relative;
  animation: slideIn 0.2s;
}
.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 1.5em;
  color: inherit;
  cursor: pointer;
}
@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
