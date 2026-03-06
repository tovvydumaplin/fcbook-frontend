<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";

const emit = defineEmits(["close", "save"]);

const apiBase = import.meta.env.VITE_API_URL;

const isLoading = ref(false);
const errorMsg = ref("");

const iaName = ref("");
const address = ref("");
const email = ref("");
const contactPerson = ref("");
const contactNumber = ref("");
const area = ref("");
const paymentMode = ref("");
const effectiveDate = ref("");
const eocDate = ref("");
const paymentType = ref("");

const saveIA = async () => {
  errorMsg.value = "";
  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to save this institutional account?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, save it!",
    cancelButtonText: "Cancel",
  });

  if (!confirm.isConfirmed) return;

  isLoading.value = true;

  try {
    const payload = {
      ia_name: iaName.value,
      address: address.value,
      email: email.value,
      contact_person: contactPerson.value,
      contact_number: contactNumber.value,
      area: area.value,
      payment_mode: paymentMode.value,
      effective_date: effectiveDate.value,
      eoc_date: eocDate.value,
      payment_type: paymentType.value,
    };

    const response = await fetch(`${apiBase}/institutional-accounts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to save institutional account",
      );
    }

    emit("save");
    emit("close");
  } catch (error) {
    console.error(error);
    errorMsg.value = error.message || "Something went wrong while saving.";

    Swal.fire({
      icon: "error",
      title: "Error",
      text: errorMsg.value,
    });
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
      class="modal-card bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4"
      @click.stop
    >
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200"
      >
        <div>
          <h2 class="text-lg font-semibold text-gray-900">
            Create Institutional Account
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
      <form @submit.prevent="saveIA" class="flex flex-col p-6 gap-6">
        <div class="grid grid-cols-2 gap-6">
          <!-- LEFT COLUMN -->
          <div class="flex flex-col gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Account Name
              </label>
              <input
                v-model="iaName"
                type="text"
                required
                placeholder="Archipelago Philippines Ferries Corporation"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Contact Person
              </label>
              <input
                v-model="contactPerson"
                type="text"
                required
                placeholder="John Doe"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <!-- RIGHT COLUMN -->
          <div class="flex flex-col gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                v-model="email"
                type="email"
                required
                placeholder="johndoe@example.com"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                v-model="contactNumber"
                type="tel"
                maxlength="11"
                minlength="11"
                required
                placeholder="+639123456789"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <textarea
            v-model="address"
            rows="3"
            required
            placeholder="123 Main St, Anytown, USA"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        <div class="grid grid-cols-2 gap-6">
          <!-- LEFT COLUMN -->
          <div class="flex flex-col gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Area
              </label>
              <input
                v-model="area"
                type="text"
                required
                placeholder="Batangas"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Payment Mode
              </label>
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
          </div>
          <!-- RIGHT COLUMN -->
          <div class="flex flex-col gap-6">
            <div class="flex gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Effective Date
                </label>
                <input
                  v-model="effectiveDate"
                  type="date"
                  required
                  placeholder="Input Name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  End of Contract
                </label>
                <input
                  v-model="eocDate"
                  type="date"
                  required
                  placeholder="Input Name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Payment Type
              </label>
              <select
                v-model="paymentType"
                class="border border-gray-300 rounded-md px-3 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>Select Payment Type</option>
                <option value="Non-Fixed">Non-Fixed</option>
                <option value="Fixed">Fixed</option>
              </select>
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
