<template>
  <button class="add-column-btn" @click="$emit('add')" title="Ajouter une colonne">
    <X class="icon" style="transform: rotate(45deg); width: 14px" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { X } from "lucide-vue-next";

export default defineComponent({
  name: "App",
  components: {
    X,
  },
});
</script>

<style scoped>
/* Les styles ont été déplacés dans src/assets/main.css */
</style>
