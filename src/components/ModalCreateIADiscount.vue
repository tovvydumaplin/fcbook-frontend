<script setup>
import { ref, computed } from "vue";
import Swal from "sweetalert2";

const emit = defineEmits(["close", "save"]);
const apiBase = import.meta.env.VITE_API_URL;
const isLoading = ref(false);
const errorMsg = ref("");
const discountName = ref("");
const selectedRoute = ref("");
const percentageValue = ref("");
const fixedValue = ref("");
const isPercentageDisabled = computed(() => discountType.value === "fixed");
const isFixedDisabled = computed(() => discountType.value === "percentage");
const discountType = ref(null);

const setValue = (type, newValue) => {
  if (newValue === "" || newValue === null) {
    discountType.value = null;
    percentageValue.value = "";
    fixedValue.value = "";
    return;
  }

  discountType.value = type;

  if (type === "percentage") {
    percentageValue.value = newValue;
    fixedValue.value = "";
  } else {
    fixedValue.value = newValue;
    percentageValue.value = "";
  }
};

const props = defineProps({
  routes: {
    type: Array,
    required: true,
  },
  iaId: {
    type: Number,
    required: true,
  },
});

const createIADiscount = async () => {
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
      ia_id: props.iaId,
      discount_name: discountName.value,
      route_id: selectedRoute.value,
      discount_value:
        discountType.value === "percentage"
          ? Number(percentageValue.value)
          : Number(fixedValue.value),
      discount_type: discountType.value,
    };

    const response = await fetch(
      `${apiBase}/institutional-accounts/discounts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create IA discount");
    }

    emit("save");
    emit("close");
  } catch (err) {
    console.error(err);
    errorMsg.value = "Failed to create IA discount.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
    @click="$emit('close')"
  >
    <div
      class="modal-card bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
      @click.stop
    >
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200"
      >
        <div>
          <h2 class="text-lg font-semibold text-gray-900">
            Create New IA Discount
          </h2>
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
      <!-- FORM CONTENT  -->
      <form @submit.prevent="createIADiscount" class="flex flex-col p-6 gap-6">
        <div class="flex flex-col gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Route
            </label>
            <select
              v-model="selectedRoute"
              class="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>Select Route</option>

              <option
                v-for="route in props.routes"
                :key="route.route_id"
                :value="route.route_id"
              >
                {{ route.port_a.port_name }} → {{ route.port_b.port_name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Discount Name
            </label>
            <input
              v-model="discountName"
              type="text"
              required
              placeholder="Standard"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Discount value</label
            >
            <div class="flex justify-between gap-5">
              <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-700"> Percentage Amount </label>
                <div class="relative w-full">
                  <input
                    v-model="percentageValue"
                    @input="(e) => setValue('percentage', e.target.value)"
                    :disabled="isPercentageDisabled"
                    type="number"
                    placeholder="00.00"
                    required
                    class="w-full px-3 py-2 pr-10 text-right border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />

                  <span
                    class="absolute inset-y-0 right-0 p-3 border-l border-gray-300 flex items-center text-gray-500 text-sm"
                  >
                    %
                  </span>
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-700"> Fixed Amount </label>
                <div class="relative w-full">
                  <input
                    v-model="fixedValue"
                    @input="(e) => setValue('fixed', e.target.value)"
                    :disabled="isFixedDisabled"
                    type="number"
                    required
                    placeholder="00.00"
                    class="w-full px-3 py-2 pr-14 text-right border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />

                  <span
                    class="border-l border-gray-300 p-3 absolute inset-y-0 right-0 flex items-center text-gray-500 text-sm"
                  >
                    PHP
                  </span>
                </div>
              </div>
            </div>
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
              Saving IA
            </span>
            <span v-else> Save </span>
          </button>
        </div>
        <div v-if="errorMsg" class="text-red-500 text-sm mt-2 text-center">
          {{ errorMsg }}
        </div>
      </form>
    </div>
  </div>
</template>
