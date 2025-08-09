<template>
  <div v-if="showPalettesModal" class="modal-overlay" @click.self="closePalettesModal">
    <div class="modal-content" style="position: relative;">
      <button class="nav-button" @click="closePalettesModal" style="position: absolute; top: 18px; right: 18px; background: none; border: none; box-shadow: none; z-index: 10;" title="Fermer">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6 icon-svg"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
      <h2>Mes palettes sauvegardées</h2>
      <br />
      <br />
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
            <div style="display: flex; gap: 6px; align-items: center; margin-left: auto; position: relative;">
              <button class="nav-button" @click.stop="togglePaletteActions(palette)" title="Options">
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
                    d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                  />
                </svg>
              </button>
              <div v-if="palette.showActions" class="palette-actions-menu" v-click-outside="() => closePaletteActions(palette)">
                <button class="menu-item" @click="loadPalette(palette)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-5 icon-svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                  <span>Voir</span>
                </button>
                <button class="menu-item" @click="printPalette(palette)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-5 icon-svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
                    />
                  </svg>
                  <span>Imprimer</span>
                </button>
                <button class="menu-item" @click="sharePalette(palette)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-5 icon-svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                    />
                  </svg>
                  <span>Partager</span>
                </button>
                <button class="menu-item delete" @click="deletePalette(palette)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-5 icon-svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          </div>
          <div style="font-size: 0.8em; opacity: 0.6">
            {{ new Date(palette.created_at).toLocaleString() }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PalettesModal",
  props: {
    showPalettesModal: {
      type: Boolean,
      required: true
    },
    palettes: {
      type: Array,
      required: true
    },
    loadingPalettes: {
      type: Boolean,
      required: true
    }
  },
  emits: [
    'close',
    'toggle-actions',
    'close-actions',
    'load-palette',
    'print-palette',
    'share-palette',
    'delete-palette'
  ],
  directives: {
    clickOutside: {
      beforeMount(el, binding) {
        // Stocker l'état pour éviter des appels multiples
        el.__vueClickOutside__ = {
          handler: binding.value,
          handleEvent: (event) => {
            // Ne réagit pas aux clics sur le menu lui-même
            if (!(el === event.target || el.contains(event.target))) {
              // Ne déclenche pas l'événement si le clic vient du bouton qui ouvre le menu
              const openButton = event.target.closest('.nav-button');
              if (!openButton || !openButton.hasAttribute('title') || openButton.getAttribute('title') !== 'Options') {
                el.__vueClickOutside__.handler();
              }
            }
          }
        };

        // Utiliser requestAnimationFrame pour s'assurer que le DOM a été mis à jour
        requestAnimationFrame(() => {
          document.addEventListener('click', el.__vueClickOutside__.handleEvent, true);
        });
      },
      unmounted(el) {
        // Nettoyer l'événement lors du démontage
        if (el.__vueClickOutside__) {
          document.removeEventListener('click', el.__vueClickOutside__.handleEvent, true);
          delete el.__vueClickOutside__;
        }
      },
    },
  },
  methods: {
    closePalettesModal() {
      this.$emit('close');
    },
    togglePaletteActions(palette) {
      this.$emit('toggle-actions', palette);
    },
    closePaletteActions(palette) {
      this.$emit('close-actions', palette);
    },
    loadPalette(palette) {
      this.$emit('load-palette', palette);
    },
    printPalette(palette) {
      this.$emit('print-palette', palette);
    },
    sharePalette(palette) {
      this.$emit('share-palette', palette);
    },
    deletePalette(palette) {
      this.$emit('delete-palette', palette);
    }
  }
});
</script>
