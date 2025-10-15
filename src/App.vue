<script setup>
import HelloWorld from "./components/HelloWorld.vue";
import MyForm from "./components/MyForm.vue";
import sideBar from "./components/sideBar.vue";
import { useRoute } from "vue-router";
const route = useRoute();
</script>

<template>
  <div class="flex">
    <!-- Sidebar -->
    <sideBar
      v-if="route.path !== '/' && route.path !== '/teller-booking'"
      class="w-64 bg-gray-100 min-h-screen"
    />
    <!-- Main Content -->
    <div class="flex-1 bg-gray-50">
      <router-view />
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
