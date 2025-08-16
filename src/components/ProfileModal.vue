<template>
  <div class="modal-overlay" v-if="visible">
    <div class="modal-card">
      <img class="profile-img" :src="profilePic" alt="Profil" />
      <h2 style="letter-spacing: -2.0px;">
        <img class="icon hello" :src="hello" alt="Profil" width="30px" /> Hi ! Je suis
        <span style="font-weight: 600;">MakVieSAinte</span><br />Dev full-Stack & UI designer.
      </h2>
      <br />
      <button class="main-btn">
        <a href="https://cg.linkedin.com/in/viesainte-mak" target="_blank" class="follow">
          <svg fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="20px" height="20px">    <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"/></svg>
          Suivez-moi sur LinkedIn
        </a>
      </button>
      <p class="modal-info">
        Ce projet est un clone de
        <a
          href="https://coolors.co/004777-a30000-efd28d-f57200-00afb5"
          target="_blank"
          rel="noopener"
          >Coolors</a
        >
        et n’a aucun but lucratif.
        <a href="#" target="_blank" rel="noopener" style="cursor: not-allowed;">Visitez mon portfolio</a>, pour découvrir
        d’autres de mes réalisations.
      </p>

      <button class="close-btn" @click="$emit('close')">&times;</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import profilePicDefault from '@/assets/profil.jpg'
import hello from '@/assets/hello.gif'

const props = defineProps<{
  visible: boolean
  profileName?: string
  profileImg?: string
}>()

const profilePic = computed(() => props.profileImg || profilePicDefault)
</script>

<style scoped>
a.follow {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  color: #fff;
}
</style>
