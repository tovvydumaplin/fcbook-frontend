<!-- filepath: d:\Fastcat Book 2\fcbook-frontend\src\components\ModalCreateRoute.vue -->
<template>
  <div
    class="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg shadow-xl w-fit mx-4" @click.stop>
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200"
      >
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Create Seatmap</h2>
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
        <!-- <form action="" class="p-6 space-y-6"></form> -->
      </div>
      <form action="" class="p-6 space-y-6">
        <div class="flex gap-8 justify-between">
          <div class="seatmap_tools h-[410px] overflow-y-auto">
            <!-- ClASS LIST STARTS HERE -->
            <div class="mb-4">
              <p class="text-sm font-medium text-gray-700 mb-3">
                List of Class
              </p>
              <div class="mb-2">
                <div
                  v-for="(seat, index) in seatClasses"
                  :key="index"
                  class="flex justify-between p-1"
                >
                  <p class="text-sm">{{ seat.name }}</p>
                  <span
                    class="text-sm text-red-500 cursor-pointer"
                    @click="$emit('delete-seat', index)"
                  >
                    DEL
                  </span>
                </div>
              </div>
              <div class="w-full">
                <!-- Main Button -->
                <div>
                  <select
                    v-if="isOpen"
                    required
                    class="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled selected>
                      Select accommodation to add
                    </option>
                    <option
                      v-for="(seat, index) in seatClasses"
                      :key="index"
                      :value="index"
                    >
                      {{ seat.name }}
                    </option>
                  </select>
                </div>
                <button
                  v-if="!isOpen"
                  type="button"
                  @click="isOpen = !isOpen"
                  class="w-full px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 border border-transparent rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Add Class
                </button>

                <!-- Dropdown -->
                <div v-if="isOpen" class="w-full grid grid-cols-2 gap-4">
                  <button
                    class="w-full px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 border border-transparent rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    @click="cancelAction"
                  >
                    Cancel
                  </button>
                  <button
                    class="w-full px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 border border-transparent rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    @click="saveChanges"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
            <!-- ClASS LIST ENDS HERE -->
            <!-- GENERATING SEATS STARTS HERE -->
            <div>
              <div class="flex gap-4 w-80 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Row Seats
                  </label>
                  <input
                    type="text"
                    placeholder="Input rows"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :disabled="isLoading"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Column Seats
                  </label>
                  <input
                    type="text"
                    placeholder="Input columns"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :disabled="isLoading"
                  />
                </div>
              </div>
              <button
                class="w-full px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 border border-transparent rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mb-4"
              >
                Generating Seats
              </button>
            </div>
            <!-- GENERATING SEATS ENDS HERE  -->
            <div class="grid grid-cols-2 gap-4">
              <button
                class="w-full px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 border border-transparent rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Rename Seat
              </button>
              <button
                class="w-full px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 border border-transparent rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Block/Unblock
              </button>
              <button
                class="w-full px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 border border-transparent rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Walk Path
              </button>
              <button
                class="w-full px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 border border-transparent rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Reset Changes
              </button>
            </div>
          </div>
          <!-- SEATMAP PREVIEW STARTS HERE -->
          <div
            class="seatmap_preview border border-gray-400 p-3 rounded-lg w-96"
          >
            <p class="text-sm text-center font-medium text-gray-700 mb-3">
              Seatmap Preview
            </p>
          </div>
          <!-- SEATMAP PREVIEW ENDS HERE -->
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
            <span v-else> Save Seatmap </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const props = defineProps({
  seatClasses: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["save", "close"]);
const apiBase = import.meta.env.VITE_API_URL;
const isLoading = ref(false);
const errorMsg = ref("");
const model = ref(false);
const isOpen = ref(false);

function cancelAction() {
  isOpen.value = false; // closes dropdown
}

function saveChanges() {
  isOpen.value = false; // closes dropdown
}
</script>
