<script setup>
import { ref, watch } from "vue";
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

// Logo
const logoFile = ref(null);
const logoPreview = ref(null);
const logoInputRef = ref(null);

const props = defineProps({
  ia: {
    type: Object,
    required: true,
  },
});

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date)) return "";
  return date.toISOString().split("T")[0];
};

const onLogoChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    Swal.fire({
      icon: "error",
      title: "Invalid file",
      text: "Please select an image file.",
    });
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    Swal.fire({
      icon: "error",
      title: "File too large",
      text: "Image must be under 2MB.",
    });
    return;
  }
  logoFile.value = file;
  logoPreview.value = URL.createObjectURL(file);
};

const removeLogo = () => {
  logoFile.value = null;
  // If there was an existing server image, clear it too
  logoPreview.value = null;
  if (logoInputRef.value) logoInputRef.value.value = "";
};

const updateIA = async () => {
  errorMsg.value = "";

  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to edit this institutional account?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });

  if (!confirm.isConfirmed) return;

  isLoading.value = true;

  try {
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("ia_name", iaName.value);
    formData.append("address", address.value);
    formData.append("email", email.value);
    formData.append("contact_person", contactPerson.value);
    formData.append("contact_number", contactNumber.value);
    formData.append("area", area.value);
    formData.append("payment_mode", paymentMode.value);
    formData.append("effective_date", effectiveDate.value);
    formData.append("eoc_date", eocDate.value);
    formData.append("payment_type", paymentType.value);
    if (logoFile.value) formData.append("logo", logoFile.value);

    const response = await fetch(
      `${apiBase}/institutional-accounts/${props.ia.iaId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to update institutional account",
      );
    }

    emit("save");
    emit("close");
  } catch (error) {
    console.error(error);
    errorMsg.value = error.message || "Something went wrong while updating.";
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => props.ia,
  (newIA) => {
    if (!newIA) return;
    iaName.value = newIA.iaName || "";
    address.value = newIA.address || "";
    email.value = newIA.email || "";
    contactPerson.value = newIA.contactPerson || "";
    contactNumber.value = newIA.contactNumber || "";
    area.value = newIA.area || "";
    paymentMode.value = newIA.paymentMode || "";
    paymentType.value = newIA.paymentType || "";
    effectiveDate.value = formatDate(newIA.effectiveDate);
    eocDate.value = formatDate(newIA.eocDate);
    logoFile.value = null;
    logoPreview.value = newIA.image
      ? `${apiBase}/storage/${newIA.image}`
      : null;
  },
  { immediate: true },
);
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
        <h2 class="text-lg font-semibold text-gray-900">
          Edit Institutional Account
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

      <form @submit.prevent="updateIA" class="flex flex-col p-6 gap-6">
        <!-- LOGO UPLOAD -->
        <div
          class="flex items-center gap-5 p-4 bg-gray-50 border border-gray-200 rounded-lg"
        >
          <div class="relative flex-shrink-0">
            <div
              class="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 bg-white flex items-center justify-center overflow-hidden"
              :class="{ 'border-blue-400 border-solid': logoPreview }"
            >
              <img
                v-if="logoPreview"
                :src="logoPreview"
                alt="Logo preview"
                class="w-full h-full object-contain"
              />
              <svg
                v-else
                class="w-8 h-8 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <!-- Remove button -->
            <button
              v-if="logoPreview"
              type="button"
              @click="removeLogo"
              class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow transition-colors"
              title="Remove logo"
            >
              <svg
                class="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div class="flex flex-col gap-1.5">
            <p class="text-sm font-medium text-gray-700">Account Logo</p>
            <p class="text-xs text-gray-400">PNG, JPG, or WEBP — max 2MB</p>
            <input
              ref="logoInputRef"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onLogoChange"
            />
            <button
              type="button"
              @click="logoInputRef.click()"
              class="mt-1 w-fit px-3 py-1.5 text-xs font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              {{ logoPreview ? "Change Logo" : "Upload Logo" }}
            </button>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-6">
          <div class="flex flex-col gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Account Name</label
              >
              <input
                v-model="iaName"
                type="text"
                required
                placeholder="Archipelago Philippines Ferries Corporation"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Contact Person</label
              >
              <input
                v-model="contactPerson"
                type="text"
                required
                placeholder="John Doe"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div class="flex flex-col gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Email</label
              >
              <input
                v-model="email"
                type="email"
                required
                placeholder="johndoe@example.com"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Contact Number</label
              >
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
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Address</label
          >
          <textarea
            v-model="address"
            rows="3"
            required
            placeholder="123 Main St, Anytown, USA"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        <div class="grid grid-cols-2 gap-6">
          <div class="flex flex-col gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Area</label
              >
              <input
                v-model="area"
                type="text"
                required
                placeholder="Batangas"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Payment Mode</label
              >
              <select
                v-model="paymentMode"
                class="border border-gray-300 rounded-md px-3 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>Select Payment Mode</option>
                <option value="Cash">Cash</option>
                <option value="Credit">Credit Card</option>
                <option value="Prepaid">Prepaid Wallet</option>
              </select>
            </div>
          </div>
          <div class="flex flex-col gap-6">
            <div class="flex gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Effective Date</label
                >
                <input
                  v-model="effectiveDate"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >End of Contract</label
                >
                <input
                  v-model="eocDate"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Payment Type</label
              >
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
            :disabled="isLoading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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
