<script lang="ts">
import { defineComponent } from 'vue'
import { useColorStore } from '@/stores/colorStore'

export default defineComponent({
  name: 'App',

  data() {
    return {
      store: useColorStore()
    }
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
    }
  }
})
</script>

<template>
  <div class="app">
    <nav class="navbar">
      <div class="nav-left">
        <img src="@/assets/logo.svg" alt="Coolors" class="logo" />
        <div class="spacer"></div>
        <span class="nav-text">Appuyez sur la barre d'espace pour générer une palette</span>
      </div>

      <div class="nav-right">
        <button class="nav-button" title="Retour" :disabled="!canUndo" @click="handleUndo">
          <span class="icon">↩️</span>
        </button>
        <button class="nav-button" title="Suivant" :disabled="!canRedo" @click="handleRedo">
          <span class="icon">↪️</span>
        </button>
        <div class="spacer"></div>
        <button class="nav-button primary">
          <span class="icon">❤️</span>
          Sauvegarder
        </button>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  height: 56px;
  padding: 0 20px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1000;
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
  color: #666;
  font-size: 0.9rem;
}

.nav-button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #333;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.nav-button:hover {
  background: #f5f5f5;
}

.nav-button.primary {
  background: #333;
  color: white;
}

.nav-button.primary:hover {
  background: #000;
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

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
