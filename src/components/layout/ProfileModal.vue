<template>
  <div v-if="user && show" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2>Mon Profil</h2>
      <br />
      <div class="content-modal-profil">
        <div class="bloc-logout-profil">
          <span class="profil modal">
            <span class="initials">{{ user.email.charAt(0).toUpperCase() }}</span>
          </span>
          <button class="nav-button logout" @click="logout" title="Déconnexion">
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
                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
              />
            </svg>
            Déconnexion
          </button>
        </div>
        <p><strong>Email :</strong> {{ user.email }}</p>
        <p><strong>ID utilisateur :</strong> {{ user.id.substring(0, 30) }}...</p>
      </div>
      <br />
      <button
        class="nav-button primary"
        @click="close"
        style="margin-top: 16px"
      >
        Fermer
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ProfileModal",
  props: {
    user: {
      type: Object,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close', 'logout'],
  methods: {
    close() {
      this.$emit('close');
    },
    logout() {
      this.$emit('logout');
    }
  }
});
</script>
