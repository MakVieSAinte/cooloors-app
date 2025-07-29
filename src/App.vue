<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useColorStore } from '@/stores/colorStore'
import { ChevronLeft, ChevronRight, Heart, Sun, Moon } from 'lucide-vue-next'
import { supabase } from './supabase'
import { Toaster, toast } from 'vue-sonner'
import 'vue-sonner/style.css'

export default defineComponent({
  name: 'App',
  components: {
    ChevronLeft,
    ChevronRight,
    Heart,
    Sun,
    Moon,
    Toaster
  },
  data() {
    return {
      store: useColorStore(),
      isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      user: null as any,
      showPalettesModal: false,
      palettes: [],
      loadingPalettes: false
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
      toast.success('Redirection vers Figma', {
        description: 'Vous allez être redirigé pour vous connecter avec Figma.'
      })
    },
    async logout() {
      await supabase.auth.signOut()
      this.user = null
      toast.success('Déconnexion réussie', {
        description: 'Vous êtes déconnecté.'
      })
    },
    async savePalette() {
      if (!this.user) {
        toast.error('Connexion requise', {
          description: 'Connectez-vous avec Figma pour sauvegarder vos palettes !'
        })
        return
      }
      if (!this.store.colors || this.store.colors.length === 0) {
        toast.warning('Palette vide', {
          description: 'Ajoutez des couleurs avant de sauvegarder.'
        })
        return
      }
      const colors = this.store.colors.map(c => c.hex)
      let error = null
      try {
        const res = await supabase.from('palettes').insert([
          {
            user_id: this.user.id,
            colors: colors,
            name: 'Palette du ' + new Date().toLocaleString()
          }
        ])
        error = res.error
      } catch (e) {
        toast.error('Erreur réseau', {
          description: 'Impossible de contacter le serveur. Vérifiez votre connexion.'
        })
        return
      }
      if (error) {
        if (error.code === '42501' || error.code === 'permission_denied') {
          toast.error('Accès refusé', {
            description: 'Vous n’avez pas les droits pour cette action.'
          })
        } else {
          toast.error('Erreur lors de la sauvegarde', {
            description: error.message
          })
        }
      } else {
        toast.success('Palette sauvegardée !', {
          description: 'Votre palette a bien été enregistrée.'
        })
      }
    },
    async fetchPalettes() {
      if (!this.user) {
        toast.warning('Non connecté', {
          description: 'Connectez-vous pour voir vos palettes.'
        })
        return
      }
      this.loadingPalettes = true
      let data = null, error = null
      try {
        const res = await supabase.from('palettes').select('*').eq('user_id', this.user.id).order('created_at', { ascending: false })
        data = res.data
        error = res.error
      } catch (e) {
        this.loadingPalettes = false
        toast.error('Erreur réseau', {
          description: 'Impossible de charger les palettes. Vérifiez votre connexion.'
        })
        return
      }
      this.loadingPalettes = false
      if (error) {
        toast.error('Erreur lors du chargement', {
          description: error.message
        })
        return
      }
      if (!data || data.length === 0) {
        toast.info('Aucune palette trouvée', {
          description: 'Vous n’avez pas encore sauvegardé de palette.'
        })
      }
      this.palettes = data || []
      this.showPalettesModal = true
    },
    loadPalette(palette) {
      if (!palette.colors) return
      this.store.setColors(palette.colors)
      this.showPalettesModal = false
    },
    printPalette(palette) {
      // Génération PDF simple (window.print sur une nouvelle fenêtre)
      const win = window.open('', '', 'width=800,height=600')
      win.document.write('<html><head><title>Palette PDF</title></head><body style="font-family:sans-serif;">')
      win.document.write('<h2>Palette : ' + (palette.name || '') + '</h2>')
      win.document.write('<div style="display:flex;gap:8px;margin-bottom:16px;">')
      palette.colors.forEach(color => {
        win.document.write('<div style="width:80px;height:80px;background:' + color + ';display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;">' + color + '</div>')
      })
      win.document.write('</div>')
      win.document.write('<div>Date : ' + new Date(palette.created_at).toLocaleString() + '</div>')
      win.document.write('</body></html>')
      win.document.close()
      win.print()
    }
  }
})
</script>

<template>
  <div class="app" :class="{ dark: isDarkMode }">
    <Toaster position="bottom-center" expand :theme="isDarkMode ? 'dark' : 'light'" />
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
        <button class="nav-button primary" @click="savePalette">
          <Heart class="icon" />
          Sauvegarder
        </button>
        <button v-if="user" class="nav-button" @click="fetchPalettes" title="Mes palettes">
          📁 Mes palettes
        </button>
      </div>
    </nav>

    <router-view />

    <div v-if="showPalettesModal" class="modal-overlay" @click.self="showPalettesModal = false">
      <div class="modal-content">
        <h2>Mes palettes sauvegardées</h2>
        <div v-if="loadingPalettes">Chargement...</div>
        <div v-else-if="palettes.length === 0">Aucune palette sauvegardée.</div>
        <ul v-else style="list-style:none;padding:0;max-height:50vh;overflow:auto;">
          <li v-for="palette in palettes" :key="palette.id" style="margin-bottom:18px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="display:flex;gap:2px;">
                <div v-for="color in palette.colors" :key="color" :style="{background:color,width:'32px',height:'32px',borderRadius:'4px',border:'1px solid #ccc'}"></div>
              </div>
              <span style="font-size:0.95em;opacity:0.7;">{{ palette.name }}</span>
              <button class="nav-button" @click="loadPalette(palette)">Afficher</button>
              <button class="nav-button" @click="printPalette(palette)">Imprimer PDF</button>
            </div>
            <div style="font-size:0.8em;opacity:0.6;">{{ new Date(palette.created_at).toLocaleString() }}</div>
          </li>
        </ul>
        <button class="nav-button primary" @click="showPalettesModal = false" style="margin-top:16px;">Fermer</button>
      </div>
    </div>
  </div>
</template>

<style>


@import url('https://fonts.googleapis.com/css2?family=Karla:wght@400;700&display=swap');

:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --navbar-bg: #ffffff;
  --navbar-shadow: rgba(0, 0, 0, 0.1);
  --button-hover: #f5f5f5;
  --button-text: #333333;
  --primary-button: #333333;
  --primary-button-text: #ffffff;
  --main-font: 'Karla', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
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
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
}
.dark .modal-content {
  background: #232323;
  color: #fff;
}
</style>
