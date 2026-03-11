<script setup>
import { ref, watch } from "vue";

const emit = defineEmits(["saved", "close"]);
const apiBase = import.meta.env.VITE_API_URL;
const waived = ref(false);
const isLoading = ref(false);
const errorMsg = ref("");

const props = defineProps({
  editData: { type: Object, default: null },
});

const passengerType = ref({
  passengerTypeName: "",
  selectedDiscount: "",
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
      // UI percent → DB decimal
      discount: Number(passengerType.value.selectedDiscount) / 100,
      waived: waived.value,
    };

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
      errorMsg.value = data?.error?.includes("Duplicate entry")
        ? "This passenger type already exists."
        : data.message || "Failed to save passenger type.";
    }
  } catch (err) {
    console.error(err);
    errorMsg.value = "Network error. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => props.editData,
  (newVal) => {
    if (newVal) {
      passengerType.value.passengerTypeName = newVal.type || "";

      // DB decimal → UI percent
      passengerType.value.selectedDiscount =
        newVal.discount != null ? Number(newVal.discount) * 100 : "";

      waived.value = newVal.waived ?? false;
    } else {
      passengerType.value.passengerTypeName = "";
      passengerType.value.selectedDiscount = "";
      waived.value = false;
    }
  },
  { immediate: true },
);
</script>

+
<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    @click="$emit('close')"
  >
    <!-- Floating Saving Card -->
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
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4" @click.stop>
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">
            {{
              props.editData ? "Edit Passenger Type" : "Create Passenger Type"
            }}
          </h2>
          <p class="text-sm text-gray-500 mt-1">
            {{
              props.editData
                ? "Edit passenger type and discount percentage."
                : "Create passenger type and input discount percentage."
            }}
          </p>
        </div>

        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="savePassengerType" class="p-6 space-y-6">
        <!-- Passenger Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Passenger Type Name
          </label>
          <input
            type="text"
            placeholder="Input Passenger Type name"
            v-model="passengerType.passengerTypeName"
            class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <!-- Discount Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Discount Percentage
          </label>

          <div class="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="Enter discount (ex: 20)"
              v-model="passengerType.selectedDiscount"
              class="w-full px-3 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
            <span
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              %
            </span>
          </div>
        </div>

        <!-- Waived Toggle -->
        <div class="flex items-center gap-3">
          <input
            type="checkbox"
            v-model="waived"
            class="w-5 h-5 accent-green-600"
            :disabled="isLoading"
          />
          <span class="text-sm text-gray-700">
            {{ waived ? "Waived" : "Not Waived" }}
          </span>
        </div>

        <!-- Footer -->
        <div class="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            :disabled="isLoading"
          >
            {{
              isLoading ? "Saving..." : props.editData ? "Save changes" : "Save"
            }}
          </button>
        </div>

        <div v-if="errorMsg" class="text-red-500 text-sm text-center">
          {{ errorMsg }}
        </div>
      </form>
    </div>
  </div>
</template>
