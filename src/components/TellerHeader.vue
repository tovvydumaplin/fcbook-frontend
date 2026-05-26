<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  serialNo: {
    type: String,
    default: "",
  },
  uniqueSerialNumbers: {
    type: Array,
    default: () => [],
  },
  activeSerialTab: {
    type: String,
    default: null,
  },
  serialsWithBookings: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:activeSerialTab', 'newTransaction', 'closeTab', 'openBookings']);
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
  router.push({ path: "/", query: { loggedOut: "1" } });
};
</script>

<style scoped>
header {
  min-height: 40px;
}

.teller-dropdown-enter-active,
.teller-dropdown-leave-active {
  transition:
    opacity 160ms ease,
    transform 160ms ease;
  transform-origin: top right;
}

.teller-dropdown-enter-from,
.teller-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>

<template>
  <header class="bg-blue-800 text-white flex items-center px-6 py-2">
    <!-- Serial Number Tabs -->
    <nav class="flex items-center gap-2 flex-1">
      <button
        v-for="serial in uniqueSerialNumbers"
        :key="serial"
        @click="emit('update:activeSerialTab', serial)"
        :class="[
          'flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-all',
          activeSerialTab === serial
            ? 'bg-white text-blue-800 shadow-md'
            : 'bg-blue-700 text-white hover:bg-blue-600'
        ]"
      >
        <span>{{ serial }}</span>
        <span
          @click.stop="emit('closeTab', serial)"
          class="ml-0.5 w-4 h-4 flex items-center justify-center rounded-full text-xs leading-none transition-colors hover:bg-red-500 hover:text-white cursor-pointer"
          title="Close tab"
        >✕</span>
      </button>
      <button 
        @click="emit('newTransaction')"
        class="ml-4 text-xs text-white hover:underline"
      >
        + New Transaction
      </button>
    </nav>
    <!-- Refunds and Bookings Buttons -->
    <div class="flex items-center gap-4">
      <button
        @click="emit('openBookings')"
        class="px-4 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors duration-200"
      >
        Bookings Demo
      </button>
      
      <button
        @click="router.push('/teller-refunds')"
        class="px-4 py-1.5 bg-orange-500 text-white text-sm font-medium rounded hover:bg-orange-600 transition-colors duration-200"
      >
        Refunds
      </button>
    </div>
    <!-- User Dropdown -->
    <div class="relative ml-6">
      <button
        class="flex items-center gap-2 text-sm font-medium focus:outline-none cursor-pointer transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
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
      <transition name="teller-dropdown">
        <div
          v-if="dropdownOpen"
          class="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-10"
        >
          <button
            class="w-full text-left px-4 py-2 text-gray-700 rounded cursor-pointer hover:bg-gray-100 transition-transform duration-150 hover:translate-x-0.5 active:scale-[0.98]"
            @click="logout"
          >
            Logout
          </button>
        </div>
      </transition>
    </div>
  </header>
</template>
