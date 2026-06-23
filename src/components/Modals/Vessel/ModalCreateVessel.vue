<script setup>
import { reactive, ref } from "vue";

const apiBase = import.meta.env.VITE_API_URL;
const emit = defineEmits(["save", "close"]);

const isLoading = ref(false);
const prefix = ref("");

const vesselInfo = reactive({
  name: "",
  details: "",
  length: 0,
  weight: 0,
  status: 1,
});

const saveVessel = async () => {
  if (!vesselInfo.name) return alert("Enter vessel code!");

  const fullName = prefix.value
    ? `${prefix.value}${vesselInfo.name}`
    : vesselInfo.name;

  const payload = {
    vessel_name: fullName,
    description: vesselInfo.details,
    decklane_length_capacity: vesselInfo.length,
    weight_capacity: vesselInfo.weight,
    status: 1,
    capacity: 0,
  };

  try {
    isLoading.value = true;

    const token = localStorage.getItem("token");

    const res = await fetch(`${apiBase}/vessels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      alert("Vessel created successfully!");
      emit("save", data.data);
      emit("close");

      vesselInfo.name = "";
      vesselInfo.details = "";
      prefix.value = "";
    } else {
      alert(data.message || "Failed to create vessel.");
    }
  } catch (err) {
    console.error(err);
    alert("Server error while creating vessel.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
    @click="$emit('close')"
  >
    <div
      class="modal-card bg-white rounded-lg shadow-xl w-full max-w-lg mx-4"
      @click.stop
    >
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200"
      >
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Create Vessel</h2>
          <p class="text-sm text-gray-500 mt-1">
            Provide basic information about the vessel
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>

      <form @submit.prevent="saveVessel" class="p-6 space-y-6">
        <div class="flex gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Prefix
            </label>
            <select
              v-model="prefix"
              class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Prefix</option>
              <option value="FCM">FCM</option>
              <option value="TCM">TCM</option>
              <option value="AUS">AUS</option>
            </select>
          </div>

          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Vessel Code
            </label>
            <input
              v-model="vesselInfo.name"
              type="text"
              placeholder="Input vessel code"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :disabled="isLoading"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div class="flex flex-col">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Lane Length Capacity (meters)
            </label>
            <input
              v-model="vesselInfo.length"
              type="number"
              placeholder="Input Length Capacity"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :disabled="isLoading"
            />
          </div>
          <div class="flex flex-col">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Weight Capacity (kg)
            </label>
            <input
              v-model="vesselInfo.weight"
              type="number"
              placeholder="Input Weight Capacity"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :disabled="isLoading"
            />
          </div>
        </div>

        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Vessel Details
          </label>
          <textarea
            v-model="vesselInfo.details"
            placeholder="Input vessel details"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :disabled="isLoading"
          ></textarea>
        </div>

        <!-- Footer -->
        <div
          class="flex items-center justify-end gap-3 pt-6 border-t border-gray-200"
        >
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              <span
                class="inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
              ></span>
              Saving...
            </span>
            <span v-else>Save Vessel</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
