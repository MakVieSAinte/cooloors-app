<template>
  <button
    class="add-column-btn"
    @click="$emit('add')"
    title="Ajouter une colonne"
  >
    <X class="icon" style="transform: rotate(45deg); width: 14px;" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Plus, X } from "lucide-vue-next";


export default defineComponent({
  name: "App",
  components: {
    X
  },
});

</script>
<style scoped>
.add-column-btn {
  position: absolute;
  top: 50%;
  right: -12px;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  font-size: 12px;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.add-column-btn:hover {
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}
</style>
