<template>
  <transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
      @click.self="$emit('close')"
    >
      <div
        class="modal-card bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b">
          <h2 class="text-xl font-semibold text-gray-900">
            Select an Institutional Account
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

        <!-- Search -->
        <div class="p-6 border-b">
          <div class="relative">
            <svg
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search Institutional Account.."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <h3 class="text-sm font-medium text-gray-700 mb-4">
            List of active I.A's
          </h3>

          <!-- Loading State -->
          <div
            v-if="isLoading"
            class="grid grid-cols-4 gap-4"
          >
            <div
              v-for="i in 8"
              :key="i"
              class="animate-pulse"
            >
              <div
                class="bg-gray-200 rounded-lg p-6 h-32 flex flex-col items-center justify-center"
              >
                <div class="w-12 h-12 bg-gray-300 rounded-full mb-2"></div>
                <div class="w-24 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>

          <!-- No Results -->
          <div
            v-else-if="filteredAccounts.length === 0"
            class="text-center py-12 text-gray-500"
          >
            <svg
              class="w-16 h-16 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p>No institutional accounts found</p>
          </div>

          <!-- Accounts Grid -->
          <div v-else class="grid grid-cols-4 gap-4">
            <button
              v-for="account in filteredAccounts"
              :key="account.id"
              @click="selectAccount(account)"
              :class="[
                'relative border-2 rounded-lg p-6 transition-all duration-200',
                'flex flex-col items-center justify-center text-center',
                'hover:border-blue-500 hover:shadow-md',
                selectedAccount?.id === account.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white',
              ]"
            >
              <!-- Radio Circle -->
              <div class="absolute top-3 right-3">
                <div
                  :class="[
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                    selectedAccount?.id === account.id
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-300 bg-white',
                  ]"
                >
                  <svg
                    v-if="selectedAccount?.id === account.id"
                    class="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <!-- Logo/Icon -->
              <div class="w-16 h-16 mb-3 flex items-center justify-center">
                <img
                  v-if="account.logo"
                  :src="account.logo"
                  :alt="account.name"
                  class="max-w-full max-h-full object-contain"
                />
                <div
                  v-else
                  class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                >
                  {{ getInitials(account.name) }}
                </div>
              </div>

              <!-- Account Name -->
              <span class="text-sm font-medium text-gray-900">
                {{ account.name }}
              </span>
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t p-6 flex justify-end">
          <button
            @click="confirmSelection"
            :disabled="!selectedAccount"
            :class="[
              'px-8 py-3 rounded-lg font-semibold transition-all',
              selectedAccount
                ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed',
            ]"
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "select"]);

const apiBase = import.meta.env.VITE_API_URL;
const searchQuery = ref("");
const selectedAccount = ref(null);
const accounts = ref([]);
const isLoading = ref(false);

// Fetch institutional accounts
const fetchAccounts = async () => {
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
      if (result.success && result.data?.accounts) {
        accounts.value = result.data.accounts.filter(
          (acc) => acc.status === "active"
        );
      }
    } else {
      console.error("Failed to fetch institutional accounts");
    }
  } catch (err) {
    console.error("Error fetching institutional accounts:", err);
  } finally {
    isLoading.value = false;
  }
};

// Filter accounts based on search
const filteredAccounts = computed(() => {
  if (!searchQuery.value) return accounts.value;
  const query = searchQuery.value.toLowerCase();
  return accounts.value.filter((account) =>
    account.name.toLowerCase().includes(query)
  );
});

// Get initials from name for placeholder logo
const getInitials = (name) => {
  const words = name.split(" ");
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Select account
const selectAccount = (account) => {
  selectedAccount.value = account;
};

// Confirm selection
const confirmSelection = () => {
  if (selectedAccount.value) {
    emit("select", selectedAccount.value);
    emit("close");
    // Reset after selection
    selectedAccount.value = null;
    searchQuery.value = "";
  }
};

// Fetch accounts when modal opens
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && accounts.value.length === 0) {
      fetchAccounts();
    }
  }
);

// Reset selection when modal closes
watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      selectedAccount.value = null;
      searchQuery.value = "";
    }
  }
);

onMounted(() => {
  if (props.isOpen) {
    fetchAccounts();
  }
});
</script>

<style scoped>
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
