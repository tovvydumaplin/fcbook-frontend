<script setup>
import { Eye, Search } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import ModalMerchantDiscounts from "../../../../../components/Modals/Merchant/MerchantDiscount/ModalMerchantDiscounts.vue";

const apiBase = import.meta.env.VITE_API_URL;
const isMerchantDiscountsModalOpen = ref(false);
const selectedMerchant = ref({});
const isTableLoading = ref(false);
const merchants = ref([]);
const search = ref("");

const openMerchantDiscountsModal = (merchant) => {
  selectedMerchant.value = merchant;
  isMerchantDiscountsModalOpen.value = true;
};

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
      merchantId: merchant.merchant_id ?? "-",
      merchantName: merchant.merchant_name ?? "-",
      address: merchant.address ?? "-",
      email: merchant.email ?? "-",
      contactPerson: merchant.contact_person ?? "-",
      contactNumber: merchant.contact_number ?? "-",
      area: merchant.area ?? "-",
      paymentMode: merchant.payment_mode ?? "-",
      paymentType: merchant.payment_type ?? "-",
      effectiveDate: merchant.effective_date
        ? new Date(merchant.effective_date).toLocaleDateString()
        : "-",
      eocDate: merchant.eoc_date
        ? new Date(merchant.eoc_date).toLocaleDateString()
        : "-",
      updatedAt: merchant.updated_at
        ? new Date(merchant.updated_at).toLocaleDateString()
        : "-",
    }));
  } catch (err) {
    console.error("Fetch error:", err);
    Swal.fire("Error", "Failed to fetch merchants.", "error");
  } finally {
    isTableLoading.value = false;
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
            <th class="w-64 px-6 py-3 text-left text-xs text-gray-500">
              Payment Mode
            </th>
            <th class="w-64 px-6 py-3 text-left text-xs text-gray-500">
              Payment Type
            </th>

            <th class="w-40 px-6 py-3 text-left text-xs text-gray-500">
              Action
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(merchant, index) in merchants"
            :key="merchant.merchantId"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 text-sm">{{ index + 1 }}</td>
            <td class="px-6 py-4 text-sm">{{ merchant.merchantName }}</td>
            <td class="px-6 py-4 text-sm">{{ merchant.paymentMode }}</td>
            <td class="px-6 py-4 text-sm">{{ merchant.paymentType }}</td>

            <td class="px-6 py-4 text-sm">
              <button
                @click="openMerchantDiscountsModal(merchant)"
                type="button"
                class="font-medium text-blue-600 hover:text-blue-900 flex items-center gap-2"
              >
                <Eye class="w-5 h-5" />
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Empty State -->
    <div v-else class="text-center py-10 text-gray-500 font-medium">
      No merchants Found
    </div>
  </div>
  <transition name="modal-fade">
    <ModalMerchantDiscounts
      v-if="isMerchantDiscountsModalOpen"
      :merchant="selectedMerchant"
      @close="isMerchantDiscountsModalOpen = false"
    />
  </transition>
</template>
