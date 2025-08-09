<template>
  <div v-if="show" class="modal-overlay" @click.self="cancel">
    <div class="modal-content">
      <h2>Confirmer la suppression</h2>
      <p>Voulez-vous vraiment supprimer cette palette ? Cette action est irréversible.</p>
      <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px">
        <button class="nav-button" @click="cancel">Annuler</button>
        <button
          class="nav-button primary"
          style="background: #e74c3c; color: #fff"
          @click="confirm"
        >
          Supprimer
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DeleteConfirmationModal",
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  emits: ['cancel', 'confirm'],
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    confirm() {
      this.$emit('confirm');
    }
  }
});
</script>
