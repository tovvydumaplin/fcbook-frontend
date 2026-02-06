<!-- filepath: d:\Fastcat Book 2\fcbook-frontend\src\components\ModalCreateRoute.vue -->
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
    <!-- Modal Content -->
    <div
      class="modal-card bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
      @click.stop
    >
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200"
      >
        <div>
          <h2 class="text-lg font-semibold text-gray-900">
            {{
              props.editData ? "Edit Passenger Type" : "Create Passenger type"
            }}
          </h2>
          <p class="text-sm text-gray-500 mt-1">
            {{
              props.editData
                ? "Edit Passenger Type and discount percentage."
                : "Create passenger type and assign percentage."
            }}
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
      <form @submit.prevent="savePassengerType" class="p-6 space-y-6">
        <!-- Origin Port -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Passenger Type Name
          </label>
          <input
            placeholder="Input Passenger Type name"
            type="text"
            v-model="passengerType.passengerTypeName"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Destination Port -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Select Discount
          </label>
          <!-- Select Discount -->
          <select
            v-model="passengerType.selectedDiscount"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Select discount percentage</option>
            <option
              v-for="discount in discounts"
              :key="discount.type"
              :value="discount.value"
            >
              {{ discount.type }} — {{ discount.value * 100 }}%
            </option>
          </select>
        </div>
        <!-- CHECKBOX  -->
        <div class="flex items-center gap-3">
          <div class="relative inline-block w-11 h-5">
            <input
              type="checkbox"
              v-model="waived"
              class="peer appearance-none w-11 h-5 bg-slate-300 rounded-full checked:bg-green-600 cursor-pointer transition-colors duration-300"
              :disabled="isLoading"
            />
            <label
              class="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-green-600 cursor-pointer"
            ></label>
          </div>

          <span class="text-sm text-gray-700 select-none">
            {{ waived ? "Waived" : "Not Waived" }}
          </span>
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
            <span v-else>
              {{ props.editData ? "Save changes" : "Save" }}
            </span>
          </button>
        </div>
        <div v-if="errorMsg" class="text-red-500 text-sm mt-2 text-center">
          {{ errorMsg }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

const emit = defineEmits(["saved", "close"]);
const apiBase = import.meta.env.VITE_API_URL;
const waived = ref(false);
const isLoading = ref(false);
const errorMsg = ref("");

// FORM FIELDS

const passengerType = ref({
  passengerTypeName: "",
  selectedDiscount: "",
});
// DISCOUNTS LIST
const discounts = ref([]);

// Fetch discount list
const fetchDiscounts = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${apiBase}/discount`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await res.json();

    if (res.ok && data.success && data.data?.discounts) {
      discounts.value = data.data.discounts.map((d) => ({
        type: d.discount_type,
        value: Number(d.discount_percentage) / 100, // convert 20 → 0.2
      }));
    } else {
      discounts.value = [];
      console.error("Failed to fetch discounts:", data.message);
    }
  } catch (err) {
    discounts.value = [];
    console.error("Network error fetching discounts:", err);
  }
};

const props = defineProps({
  editData: { type: Object, default: null },
});
watch(
  () => props.editData,
  (newVal) => {
    if (newVal) {
      passengerType.value.passengerTypeName = newVal.type || "";
      passengerType.value.selectedDiscount = Number(newVal.discount) || "";
      waived.value = newVal.waived ?? false;
    } else {
      passengerType.value.passengerTypeName = "";
      passengerType.value.selectedDiscount = "";
      waived.value = false;
    }
  },
  { immediate: true }
);
onMounted(() => {
  fetchDiscounts();

  if (props.editData) {
    passengerTypeName.value = props.editData.type;
    selectedDiscount.value = Number(props.editData.discount) || "";
  }
});

const savePassengerType = async () => {
  if (!passengerType.value.passengerTypeName) {
    errorMsg.value = "Passenger type name is required.";
    return;
  }

  isLoading.value = true;
  errorMsg.value = "";

  try {
    const token = localStorage.getItem("token");

    const payload = {
      type: passengerType.value.passengerTypeName.trim(),
      discount: passengerType.value.selectedDiscount,
      waived: waived.value,
    };

    // Determine if this is create or update
    const isEdit = !!props.editData;
    const url = isEdit
      ? `${apiBase}/passenger-types/${props.editData.p_id}`
      : `${apiBase}/passenger-types`;
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      emit("saved", data.data);
      emit("close");
    } else {
      // Handle duplicate error gracefully
      if (data.error && data.error.includes("Duplicate entry")) {
        errorMsg.value = "This passenger type already exists.";
      } else {
        errorMsg.value = data.message || "Failed to save passenger type.";
      }
    }
  } catch (err) {
    console.error("Network or server error:", err);
    errorMsg.value = "Network error. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>
