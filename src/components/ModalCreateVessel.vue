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
          <h2 class="text-lg font-semibold text-gray-900">Create Vessel</h2>
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
            type="button"
            class="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            :disabled="isLoading"
            @click="showSeatmapModal = true"
          >
            Create Seatmap
          </button>
          <ModalCreateSeatmap
            v-if="showSeatmapModal"
            :accomodations="accomodations"
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
              <tr>
                <td class="py-2">
                  <p class="text-sm">Business Class: 105</p>
                </td>
                <td class="p-1">
                  <div class="flex items-center gap-3">
                    <div class="relative inline-block w-11 h-5">
                      <input
                        id="switch-component-bc-aircon"
                        type="checkbox"
                        class="peer appearance-none w-11 h-5 bg-slate-300 rounded-full checked:bg-green-600 cursor-pointer transition-colors duration-300"
                        :disabled="isLoading"
                      />
                      <label
                        for="switch-component-bc-aircon"
                        class="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-green-600 cursor-pointer"
                      ></label>
                    </div>

                    <span class="text-sm text-gray-700 select-none"
                      >Inactive</span
                    >
                  </div>
                </td>
                <td class="p-1">
                  <div class="flex items-center gap-3">
                    <div class="relative inline-block w-11 h-5">
                      <input
                        id="switch-component-bc-wifi"
                        type="checkbox"
                        class="peer appearance-none w-11 h-5 bg-slate-300 rounded-full checked:bg-green-600 cursor-pointer transition-colors duration-300"
                        :disabled="isLoading"
                      />
                      <label
                        for="switch-component-bc-wifi"
                        class="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-green-600 cursor-pointer"
                      ></label>
                    </div>

                    <span class="text-sm text-gray-700 select-none"
                      >Inactive</span
                    >
                  </div>
                </td>
              </tr>
              <tr>
                <td class="py-2">
                  <p class="text-sm">Premium Economy: 105</p>
                </td>
                <td class="p-1">
                  <div class="flex items-center gap-3">
                    <div class="relative inline-block w-11 h-5">
                      <input
                        id="switch-component-pc-aircon"
                        type="checkbox"
                        class="peer appearance-none w-11 h-5 bg-slate-300 rounded-full checked:bg-green-600 cursor-pointer transition-colors duration-300"
                        :disabled="isLoading"
                      />
                      <label
                        for="switch-component-pc-aircon"
                        class="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-green-600 cursor-pointer"
                      ></label>
                    </div>

                    <span class="text-sm text-gray-700 select-none"
                      >Inactive</span
                    >
                  </div>
                </td>
                <td class="p-1">
                  <div class="flex items-center gap-3">
                    <div class="relative inline-block w-11 h-5">
                      <input
                        id="switch-component-pc-wifi"
                        type="checkbox"
                        class="peer appearance-none w-11 h-5 bg-slate-300 rounded-full checked:bg-green-600 cursor-pointer transition-colors duration-300"
                        :disabled="isLoading"
                      />
                      <label
                        for="switch-component-pc-wifi"
                        class="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-green-600 cursor-pointer"
                      ></label>
                    </div>

                    <span class="text-sm text-gray-700 select-none"
                      >Inactive</span
                    >
                  </div>
                </td>
              </tr>
              <tr>
                <td class="py-2">
                  <p class="text-sm">Economy Class: 105</p>
                </td>
                <td class="p-1">
                  <div class="flex items-center gap-3">
                    <div class="relative inline-block w-11 h-5">
                      <input
                        id="switch-component-ec-aircon"
                        type="checkbox"
                        class="peer appearance-none w-11 h-5 bg-slate-300 rounded-full checked:bg-green-600 cursor-pointer transition-colors duration-300"
                        :disabled="isLoading"
                      />
                      <label
                        for="switch-component-ec-aircon"
                        class="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-green-600 cursor-pointer"
                      ></label>
                    </div>

                    <span class="text-sm text-gray-700 select-none"
                      >Inactive</span
                    >
                  </div>
                </td>
                <td class="p-1">
                  <div class="flex items-center gap-3">
                    <div class="relative inline-block w-11 h-5">
                      <input
                        id="switch-component-ec-wifi"
                        type="checkbox"
                        class="peer appearance-none w-11 h-5 bg-slate-300 rounded-full checked:bg-green-600 cursor-pointer transition-colors duration-300"
                        :disabled="isLoading"
                      />
                      <label
                        for="switch-component-ec-wifi"
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
import { reactive, ref } from "vue";
import ModalCreateSeatmap from "./ModalCreateSeatmap.vue";

const emit = defineEmits(["save"]);
const prefix = ref("");
const vesselInfo = reactive({
  name: "",
  details: "",
  status: "Available",
});

const seatmapData = ref(null);
const showSeatmapModal = ref(false);

const accomodations = [
  { id: 1, name: "Business Class" },
  { id: 2, name: "Premium Economy" },
  { id: 3, name: "Economy Class" },
];

const handleSeatmapSave = (data) => {
  seatmapData.value = data;
  showSeatmapModal.value = false;
};

const createVessel = () => {
  if (!vesselInfo.name) return alert("Enter vessel code!");

  const fullName = prefix.value
    ? `${prefix.value}${vesselInfo.name}`
    : vesselInfo.name;

  // Map seatmap classes and set all features to true
  const seatmapWithDefaults = (seatmapData.value?.classes || []).map((c) => ({
    ...c,
    online: true,
    teller: true,
    aircon: true,
    wifi: true,
  }));

  const payload = {
    ...vesselInfo,
    name: fullName,
    seatmap: { classes: seatmapWithDefaults },
  };

  console.log("Payload to save:", payload); // for testing
  emit("save", payload);
};
</script>
