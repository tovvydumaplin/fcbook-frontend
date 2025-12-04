<!-- filepath: d:\Fastcat Book 2\fcbook-frontend\src\components\ModalCreateVessel.vue -->
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
          <h2 class="text-lg font-semibold text-gray-900">
            {{ isEditing ? "Edit Vessel" : "Create Vessel" }}
          </h2>
          <p class="text-sm text-gray-500 mt-1">
            Provide basic information about the vessel
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
      <form @submit.prevent="createVessel" class="p-6 space-y-6">
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
        <div>
          <button
            v-if="isEditing"
            type="button"
            class="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            :disabled="isLoading"
            @click="openSeatmapModal"
          >
            Create Seatmap
          </button>
          <ModalCreateSeatmap
            v-if="showSeatmapModal"
            :accomodations="accomodations"
            :seatmap="seatmapData"
            @close="showSeatmapModal = false"
            @save="handleSeatmapSave"
          />
        </div>
        <div class="w-full">
          <!-- TABLE SWITCHES  -->
          <table>
            <thead>
              <tr>
                <th class="w-full text-left py-2 text-sm text-gray-600">
                  Seat Class
                </th>
                <th class="text-left px-2 text-sm text-gray-600">Aircon</th>
                <th class="text-left px-2 text-sm text-gray-600">Wifi</th>
              </tr>
            </thead>
            <tbody>
              <!-- If no seatmap yet -->
              <tr v-if="!seatmapData || !(seatmapData.classes?.length || 0)">
                <td colspan="3" class="py-4 text-center text-gray-500">
                  No class has been added yet.
                </td>
              </tr>

              <!-- Loop through all classes in the seatmap -->
              <tr
                v-else
                v-for="(cls, index) in seatmapData.classes"
                :key="index"
              >
                <td class="py-2">
                  <p class="text-sm">{{ cls.name }}: {{ cls.seats }}</p>
                </td>

                <!-- Aircon -->
                <td class="p-1">
                  <div class="flex items-center gap-3">
                    <div class="relative inline-block w-11 h-5">
                      <input
                        :id="`switch-${cls.name}-aircon`"
                        type="checkbox"
                        v-model="cls.aircon"
                        class="peer appearance-none w-11 h-5 bg-slate-300 rounded-full checked:bg-green-600 cursor-pointer transition-colors duration-300"
                        :disabled="isLoading"
                      />
                      <label
                        :for="`switch-${cls.name}-aircon`"
                        class="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-green-600 cursor-pointer"
                      ></label>
                    </div>

                    <span class="text-sm text-gray-700 select-none"
                      >Inactive</span
                    >
                  </div>
                </td>

                <!-- Wifi -->
                <td class="p-1">
                  <div class="flex items-center gap-3">
                    <div class="relative inline-block w-11 h-5">
                      <input
                        :id="`switch-${cls.name}-wifi`"
                        type="checkbox"
                        v-model="cls.wifi"
                        class="peer appearance-none w-11 h-5 bg-slate-300 rounded-full checked:bg-green-600 cursor-pointer transition-colors duration-300"
                        :disabled="isLoading"
                      />
                      <label
                        :for="`switch-${cls.name}-wifi`"
                        class="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-green-600 cursor-pointer"
                      ></label>
                    </div>

                    <span class="text-sm text-gray-700 select-none"
                      >Inactive</span
                    >
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- TABLE ENDS HERE SWITCHES  -->
        </div>
        <div class="w-full mt-4">
          <select
            v-if="isOpen"
            v-model="selectedClassIndex"
            class="mb-4 w-full px-3 py-2 border rounded-md"
          >
            <option value="" disabled>Select accommodation</option>
            <option
              v-for="seat in availableClasses"
              :key="seat.name"
              :value="seat.name"
            >
              {{ seat.name }}
            </option>
          </select>
          <input
            v-if="isOpen"
            v-model="seats"
            placeholder="Input seat capacity"
            type="text"
            class="mb-4 w-full px-3 py-2 border rounded-md"
          />
          <button
            v-if="!isOpen"
            @click="isOpen = true"
            type="button"
            class="w-full px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-400"
          >
            + Add Class
          </button>

          <div v-if="isOpen" class="grid grid-cols-2 gap-4 w-full">
            <button
              @click="cancelAction"
              type="button"
              class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              @click="saveChanges"
              type="button"
              class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-400"
            >
              Save
            </button>
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
            <span v-else> Save Vessel </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from "vue";
