<script setup>
import { RefreshCw, Search } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";

const apiBase = import.meta.env.VITE_API_URL;
const isTableLoading = ref(false);
const isResetting = ref(false);
const merchants = ref([]);
const search = ref("");

const fetchMerchants = async () => {
  try {
    isTableLoading.value = true;

    const res = await fetch(`${apiBase}/merchants`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch merchants");

    const data = await res.json();

    merchants.value = data.data.merchants.map((merchant) => ({
      merchantId: merchant.merchant_id,
      merchantName: merchant.merchant_name,
      address: merchant.address,
      email: merchant.email ?? "-",
    }));
  } catch (err) {
    console.error("Fetch error:", err);
    Swal.fire("Error", "Failed to fetch merchants", "error");
  } finally {
    isTableLoading.value = false;
  }
};

const resetPassword = async (merchant) => {
  const result = await Swal.fire({
    title: `Reset password for ${merchant.email}?`,
    text: "This will reset the password to the default password.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    try {
      isResetting.value = true;

      const res = await fetch(
        `${apiBase}/merchants/${merchant.merchantId}/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!res.ok) throw new Error("Failed to reset password");

      const data = await res.json();

      Swal.fire(
        "Success",
        data.message || "Password has been reset.",
        "success",
      );
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to reset password.", "error");
    } finally {
      isResetting.value = false;
    }
  }
};

onMounted(fetchMerchants);
</script>

<template>
  <!-- TABLE -->
  <div class="px-4 py-3 border-b border-gray-200 flex flex-col gap-2">
    <div class="flex justify-between items-center">
      <div class="relative">
        <Search
          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
        />
        <input
          v-model="search"
          @input="currentPage = 1"
          type="text"
          placeholder="Search"
          class="pl-10 pr-4 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  </div>
  <div class="p-4">
    <!-- Loading -->
    <div
      v-if="isTableLoading"
      class="flex justify-center items-center py-8 min-h-[40vh]"
    >
      <div
        class="flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg"
      >
        <span
          class="inline-block w-6 h-6 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
        ></span>
        <span class="font-semibold text-blue-700 text-base">
          Loading Merchants...
        </span>
      </div>
    </div>
    <!-- Table -->
    <div v-else-if="merchants.length > 0">
      <table class="min-w-full table-fixed divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="w-16 px-6 py-3 text-left text-xs text-gray-500">#</th>

            <th class="w-64 px-6 py-3 text-left text-xs text-gray-500">
              Merchant Name
            </th>
            <th class="w-40 px-6 py-3 text-left text-xs text-gray-500">
              Email
            </th>

            <th class="w-40 px-6 py-3 text-left text-xs text-gray-500">
              Action
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- Loading -->
          <tr v-if="isTableLoading">
            <td colspan="7" class="text-center py-6 text-gray-500">
              Loading Merchants...
            </td>
          </tr>
          <tr
            v-for="(merchant, index) in merchants"
            :key="merchant.merchantId"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 text-sm">{{ index + 1 }}</td>
            <td class="px-6 py-4 text-sm">{{ merchant.merchantName }}</td>
            <td class="px-6 py-4 text-sm">{{ merchant.email }}</td>
            <td class="px-6 py-4 text-sm">
              <button
                @click="resetPassword(merchant)"
                :disabled="isResetting"
                class="font-medium text-blue-600 hover:text-blue-900 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw class="w-5 h-5 animate-spin" v-if="isResetting" />
                <span v-if="isResetting">Resetting</span>
                <span v-else class="flex gap-2"
                  ><RefreshCw class="w-5 h-5" />Reset PW</span
                >
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Empty State -->
    <div v-else class="text-center py-10 text-gray-500 font-medium">
      No Merchants Found
    </div>
  </div>
</template>
