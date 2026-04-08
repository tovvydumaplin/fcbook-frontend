<script setup>
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";

const emit = defineEmits(["close", "save"]);
const apiBase = import.meta.env.VITE_API_URL;
const isLoading = ref(false);
const isInitialLoading = ref(true);
const errorMsg = ref("");
const vessels = ref([]);

const attachmentInputRef = ref(null);
const attachedFiles = ref([]);
const MAX_SIZE_MB = 10;

const selectedVesselId = ref("");
const selectedScheduleId = ref("");

const selectedVessel = computed(
  () =>
    vessels.value.find((v) => v.vesselId === selectedVesselId.value) || null,
);

const availableSchedules = computed(() =>
  selectedVessel.value ? selectedVessel.value.schedules : [],
);

const onVesselChange = () => {
  selectedScheduleId.value = "";
};

const onFileChange = (e) => validateAndAdd([...e.target.files]);
const onFileDrop = (e) => validateAndAdd([...e.dataTransfer.files]);
const removeFile = (index) => attachedFiles.value.splice(index, 1);

const fetchVesselsWithSched = async () => {
  try {
    const res = await fetch(`${apiBase}/vessels/with-schedules`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    if (res.ok && data.success && data.data?.vessels) {
      vessels.value = data.data.vessels.map((v) => ({
        vesselId: v.id,
        vesselName: v.vessel_name || v.name,
        schedules: v.schedules || [],
      }));
    } else {
      vessels.value = [];
    }
  } catch (err) {
    vessels.value = [];
  }
};

const validateAndAdd = (files) => {
  const allowed = [
    "image/",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  for (const file of files) {
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "File too large",
        text: `"${file.name}" exceeds 10MB.`,
      });
      continue;
    }
    const isAllowed = allowed.some((t) => file.type.startsWith(t));
    if (!isAllowed) {
      Swal.fire({
        icon: "warning",
        title: "Invalid file type",
        text: `"${file.name}" is not allowed.`,
      });
      continue;
    }
    if (!attachedFiles.value.find((f) => f.name === file.name)) {
      attachedFiles.value.push(file);
    }
  }
  if (attachmentInputRef.value) attachmentInputRef.value.value = "";
};

