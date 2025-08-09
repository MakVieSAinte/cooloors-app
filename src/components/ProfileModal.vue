<template>
  <div class="modal-overlay" v-if="visible">
    <div class="modal-card">
      <img class="profile-img" :src="profilePic" alt="Profil" />
      <h2>
        <img class="icon hello" :src="hello" alt="Profil" width="30px" /> Hi ! Je suis
        <strong>MakVieSAinte</strong><br />Dev full-Stack & UI designer.
      </h2>
      <br />
      <button class="main-btn">Suivez-moi sur LinkedInd</button>
      <p class="modal-info">
        Ce projet est un clone de
        <a
          href="https://coolors.co/004777-a30000-efd28d-f57200-00afb5"
          target="_blank"
          rel="noopener"
          >Coolors</a
        >
        et n’a aucun but lucratif.
        <a href="#" target="_blank" rel="noopener">Visitez mon portfolio</a>, pour découvrir
        d’autres de mes réalisations.
      </p>

      <button class="close-btn" @click="$emit('close')">&times;</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import profilePic from '@/assets/profil.jpg'
import hello from '@/assets/hello.gif'
const props = defineProps({
  visible: Boolean,
  profileName: {
    type: String,
    default: 'MakVieSAinte',
  },
  profileImg: {
    type: String,
    default: '/profil.jpg',
  },
})
</script>

<style scoped></style>
