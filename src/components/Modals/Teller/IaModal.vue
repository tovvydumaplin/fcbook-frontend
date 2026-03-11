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

const institutionalAccounts = ref([]);
const selectedIA = ref(null);
const searchQuery = ref("");
const isLoading = ref(false);

// Filter IAs by search
const filteredIAs = computed(() => {
  if (!searchQuery.value) return institutionalAccounts.value;
  const query = searchQuery.value.toLowerCase();
  return institutionalAccounts.value.filter((ia) =>
    ia.ia_name.toLowerCase().includes(query),
  );
});

// Fetch institutional accounts
const fetchInstitutionalAccounts = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem("token");
    const authHeader = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;

    const response = await fetch(`${apiBase}/institutional-accounts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log("IA Response:", result);

      if (result.success && result.data?.institutional_accounts) {
        institutionalAccounts.value = result.data.institutional_accounts;
      }
    } else {
      console.error("Failed to fetch institutional accounts:", response.status);
    }
  } catch (err) {
    console.error("Error fetching institutional accounts:", err);
  } finally {
    isLoading.value = false;
  }
};

// Select IA
const selectIA = (ia) => {
  selectedIA.value = ia;
};

// Confirm selection
const confirmSelection = () => {
  if (selectedIA.value) {
    emit("select", selectedIA.value);
    emit("close");
    selectedIA.value = null;
    searchQuery.value = "";
  }
};

// Close modal
const closeModal = () => {
  emit("close");
  selectedIA.value = null;
  searchQuery.value = "";
};

// Watch for modal open and fetch data
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && institutionalAccounts.value.length === 0) {
      fetchInstitutionalAccounts();
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
        class="modal-card bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b">
          <h2 class="text-lg font-semibold text-gray-900">
            Select Institutional Account
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
              placeholder="Search institutional accounts..."
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
                >Loading institutional accounts...</span
              >
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="filteredIAs.length === 0"
            class="text-center py-12 text-gray-500"
          >
            <p class="text-lg font-medium">No institutional accounts found</p>
            <p class="text-sm mt-1">
              {{
                searchQuery
                  ? "Try a different search term"
                  : "No accounts available"
              }}
            </p>
          </div>

          <!-- IA Grid -->
          <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              v-for="ia in filteredIAs"
              :key="ia.ia_id"
              @click="selectIA(ia)"
              :class="[
                'relative p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-3 hover:shadow-md',
                selectedIA?.ia_id === ia.ia_id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300',
              ]"
            >
              <!-- IA Image -->
              <div
                class="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
              >
                <img
                  v-if="ia.ia_image"
                  :src="`${apiBase}/${ia.ia_image}`"
                  :alt="ia.ia_name"
                  class="w-full h-full object-cover"
                  @error="(e) => (e.target.style.display = 'none')"
                />
                <span v-else class="text-3xl font-bold text-gray-400">
                  {{ ia.ia_name.charAt(0) }}
                </span>
              </div>

              <!-- IA Name -->
              <div class="text-center">
                <p
                  :class="[
                    'text-sm font-semibold',
                    selectedIA?.ia_id === ia.ia_id
                      ? 'text-blue-900'
                      : 'text-gray-900',
                  ]"
                >
                  {{ ia.ia_name }}
                </p>
              </div>

              <!-- Selected Indicator -->
              <div
                v-if="selectedIA?.ia_id === ia.ia_id"
                class="absolute top-2 right-2 bg-blue-600 rounded-full p-1"
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
            :disabled="!selectedIA"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2',
              selectedIA
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
