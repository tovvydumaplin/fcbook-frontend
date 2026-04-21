<script setup>
import { ref, computed, watch } from "vue";
import { X, Search } from "lucide-vue-next";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "select"]);

const apiBase = import.meta.env.VITE_API_URL;

const passengerTypes = ref([]);
const selectedType = ref(null);
const searchQuery = ref("");
const isLoading = ref(false);

// Filter types by search
const filteredTypes = computed(() => {
  if (!searchQuery.value) return passengerTypes.value;
  const query = searchQuery.value.toLowerCase();
  return passengerTypes.value.filter((type) =>
    type.type.toLowerCase().includes(query),
  );
});

// Filter only active types
const activeTypes = computed(() => {
  return filteredTypes.value.filter((type) => type.status === 1);
});

// Fetch passenger types
const fetchPassengerTypes = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem("token");
    const authHeader = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;

    const response = await fetch(`${apiBase}/passenger-types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Passenger Types Response:", result);

      if (result.success && result.data?.types) {
        passengerTypes.value = result.data.types;
      }
    } else {
      console.error("Failed to fetch passenger types:", response.status);
    }
  } catch (err) {
    console.error("Error fetching passenger types:", err);
  } finally {
    isLoading.value = false;
  }
};

// Select type
const selectType = (type) => {
  selectedType.value = type;
};

// Confirm selection
const confirmSelection = () => {
  if (selectedType.value) {
    emit("select", selectedType.value);
    emit("close");
    selectedType.value = null;
    searchQuery.value = "";
  }
};

// Close modal
const closeModal = () => {
  emit("close");
  selectedType.value = null;
  searchQuery.value = "";
};

// Watch for modal open and fetch data
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && passengerTypes.value.length === 0) {
      fetchPassengerTypes();
    }
  },
);
</script>

<template>
  <transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="modal-card bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b">
          <h2 class="text-lg font-semibold text-gray-900">
            Select Passenger Type
          </h2>
          <button
            class="h-8 w-8 p-0 hover:bg-gray-100 rounded-md flex items-center justify-center transition-colors"
            @click="closeModal"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Search -->
        <div class="p-6 border-b">
          <div class="relative">
            <Search
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search passenger types..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- Loading State -->
          <div v-if="isLoading" class="flex justify-center items-center py-12">
            <div class="flex items-center gap-3">
              <div
                class="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
              ></div>
              <span class="text-gray-600 font-medium"
                >Loading passenger types...</span
              >
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="activeTypes.length === 0"
            class="text-center py-12 text-gray-500"
          >
            <p class="text-lg font-medium">No passenger types found</p>
            <p class="text-sm mt-1">
              {{
                searchQuery
                  ? "Try a different search term"
                  : "No types available"
              }}
            </p>
          </div>

          <!-- Types List -->
          <div v-else class="space-y-3">
            <button
              v-for="type in activeTypes"
              :key="type.p_id"
              @click="selectType(type)"
              :class="[
                'relative w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-4 hover:shadow-md text-left',
                selectedType?.p_id === type.p_id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300',
              ]"
            >
              <!-- Icon -->
              <div
                :class="[
                  'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
                  selectedType?.p_id === type.p_id
                    ? 'bg-blue-100'
                    : 'bg-gray-100',
                ]"
              >
                <svg
                  :class="[
                    'w-6 h-6',
                    selectedType?.p_id === type.p_id
                      ? 'text-blue-600'
                      : 'text-gray-600',
                  ]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>

              <!-- Type Info -->
              <div class="flex-1">
                <p
                  :class="[
                    'text-sm font-semibold capitalize',
                    selectedType?.p_id === type.p_id
                      ? 'text-blue-900'
                      : 'text-gray-900',
                  ]"
                >
                  {{ type.type }}
                </p>
                <div class="flex items-center gap-3 mt-1">
                  <span
                    v-if="parseFloat(type.discount) > 0"
                    class="text-xs text-green-600 font-medium"
                  >
                    {{ (parseFloat(type.discount) * 100).toFixed(0) }}% Discount
                  </span>
                  <span
                    v-if="type.waived"
                    class="text-xs text-orange-600 font-medium"
                  >
                    Fee Waived
                  </span>
                  <span
                    v-if="!parseFloat(type.discount) && !type.waived"
                    class="text-xs text-gray-500"
                  >
                    No discount
                  </span>
                </div>
              </div>

              <!-- Selected Indicator -->
              <div
                v-if="selectedType?.p_id === type.p_id"
                class="absolute top-3 right-3 bg-blue-600 rounded-full p-1"
              >
                <svg
                  class="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end gap-3 p-6 border-t">
          <button
            @click="closeModal"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmSelection"
            :disabled="!selectedType"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2',
              selectedType
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed',
            ]"
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-card {
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
