<!-- filepath: d:\Fastcat Book 2\fcbook-frontend\src\components\ModalCreatePort.vue -->
<template>
  <div
    class="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
    @click="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4" @click.stop>
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200"
      >
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Create a Port</h2>
          <p class="text-sm text-gray-500 mt-1">
            Provide basic information about the port
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <form @submit.prevent="savePort" class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Port Name
          </label>
          <input
            v-model="port.port_name"
            type="text"
            placeholder="Enter port name (e.g. Batangas, etc.)"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :disabled="isLoading"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Select a corridor
          </label>
          <div class="space-y-3">
            <label class="flex items-center">
              <input
                v-model="port.corridor"
                type="radio"
                value="Western"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                :disabled="isLoading"
              />
              <span class="ml-3 text-sm text-gray-700">Western Corridor</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="port.corridor"
                type="radio"
                value="Central"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                :disabled="isLoading"
              />
              <span class="ml-3 text-sm text-gray-700">Central Corridor</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="port.corridor"
                type="radio"
                value="Eastern"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                :disabled="isLoading"
              />
              <span class="ml-3 text-sm text-gray-700">Eastern Corridor</span>
            </label>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Facilities
          </label>
          <input
            v-model="port.facilities"
            type="text"
            placeholder="Enter facilities"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :disabled="isLoading"
          />
        </div>
        <div
          class="flex items-center justify-end gap-3 pt-6 border-t border-gray-200"
        >
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            :disabled="isLoading"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              <span
                class="inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
              ></span>
              Saving...
            </span>
            <span v-else> Save Port </span>
          </button>
        </div>
        <div v-if="errorMsg" class="text-red-500 text-sm mt-2 text-center">
          {{ errorMsg }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["save", "close"]);
const isLoading = ref(false);
const errorMsg = ref("");

// Get user name from localStorage
const user = JSON.parse(localStorage.getItem("user"));
const lastUpdateBy = user?.name || user?.email || "Unknown";
const apiBase = import.meta.env.VITE_API_URL;
const port = ref({
  port_name: "",
  corridor: "",
  facilities: "",
  last_update_by: lastUpdateBy,
  is_active: 1,
});

const savePort = async () => {
  console.log("Saving port...", port.value);
  errorMsg.value = "";
  isLoading.value = true;
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${apiBase}/ports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(port.value),
    });
    const data = await response.json();
    if (response.ok && data.success) {
      emit("save", { ...port.value });
      port.value = {
        port_name: "",
        corridor: "",
        facilities: "",
        last_update_by: lastUpdateBy,
        is_active: 1,
      };
      emit("close");
    } else {
      errorMsg.value = data.message || "Failed to save port.";
    }
  } catch (err) {
    errorMsg.value = "Network error. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>
