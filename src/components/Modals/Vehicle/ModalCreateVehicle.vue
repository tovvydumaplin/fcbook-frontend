<script setup>
import { Plus, Trash2 } from "lucide-vue-next";
import { ref, watch } from "vue";

const emit = defineEmits(["close", "save"]);
const apiBase = import.meta.env.VITE_API_URL;
const selectedType = ref("");
const vehicleClasses = ref([]);
const isLoading = ref(false);
const errorMsg = ref("");

const addClassField = () => {
  vehicleClasses.value.push("");
};

const removeClassField = (index) => {
  vehicleClasses.value.splice(index, 1);
};

const saveVehicle = async () => {
  errorMsg.value = "";

  if (!selectedType.value) {
    errorMsg.value = "Vehicle Type is required.";
    return;
  }

  const validClasses = vehicleClasses.value.filter((c) => c !== "");

  if (validClasses.length === 0) {
    errorMsg.value = "At least one Vehicle Class is required.";
    return;
  }

  isLoading.value = true;

  try {
    const payload = {
      vehicle_type: Number(selectedType.value),
      vehicle_classes: validClasses.map((c) => ({ vehicle_class: c })),
    };

    const response = await fetch(`${apiBase}/vehicles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to save vehicle");
    }

    emit("save");
    emit("close");
  } catch (error) {
    console.error(error);
    errorMsg.value = error.message || "Something went wrong while saving.";
  } finally {
    isLoading.value = false;
  }
};

watch(selectedType, () => {
  vehicleClasses.value = [];
});
</script>

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
          <h2 class="text-lg font-semibold text-gray-900">Create Vehicle</h2>
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
      <form @submit.prevent="saveVehicle" class="p-6 space-y-6">
        <!-- Origin Port -->

        <div class="">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Type
          </label>

          <select
            v-model="selectedType"
            class="border border-gray-300 rounded-md px-3 py-2 w-full"
          >
            <option value="" disabled>Select Vehicle Type</option>
            <option :value="1">Type 1</option>
            <option :value="2">Type 2</option>
            <option :value="3">Type 3</option>
            <option :value="4">Type 4</option>
            <option :value="5">Type 5</option>
          </select>

          <div v-if="selectedType" class="mt-4 space-y-3">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Class
            </label>

            <div
              v-for="(item, index) in vehicleClasses"
              :key="index"
              class="flex gap-2"
            >
              <input
                v-model="vehicleClasses[index]"
                type="text"
                required
                placeholder="Enter vehicle class name"
                class="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
              <button
                type="button"
                @click="removeClassField(index)"
                class="font-medium text-red-600 hover:text-red-900 flex items-center"
              >
                <Trash2 class="w-4 h-4 mr-1" />
              </button>
            </div>

            <div class="w-full flex justify-center items-center">
              <button
                type="button"
                @click="addClassField"
                class="w-full py-2 text-sm flex justify-center items-center border-2 border-dashed border-blue-300 gap-3 font-medium text-blue-500 rounded-md hover:bg-blue-500 hover:text-white hover:border-blue-500 transition"
              >
                <Plus class="w-4 h-4" /> Add Vehicle Class
              </button>
            </div>
          </div>
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
            <span v-else> Save </span>
          </button>
        </div>
        <div v-if="errorMsg" class="text-red-500 text-sm mt-2 text-center">
          {{ errorMsg }}
        </div>
      </form>
    </div>
  </div>
</template>
