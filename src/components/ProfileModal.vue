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
import { defineProps } from "vue";
import profilePic from "@/assets/profil.jpg";
import hello from "@/assets/hello.gif";
const props = defineProps({
  visible: Boolean,
  profileName: {
    type: String,
    default: "MakVieSAinte",
  },
  profileImg: {
    type: String,
    default: "/profil.jpg",
  },
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: #fff;
  border-radius: 18px;
  padding: 32px 24px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  text-align: center;
  position: relative;
}

.profile-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 16px;
}

.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  width: 100%;
  margin-bottom: 12px;
  font-weight: 500;
  cursor: pointer;
}

.google-btn img {
  width: 20px;
  height: 20px;
}

.main-btn {
  width: 100%;
  background: #0073b1;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-weight: 600;
  margin-bottom: 12px;
  cursor: pointer;
}

.divider {
  margin: 12px 0;
  color: #888;
  font-size: 14px;
}

.register-link {
  color: #0073b1;
  text-decoration: none;
  font-weight: 500;
}

.modal-info {
  margin-top: 18px;
  font-size: 12px;
  color: #888;
}

.modal-info a {
  color: #0073b1;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  color: #888;
  cursor: pointer;
}
</style>
