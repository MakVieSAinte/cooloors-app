<template>
  <nav class="navbar">
    <div class="nav-left">
      <img src="@/assets/logo.png" alt="Coolors" class="logo" />
      <div class="spacer"></div>
      <span class="nav-text">Appuyez sur la barre d'espace pour générer une palette.</span>
    </div>

    <!-- Menu desktop -->
    <div class="nav-right nav-desktop">
      <button class="nav-button" title="Retour" :disabled="!canUndo" :class="{ 'disabled-btn': !canUndo }" @click="handleUndo">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 icon-svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
          />
        </svg>
      </button>
      <button class="nav-button" title="Suivant" :disabled="!canRedo" :class="{ 'disabled-btn': !canRedo }" @click="handleRedo">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 icon-svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
          />
        </svg>
      </button>
      <button class="nav-button" title="Mode Sombre" @click="toggleTheme">
        <svg
          v-if="isDarkMode"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 icon-svg2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>

        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 icon-svg2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
      </button>
      <div class="spacer"></div>
      <button class="nav-button primary" @click="savePalette">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 icon-svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>

        Sauvegarder
      </button>
      <button v-if="user" class="nav-button" @click="fetchPalettes" title="Mes palettes">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 icon-svg2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z"
          />
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
      <span v-else @click="showModalProfil" class="profil">
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
          <button class="nav-button" :disabled="!canUndo" :class="{ 'disabled-btn': !canUndo }" @click="handleUndo">
            <ChevronLeft class="icon" /> Précédent
          </button>
          <button class="nav-button" :disabled="!canRedo" @click="handleRedo">
            <ChevronRight class="icon" /> Suivant
          </button>
          <button class="nav-button" @click="toggleTheme">
            <Moon v-if="isDarkMode" class="icon" />
            <Sun v-else class="icon" />
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
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Sun,
  Moon,
  AlignJustify,
  X,
} from "lucide-vue-next";

export default defineComponent({
  name: "NavbarComponent",
  components: {
    ChevronLeft,
    ChevronRight,
    Heart,
    Sun,
    Moon,
    AlignJustify,
    X,
  },
  props: {
    canUndo: {
      type: Boolean,
      required: true,
    },
    canRedo: {
      type: Boolean,
      required: true,
    },
    isDarkMode: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      default: null,
    },
    mobileMenuOpen: {
      type: Boolean,
      required: true,
    },
  },
  emits: [
    'undo',
    'redo',
    'toggle-theme',
    'save-palette',
    'fetch-palettes',
    'login-figma',
    'logout',
    'show-modal-profil',
    'toggle-mobile-menu',
    'close-mobile-menu',
  ],
  methods: {
    handleUndo() {
      this.$emit('undo');
    },
    handleRedo() {
      this.$emit('redo');
    },
    toggleTheme() {
      this.$emit('toggle-theme');
    },
    savePalette() {
      this.$emit('save-palette');
    },
    fetchPalettes() {
      this.$emit('fetch-palettes');
    },
    loginFigma() {
      this.$emit('login-figma');
    },
    logout() {
      this.$emit('logout');
    },
    showModalProfil() {
      this.$emit('show-modal-profil');
    },
    toggleMobileMenu() {
      this.$emit('toggle-mobile-menu');
    },
    closeMobileMenu() {
      this.$emit('close-mobile-menu');
    },
  }
});
</script>

<style>
/* Les styles ont été déplacés dans src/assets/main.css */
</style>
