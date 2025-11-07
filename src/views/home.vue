<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-50"
  >
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg text-center">
      <h1 class="text-3xl font-bold text-blue-700 mb-4">
        Welcome to Fastcat Book
      </h1>
      <p class="text-gray-600 mb-6">
        Your dashboard is under construction. Please use the sidebar to navigate
        to other sections.
      </p>
      <router-link
        to="/"
        class="inline-block px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition flex items-center justify-center gap-2"
      >
        <div class="flex gap-2 items-center">
          <Settings class="w-5 h-5 animate-spin" />
          In Progress
        </div>
      </router-link>
    </div>
  </div>
</template>
<script setup>
import { Settings } from "lucide-vue-next";
</script>
