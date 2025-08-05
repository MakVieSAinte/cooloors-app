<template>
  <main>
    <div class="colors-container">
      <div
        v-for="(color, index) in colors"
        :key="color.id"
        class="color-column"
      >
        <ColorBox
          :color="color"
          :show-remove="colors.length > 3"
          @toggle-lock="toggleLock"
          @remove="removeColorColumn(index)"
        />
        <AddColumnButton
          v-if="index < colors.length - 1"
          @add="addColorColumn(index)"
          class="add-btn"
        />
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { useColorStore } from '@/stores/colorStore'
import ColorBox from '@/components/ColorBox.vue'
import AddColumnButton from '@/components/AddColumnButton.vue'
import { Toaster, toast } from "vue-sonner";

export default {
  name: 'HomeView',

  components: {
    ColorBox,
    AddColumnButton
  },

  data() {
    return {
      store: useColorStore()
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
    }
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
        toast.warning("Limite atteinte", {
          description: "Impossible d'ajouter plus de 7 couleurs à la palette.",
          richColors: true,
        });
        return;
      }
      this.store.addColorColumn(index);
    },
    removeColorColumn(index: number) {
      this.store.removeColorColumn(index)
    },
    undo() {
      this.store.undo()
    },
    redo() {
      this.store.redo()
    }
  },

  mounted() {
    this.generatePalette()

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault()
        this.generatePalette()
      }
    })
  }
}

</script>

<style scoped>
.colors-container {
  display: flex;
  flex: 1;
  height: calc(100vh - 56px);
  padding: 0;
  margin: 0;
}

@media (max-width: 768px) {
  .colors-container {
    display: flex;
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 0px;
  }
}

.color-column {
  height: 100% !important;
  flex: 1;
  position: relative;
  display: flex;
}

.color-column:hover .add-btn {
  opacity: 1;
}


</style>
