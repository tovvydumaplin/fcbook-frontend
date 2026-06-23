<script setup>
import { ref, reactive } from "vue";

const emit = defineEmits(["close", "save"]);
const isLoading = ref(false);
const errorMsg = ref("");

const props = defineProps({
  vehicle: {
    type: Object,
    default: () => ({}),
  },
});

const withPlateNumber = ref(props.vehicle.withPlateNumber || false);

const form = reactive({
  vehicleType: props.vehicle?.vehicleType || "",
  vehicleClass: props.vehicle?.vehicleClass || "",
  vehicleLength: props.vehicle?.vehicleLength || 0,
  vehicleWeight: props.vehicle?.vehicleWeight || 0,
  withPlateNumber: props.vehicle?.withPlateNumber || false,
});

const saveVehicle = async () => {
  if (!form.vehicleClass) {
    errorMsg.value = "Vehicle class is required";
    return;
  }

  isLoading.value = true;
  errorMsg.value = "";

  try {
    const payload = {
      vehicle_type: form.vehicleType,
      vehicle_class: form.vehicleClass,
      length: form.vehicleLength,
      weight: form.vehicleWeight,
      with_plate_number: withPlateNumber.value,
    };
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/vehicles/${props.vehicle.vehicleId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      },
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to save");

    emit("save", payload);
    emit("close");
  } catch (err) {
    console.error("Error saving vehicle:", err);
    errorMsg.value = err.message || "Something went wrong";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    @click="$emit('close')"
  >
    <!-- Loading Card -->
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
        <h2 class="text-lg font-semibold text-gray-900">
          Edit {{ form.vehicleClass }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
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
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Type
          </label>
          <input
            type="text"
            v-model="form.vehicleType"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Class
          </label>
          <input
            type="text"
            v-model="form.vehicleClass"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Length (meters)
          </label>
          <input
            type="number"
            v-model="form.vehicleLength"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Weight (kg)
          </label>
          <input
            type="number"
            v-model="form.vehicleWeight"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div class="flex flex-col gap-4">
          <label class="block text-sm font-medium text-gray-700"
            >Plate Number</label
          >
          <div class="flex items-center gap-3 select-none">
            <button
              type="button"
              role="switch"
              :aria-checked="withPlateNumber"
              @click="withPlateNumber = !withPlateNumber"
              :class="[
                'relative inline-flex items-center w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer flex-shrink-0',
                withPlateNumber ? 'bg-blue-600' : 'bg-gray-300',
              ]"
            >
              <span
                :class="[
                  'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300',
                  withPlateNumber ? 'translate-x-6' : 'translate-x-0',
                ]"
              />
            </button>
            <span
              :class="[
                'text-sm font-medium transition-colors duration-200',
                withPlateNumber ? 'text-gray-700' : 'text-gray-400',
              ]"
              >With Plate Number</span
            >
          </div>
        </div>

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
            <span v-else>Save</span>
          </button>
        </div>

        <div v-if="errorMsg" class="text-red-500 text-sm mt-2 text-center">
          {{ errorMsg }}
        </div>
      </form>
    </div>
  </div>
</template>
