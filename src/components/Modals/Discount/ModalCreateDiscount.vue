<script setup>
import { ref, computed } from "vue";
import Swal from "sweetalert2";
import DiscountConditions from "./DiscountConditions.vue";

const emit = defineEmits(["save", "close"]);
const apiBase = import.meta.env.VITE_API_URL;

const isRoundtrip = ref(false);
const isLoading = ref(false);
const errorMsg = ref("");
const discountName = ref("");
const discountCode = ref("");
const effectiveDate = ref("");
const endDate = ref("");
const percentageValue = ref("");
const fixedValue = ref("");
const valueType = ref(null);
const noConditions = ref(true);

const isPercentageDisabled = computed(() => valueType.value === 1);
const isFixedDisabled = computed(() => valueType.value === 0);

const conditions = ref({
  vehicles: [],
  passenger: [],
  accommodation: [],
  ports: [],
  schedules: [],
});

const setValue = (type, newValue) => {
  if (newValue === "" || newValue === null) {
    valueType.value = null;
    percentageValue.value = "";
    fixedValue.value = "";
    return;
  }
  valueType.value = type;
  if (type === 0) {
    percentageValue.value = newValue;
    fixedValue.value = "";
  } else {
    fixedValue.value = newValue;
    percentageValue.value = "";
  }
};

const createDiscount = async () => {
  errorMsg.value = "";

  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to create this discount?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });

  if (!confirm.isConfirmed) return;

  isLoading.value = true;

  try {
    const payload = {
      discount_name: discountName.value,
      discount_code: discountCode.value,
      discount_value:
        valueType.value === 0
          ? Number(percentageValue.value)
          : Number(fixedValue.value),
      value_type: valueType.value,
      effective_date: effectiveDate.value,
      end_date: endDate.value,
      round_trip: isRoundtrip.value ? 1 : 0,
      condition: noConditions.value ? 0 : 1,
      ...(!noConditions.value && {
        discount_conditions: conditions.value,
      }),
    };

    const response = await fetch(`${apiBase}/discounts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      errorMsg.value = data.errors
        ? Object.values(data.errors)[0][0]
        : data.message || "Failed to create discount.";
      return;
    }

    emit("save");
    emit("close");
  } catch (error) {
    console.error(error);
    errorMsg.value = "Something went wrong while creating.";
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
    <div
      v-if="isLoading"
      class="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg"
    >
      <span
        class="inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
      ></span>
      <span class="font-semibold text-blue-700 text-base">Saving data...</span>
    </div>
    <!-- Modal -->
    <div
      class="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4"
      @click.stop
    >
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200"
      >
        <h2 class="text-lg font-semibold text-gray-900">Create discount</h2>
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
      <!-- FORM -->
      <form @submit.prevent="createDiscount">
        <div class="grid grid-cols-2">
          <!-- LEFT COLUMN -->
          <div class="flex flex-col gap-6 border-r border-gray-300 p-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Discount Name</label
              >
              <input
                v-model="discountName"
                type="text"
                required
                placeholder="Holiday discount"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Discount Code</label
              >
              <input
                v-model="discountCode"
                type="text"
                required
                placeholder="HOLIDAY200"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Discount Value</label
              >
              <div class="flex gap-5">
                <div class="flex flex-col gap-1 flex-1">
                  <label class="text-xs text-gray-700">Percentage Amount</label>
                  <div class="relative">
                    <input
                      v-model="percentageValue"
                      @input="(e) => setValue(0, e.target.value)"
                      :disabled="isPercentageDisabled"
                      type="number"
                      required
                      placeholder="00.00"
                      class="shadow-sm w-full px-3 py-2 pr-10 text-right border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <span
                      class="absolute inset-y-0 right-0 p-3 border-l border-gray-300 flex items-center text-gray-500 text-sm"
                      >%</span
                    >
                  </div>
                </div>
                <div class="flex flex-col gap-1 flex-1">
                  <label class="text-xs text-gray-700">Fixed Amount</label>
                  <div class="relative">
                    <input
                      v-model="fixedValue"
                      @input="(e) => setValue(1, e.target.value)"
                      :disabled="isFixedDisabled"
                      type="number"
                      required
                      placeholder="00.00"
                      class="shadow-sm w-full px-3 py-2 pr-14 text-right border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <span
                      class="absolute inset-y-0 right-0 p-3 border-l border-gray-300 flex items-center text-gray-500 text-sm"
                      >PHP</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="flex gap-6">
              <div class="text-gray-700 flex flex-col gap-1 flex-1">
                <label class="text-sm font-medium mb-2">Effective Date</label>
                <input
                  v-model="effectiveDate"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="text-gray-700 flex flex-col gap-1 flex-1">
                <label class="text-sm font-medium text-gray-700 mb-2"
                  >End Date</label
                >
                <input
                  v-model="endDate"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div class="flex items-center gap-3 select-none">
              <span
                :class="[
                  'text-sm font-medium transition-colors duration-200',
                  !isRoundtrip ? 'text-gray-700' : 'text-gray-400',
                ]"
                >One Way</span
              >
              <button
                type="button"
                role="switch"
                :aria-checked="isRoundtrip"
                @click="isRoundtrip = !isRoundtrip"
                :class="[
                  'relative inline-flex items-center w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer flex-shrink-0',
                  isRoundtrip ? 'bg-blue-600' : 'bg-gray-300',
                ]"
              >
                <span
                  :class="[
                    'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300',
                    isRoundtrip ? 'translate-x-6' : 'translate-x-0',
                  ]"
                />
              </button>
              <span
                :class="[
                  'text-sm font-medium transition-colors duration-200',
                  isRoundtrip ? 'text-gray-700' : 'text-gray-400',
                ]"
                >Round Trip</span
              >
            </div>
          </div>
          <!-- RIGHT COLUMN -->
          <div class="flex flex-col gap-4 p-6">
            <label class="block text-sm font-medium text-gray-700"
              >Discount Conditions</label
            >
            <div class="flex items-center gap-3 select-none">
              <button
                type="button"
                role="switch"
                :aria-checked="noConditions"
                @click="noConditions = !noConditions"
                :class="[
                  'relative inline-flex items-center w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer flex-shrink-0',
                  noConditions ? 'bg-blue-600' : 'bg-gray-300',
                ]"
              >
                <span
                  :class="[
                    'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300',
                    noConditions ? 'translate-x-6' : 'translate-x-0',
                  ]"
                />
              </button>
              <span
                :class="[
                  'text-sm font-medium transition-colors duration-200',
                  noConditions ? 'text-gray-700' : 'text-gray-400',
                ]"
                >No Conditions</span
              >
            </div>
            <transition name="fade">
              <DiscountConditions v-if="!noConditions" v-model="conditions" />
            </transition>
          </div>
        </div>
        <!-- MODAL FOOTER -->
        <div
          class="flex items-center justify-end gap-3 p-6 border-t border-gray-200"
        >
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
        <div v-if="errorMsg" class="text-red-500 text-sm pb-4 text-center">
          {{ errorMsg }}
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-4px);
}
</style>