import ModalCreateSeatmap from "./ModalCreateSeatmap.vue";
const isLoading = ref(false);
const emit = defineEmits(["save"]);
const prefix = ref("");
const isOpen = ref(false); // controls the dropdown
const selectedClassIndex = ref(""); // selected value from dropdown
const seats = ref(""); // selected value from dropdown
const addedClasses = ref([]); // track newly added classes
const seatmapData = ref({ classes: [] });
const showSeatmapModal = ref(false);

const openSeatmapModal = () => {
  showSeatmapModal.value = true;
};
const closeSeatmap = () => {
  showSeatmapModal.value = false;
};
const vesselInfo = reactive({
  name: "",
  details: "",
  status: "Available",
});
const accomodations = ref([
  {
    id: 1,
    name: "Business Class",
  },
  {
    id: 2,
    name: "Premium Economy",
  },
  {
    id: 3,
    name: "Economy Class",
  },
]);
const props = defineProps({
  vessel: {
    type: Object,
    default: () => ({ classes: [] }), // default empty vessel
  },
});
watch(
  () => props.vessel,
  (newVal) => {
    if (newVal) {
      vesselInfo.name = newVal.name;
      vesselInfo.details = newVal.details;
      vesselInfo.status = newVal.status;

      // Normalize seatmapData to object with classes array
      seatmapData.value = {
        classes: JSON.parse(JSON.stringify(newVal.classes || [])),
      };
    } else {
      // Reset for create
      vesselInfo.name = "";
      vesselInfo.details = "";
      vesselInfo.status = "Available";
      seatmapData.value = { classes: [] };
    }
  },
  { immediate: true }
);
const isEditing = computed(() => !!props.vessel?.id);
const availableClasses = computed(() =>
  accomodations.value.filter(
    (a) => !seatmapData.value?.classes?.some((c) => c.name === a.name)
  )
);
const cancelAction = () => {
  selectedClassIndex.value = "";
  isOpen.value = false;
};

const saveChanges = () => {
  if (!selectedClassIndex.value) return;

  if (!seatmapData.value?.classes) seatmapData.value = { classes: [] };

  seatmapData.value.classes.push({
    name: selectedClassIndex.value,
    seats: Number(seats.value),
    aircon: false,
    wifi: false,
  });

  selectedClassIndex.value = "";
  seats.value = "";
  isOpen.value = false;
};

const handleSeatmapSave = (data) => {
  seatmapData.value = data;
  showSeatmapModal.value = false;
};

const createVessel = () => {
  if (!vesselInfo.name) return alert("Enter vessel code!");

  // Keep the prefix logic
  const fullName = prefix.value
    ? `${prefix.value}${vesselInfo.name}`
    : vesselInfo.name;

  // Merge classes safely, ensuring seats is always an array
  const mergedClasses = (seatmapData.value?.classes || []).map((c) => ({
    name: c.name,
    aircon: c.aircon ?? false,
    wifi: c.wifi ?? false,
    seats: c.seats ?? 0,
  }));

  // Prepare payload
  const payload = {
    ...vesselInfo,
    name: fullName,
    classes: mergedClasses,
    status: "Available",
  };

  console.log("Normalized Payload:", JSON.parse(JSON.stringify(payload))); // plain arrays

  // Emit payload to parent (create or edit handled in parent)
  emit("save", payload);

  // Reset only if in create mode (optional)
  if (!props.vessel?.id) {
    // CREATE MODE reset only
    vesselInfo.name = "";
    vesselInfo.details = "";
    vesselInfo.status = "Available";

    prefix.value = "";

    // Reset seatmap and added classes
    addedClasses.value = [];
    seats.value = "";

    // Reset dropdown states
    selectedClassIndex.value = "";
    isOpen.value = false;

    // Make sure seatmap modal closes
    showSeatmapModal.value = false;
  }
};
</script>