onMounted(async () => {
  try {
    await fetchVesselsWithSched();
  } catch (err) {
    console.error(err);
  } finally {
    isInitialLoading.value = false;
  }
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

    <div
      class="modal-card bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4"
      @click.stop
    >
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200"
      >
        <h2 class="text-lg font-semibold text-gray-900">
          Create Cancellation Report
        </h2>
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

      <!-- Initial loading spinner -->
      <div
        v-if="isInitialLoading"
        class="flex items-center justify-center py-16"
      >
        <span
          class="inline-block w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
        ></span>
      </div>

      <form v-else @submit.prevent="saveCancellationReport" class="flex flex-col">
        <!-- FORM FIELDS -->
        <div class="grid grid-cols-[0.75fr_1fr]">
          <!-- LEFT COLUMN  -->
          <div class="flex flex-col gap-6 p-6 border-r border-gray-200">
            <div class="grid grid-cols-2 gap-6">
              <!-- LEFT COLUMN -->
              <div class="flex flex-col gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Vessel</label
                  >
                  <select
                    v-model="selectedVesselId"
                    @change="onVesselChange"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>Select Vessel</option>
                    <option
                      v-for="vessel in vessels"
                      :key="vessel.vesselId"
                      :value="vessel.vesselId"
                    >
                      {{ vessel.vesselName }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Cancellation Category</label
                  >
                  <select
                    v-model="paymentMode"
                    class="border border-gray-300 rounded-md px-3 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>Select Payment Mode</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit">Credit</option>
                    <option value="Prepaid">Prepaid</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Number of Passengers Affected</label
                  >
                  <input
                    type="number"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <!-- RIGHT COLUMN -->
              <div class="flex flex-col gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Trip Schedule</label
                  >
                  <select
                    v-model="selectedScheduleId"
                    required
                    :disabled="
                      !selectedVesselId || availableSchedules.length === 0
                    "
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="" disabled>
                      {{
                        !selectedVesselId
                          ? "Select a vessel first"
                          : availableSchedules.length === 0
                            ? "No schedules available"
                            : "Select Schedule"
                      }}
                    </option>
                    <option
                      v-for="schedule in availableSchedules"
                      :key="schedule.sched_id"
                      :value="schedule.sched_id"
                    >
                      {{ schedule.departure_time }} →
                      {{ schedule.arrival_time }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Cancellation Type</label
                  >
                  <select
                    v-model="paymentMode"
                    class="border border-gray-300 rounded-md px-3 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>Select Payment Mode</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit">Credit</option>
                    <option value="Prepaid">Prepaid</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Number of RCs Affected</label
                  >
                  <input
                    type="number"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Estimated Revenue Loss</label
              >
              <input
                type="number"
                required
                placeholder="200,000"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Consulted Department</label
              >
              <select
                v-model="paymentMode"
                class="border border-gray-300 rounded-md px-3 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>Select Department</option>
                <option value="Cash">Operations</option>
                <option value="Credit">Sales</option>
                <option value="Prepaid">Marketing</option>
                <option value="Prepaid">IT</option>
                <option value="Prepaid">Finance</option>
              </select>
            </div>
          </div>

          <!-- RIGHT COLUMN -->
          <div class="flex flex-col gap-6 p-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Reason of Cancellation</label
              >
              <textarea
                rows="3"
                required
                placeholder="Brief explanation of the reason for cancellation, and answer the (What, When, Where, Who) - Min of 3 sentences"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Recommendation</label
              >
              <textarea
                rows="3"
                required
                placeholder="Explain to ensure that the cancellation will not happen again - Min of 3 sentences"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <!-- SUPPORTING DOCUMENTS -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Supporting Documents / Evidence</label
              >
              <div
                class="w-full border-2 border-dashed border-gray-300 rounded-lg p-5 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                @click="attachmentInputRef.click()"
                @dragover.prevent
                @drop.prevent="onFileDrop"
              >
                <svg
                  class="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M12 16v-8m0 0-3 3m3-3 3 3M4 16.5A3.5 3.5 0 007.5 20h9a3.5 3.5 0 000-7h-.5A5 5 0 006 9.5"
                  />
                </svg>
                <div class="text-center">
                  <p class="text-sm font-medium text-gray-600">
                    Drop files here or <span class="text-blue-600">browse</span>
                  </p>
                  <p class="text-xs text-gray-400 mt-0.5">
                    PNG, JPG, PDF, DOCX — max 10MB per file
                  </p>
                </div>
                <input
                  ref="attachmentInputRef"
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  class="hidden"
                  @change="onFileChange"
                />
              </div>

              <!-- Attached files list -->
              <ul v-if="attachedFiles.length" class="mt-3 flex flex-col gap-2">
                <li
                  v-for="(file, index) in attachedFiles"
                  :key="index"
                  class="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                >
                  <div class="flex items-center gap-2 min-w-0">
                    <!-- Icon based on type -->
                    <span class="flex-shrink-0 text-lg">
                      {{
                        file.type.startsWith("image/")
                          ? "🖼️"
                          : file.type === "application/pdf"
                            ? "📄"
                            : "📎"
                      }}
                    </span>
                    <span class="truncate text-gray-700 text-xs">{{
                      file.name
                    }}</span>
                    <span class="text-gray-400 text-xs flex-shrink-0"
                      >({{ (file.size / 1024).toFixed(1) }} KB)</span
                    >
                  </div>
                  <button
                    type="button"
                    @click="removeFile(index)"
                    class="ml-2 flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- Modal Footer -->
        <div
          class="flex items-center justify-end gap-3 p-6 border-t border-gray-200"
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
                class="inline-block w-5 h-5 rounded-full border-4 border-white border-t-transparent animate-spin"
              ></span>
              Saving IA
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
