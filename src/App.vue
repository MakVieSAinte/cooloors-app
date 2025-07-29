<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useColorStore } from '@/stores/colorStore'
import { ChevronLeft, ChevronRight, Heart, Sun, Moon, Plus } from 'lucide-vue-next'
import { supabase } from './supabase'

export default defineComponent({
  name: 'App',
  components: {
    ChevronLeft,
    ChevronRight,
    Heart,
    Sun,
    Moon
  },
  data() {
    return {
      store: useColorStore(),
      isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      user: null as any
    }
  },
  async created() {
    // Écouter les changements de préférence système
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      this.isDarkMode = e.matches
    })
    // Vérifier si l'utilisateur est déjà connecté
    const { data: { user } } = await supabase.auth.getUser()
    this.user = user
    // Écoute les changements d'auth
    supabase.auth.onAuthStateChange((event, session) => {
      this.user = session?.user || null
    })
  },
  computed: {
    canUndo(): boolean {
      return this.store.currentIndex > 0
    },
    canRedo(): boolean {
      return this.store.currentIndex < this.store.history.length - 1
    }
  },
  methods: {
    handleUndo() {
      this.store.undo()
    },
    handleRedo() {
      this.store.redo()
    },
    async loginFigma() {
      await supabase.auth.signInWithOAuth({ provider: 'figma' })
    },
    async logout() {
      await supabase.auth.signOut()
      this.user = null
    }
  }
})
</script>

<template>
  <div class="app" :class="{ dark: isDarkMode }">
    <nav class="navbar">
      <div class="nav-left">
        <img src="@/assets/logo.svg" alt="Coolors" class="logo" />
        <div class="spacer"></div>
        <span class="nav-text">Appuyez sur la barre d'espace pour générer une palette</span>
      </div>

      <div class="nav-right">
        <button class="nav-button" title="Retour" :disabled="!canUndo" @click="handleUndo">
          <ChevronLeft class="icon" />
        </button>
        <button class="nav-button" title="Suivant" :disabled="!canRedo" @click="handleRedo">
          <ChevronRight class="icon" />
        </button>
        <button class="nav-button" title="Mode Sombre" @click="isDarkMode = !isDarkMode">
          <Moon v-if="isDarkMode" class="icon" />
          <Sun v-else class="icon" />
        </button>
        <div class="spacer"></div>
        <button v-if="!user" class="nav-button" @click="loginFigma" title="Connexion Figma">
          <img src="https://static.figma.com/app/icon/1/favicon.png" alt="Figma" style="width:1.2em;height:1.2em;vertical-align:middle;margin-right:4px;" />
          Connexion Figma
        </button>
        <span v-else style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:0.95em;opacity:0.8;">{{ user.email }}</span>
          <button class="nav-button" @click="logout" title="Déconnexion">Déconnexion</button>
        </span>
        <button class="nav-button primary">
          <Heart class="icon" />
          Sauvegarder
        </button>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<style>

:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --navbar-bg: #ffffff;
  --navbar-shadow: rgba(0, 0, 0, 0.1);
  --button-hover: #f5f5f5;
  --button-text: #333333;
  --primary-button: #333333;
  --primary-button-text: #ffffff;
}

html, body, #app, .app {
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  min-width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.dark {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
  --navbar-bg: #2d2d2d;
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
}

.navbar {
  height: 56px;
  padding: 0 20px;
  background: var(--navbar-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px var(--navbar-shadow);
  position: relative;
  z-index: 1000;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.nav-left, .nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  height: 24px;
}

.spacer {
  width: 20px;
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

.tools-btn {
  background: #f5f5f5;
}

.icon {
  font-size: 1.1rem;
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

  .nav-left, .nav-right {
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
</style>
