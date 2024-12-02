<template>
  <v-container>
    <ChatRoom></ChatRoom>
  </v-container>
</template>

<script setup>
import ChatRoom from './components/ChatRoom.vue';

const apiUrl = import.meta.env.VITE_API_URL;
console.log("api url",apiUrl)

</script>

<style>

</style>
