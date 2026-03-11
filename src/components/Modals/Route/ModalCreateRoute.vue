<!-- filepath: d:\Fastcat Book 2\fcbook-frontend\src\components\ModalCreateRoute.vue -->
<template>
  <div
    class="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
    @click="$emit('close')"
  >
    <!-- Top-right Floating Saving Card -->
    <div
      v-if="isLoading"
      class="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg"
    >
      <span
        class="inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
      ></span>
      <span class="font-semibold text-blue-700 text-base">Saving data...</span>
    </div>
    <!-- Modal Content -->
    <div
      class="modal-card bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
      @click.stop
    >
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200"
      >
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Create a Route</h2>
          <p class="text-sm text-gray-500 mt-1">
            Select origin and destination ports
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
      <form @submit.prevent="saveRoute" class="p-6 space-y-6">
        <!-- Origin Port -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Origin Port
          </label>
          <select
            v-model="route.port_a_id"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Select origin port</option>
            <option
              v-for="port in ports"
              :key="port.port_id"
              :value="port.port_id"
            >
              {{ port.port_name }}
            </option>
          </select>
        </div>

        <!-- Destination Port -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Destination Port
          </label>
          <select
            v-model="route.port_b_id"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Select destination port</option>
            <option
              v-for="port in ports"
              :key="port.port_id + '-dest'"
              :value="port.port_id"
            >
              {{ port.port_name }}
            </option>
          </select>
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
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              <span
                class="inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
              ></span>
              Saving...
            </span>
            <span v-else> Save Route </span>
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
import { ref, onMounted } from "vue";

const emit = defineEmits(["save", "close"]);
const apiBase = import.meta.env.VITE_API_URL;
const isLoading = ref(false);
const errorMsg = ref("");

const ports = ref([]);
const route = ref({
  port_a_id: "",
  port_b_id: "",
});

onMounted(async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${apiBase}/ports`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await response.json();
    if (response.ok && data.success && data.data?.ports) {
      ports.value = data.data.ports;
    } else {
      ports.value = [];
      console.error("Failed to fetch ports:", data.message || data);
    }
  } catch (err) {
    ports.value = [];
    console.error("Network error fetching ports:", err);
  }
});

const saveRoute = async () => {
  errorMsg.value = "";
  isLoading.value = true;
  try {
    const token = localStorage.getItem("token");
    const payload = {
      port_a_id: route.value.port_a_id,
      port_b_id: route.value.port_b_id,
    };
    console.log("Sending route payload:", JSON.stringify(payload));
    const response = await fetch(`${apiBase}/routes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (response.ok && data.success) {
      emit("save", { ...payload });
      route.value = {
        port_a_id: "",
        port_b_id: "",
      };
      emit("close");
    } else if (data.error) {
      errorMsg.value = data.error;
    } else {
      errorMsg.value = data.message || "Failed to save route.";
    }
  } catch (err) {
    errorMsg.value = "Network error. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>
