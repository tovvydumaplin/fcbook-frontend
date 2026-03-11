<script setup>
import SideBar from "./components/SideBar.vue";
import Header from "./components/Header.vue";
import { useRoute } from "vue-router";
const route = useRoute();
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <Header v-if="route.path !== '/' && route.path !== '/teller-booking'" />

    <div class="flex flex-1">
      <!-- SideBar -->
      <SideBar
        v-if="route.path !== '/' && route.path !== '/teller-booking'"
        class="w-80 bg-gray-100 min-h-screen"
      />
      <!-- Main Content -->
      <div class="flex-1 bg-gray-50 min-h-0">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
