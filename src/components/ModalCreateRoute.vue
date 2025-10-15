<template>
  <!-- Modal Overlay -->
  <div
    class="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
    @click="$emit('close')"
  >
    <!-- Modal Content -->
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4" @click.stop>
      <!-- Modal Header -->
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200"
      >
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Create a Route</h2>
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
      <!-- Modal Body -->
      <form @submit.prevent="savePort" class="p-6 space-y-6">
        <!-- Port Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Port Name
          </label>
          <input
            v-model="port.name"
            type="text"
            placeholder="Enter port name (e.g. Batangas, etc.)"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Corridor -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Select a corridor
          </label>
          <div class="space-y-3">
            <label class="flex items-center">
              <input
                v-model="port.corridor"
                type="radio"
                value="Western Corridor"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span class="ml-3 text-sm text-gray-700">Western Corridor</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="port.corridor"
                type="radio"
                value="Central Corridor"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span class="ml-3 text-sm text-gray-700">Central Corridor</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="port.corridor"
                type="radio"
                value="Eastern Corridor"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span class="ml-3 text-sm text-gray-700">Eastern Corridor</span>
            </label>
          </div>
        </div>

        <!-- Facilities -->
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
          />
        </div>

        <!-- Modal Footer -->
        <div
          class="flex items-center justify-end gap-3 pt-6 border-t border-gray-200"
        >
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Save Port
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["save", "close"]);

const port = ref({
  name: "",
  corridor: "",
  facilities: "",
  updatedBy: "Tovvy B. Dumaplin",
  status: "Available",
  createdAt: new Date().toLocaleString(),
  lastUpdated: new Date().toLocaleString(),
});

const savePort = () => {
  // Generate a random ID for demo
  port.value.id = Math.floor(Math.random() * 10000);
  // Emit the port data
  emit("save", { ...port.value });
  // Reset form
  port.value = {
    name: "",
    corridor: "",
    facilities: "",
    updatedBy: "Tovvy B. Dumaplin",
    status: "Available",
    createdAt: new Date().toLocaleString(),
    lastUpdated: new Date().toLocaleString(),
  };
};
</script>
