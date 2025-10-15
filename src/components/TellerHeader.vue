<!-- filepath: d:\Fastcat Book 2\fcbook-frontend\src\components\TellerHeader.vue -->
<template>
  <header class="bg-blue-800 text-white flex items-center px-6 py-2">
    <!-- Tabs -->
    <nav class="flex items-center gap-2 flex-1">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="px-3 py-1 rounded bg-white text-blue-800 font-medium text-xs mr-2"
        :class="{
          'bg-white text-blue-800': activeTab === tab,
          'bg-blue-800 text-white': activeTab !== tab,
        }"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
      <!-- <span
        v-for="tab in tabs.slice(1)"
        :key="tab + '-divider'"
        class="mx-2 text-blue-300"
        >|</span
      > -->
      <button class="ml-4 text-xs text-white hover:underline">
        + New Transaction
      </button>
    </nav>
    <!-- User Dropdown -->
    <div class="relative ml-6">
      <button
        class="flex items-center gap-2 text-sm font-medium focus:outline-none cursor-pointer"
        @click="dropdownOpen = !dropdownOpen"
      >
        {{ userName }}
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        v-if="dropdownOpen"
        class="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-10"
      >
        <button
          class="w-full text-left px-4 py-2 text-gray-700 rounded cursor-pointer hover:bg-gray-100"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const tabs = ["WLK-0317089-1", "WLK-0317089-1"];
const activeTab = ref(tabs[0]);
const dropdownOpen = ref(false);
const userName = ref("User"); // You can get this from localStorage if needed
const router = useRouter();

onMounted(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    userName.value = user.name ? user.name : user.email;
  }
});

const logout = async () => {
  const token = localStorage.getItem("token");
  try {
    await fetch("http://127.0.0.1:8000/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
  } catch (err) {
    console.error("Logout API error:", err);
  }
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/");
};
</script>

<style scoped>
header {
  min-height: 40px;
}
</style>
