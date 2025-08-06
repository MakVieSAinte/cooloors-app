<template>
  <div class="share-palette-view">
    <h2>Palette partagée</h2>
    <div v-if="colors && colors.length" class="palette-preview">
      <div
        v-for="color in colors"
        :key="color"
        :style="{
          background: color,
          width: '60px',
          height: '60px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          marginRight: '8px',
        }"
      ></div>
    </div>
    <div v-else>
      <p>Palette introuvable ou lien invalide.</p>
    </div>
    <br />
    <router-link to="/">
      <button class="nav-button primary">Retour à l'accueil</button>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, computed } from "vue";

const route = useRoute();
const colorsParam = route.params.colors as string | undefined;
const colors = computed(() => {
  if (!colorsParam) return [];
  return decodeURIComponent(colorsParam).split(",").filter(Boolean);
});
</script>

<style scoped>
.share-palette-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 48px;
}
.palette-preview {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
</style>
