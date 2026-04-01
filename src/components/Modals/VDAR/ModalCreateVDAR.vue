<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import LeftSection from "./Sections/LeftSection.vue";
import MiddleSection from "./Sections/MiddleSection.vue";
import RightSection from "./Sections/RightSection.vue";

const emit = defineEmits(["close", "save"]);
const apiBase = import.meta.env.VITE_API_URL;
const isLoading = ref(false);
const errorMsg = ref("");

const form = ref({
  name: "",
  vessel: "",
  schedule: "",
  vesselMaster: "",
  origin: "",
  destination: "",
  voyageNumber: "",
  sailingSpeed: "",
  waterConsumption: "",
  fuelRob: "",
  reasonForDelay: "",
  actualDepartureTime: "",
  actualArrivalTime: "",
  maneuverUndock: "",
});
const saveVDAR = () => {
  console.log("Saving VDAR...", form.value);
};
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    @click="$emit('close')"
  >
    <!-- Saving toast -->
    <div
      v-if="isLoading"
      class="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg"
    >
      <span
        class="inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
      ></span>
      <span class="font-semibold text-blue-700 text-base">Saving data...</span>
    </div>

    <div
      class="bg-white rounded-lg shadow-xl w-full mx-4 flex flex-col"
      style="height: 90vh"
      @click.stop
    >
      <!-- Header — fixed -->
      <div
        class="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-200"
      >
        <h2 class="text-lg font-semibold text-gray-900">Create Report</h2>
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

      <!-- Form — takes remaining height -->
      <form @submit.prevent="saveVDAR" class="flex flex-col flex-1 min-h-0">
        <!-- 3-column body — fills remaining height, each column scrolls independently -->
        <div class="grid grid-cols-3 flex-1 min-h-0">
          <!-- LEFT COLUMN -->
          <LeftSection v-model="form" />

          <!-- MIDDLE COLUMN -->
          <MiddleSection v-model="form" />

          <!-- RIGHT COLUMN -->
          <RightSection v-model="form" />
        </div>

        <!-- Footer — fixed at bottom -->
        <div
          class="flex-shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200"
        >
          <p v-if="errorMsg" class="text-red-500 text-sm mr-auto">
            {{ errorMsg }}
          </p>
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              <span
                class="inline-block w-4 h-4 rounded-full border-4 border-white border-t-transparent animate-spin"
              ></span>
              Saving...
            </span>
            <span v-else>Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
