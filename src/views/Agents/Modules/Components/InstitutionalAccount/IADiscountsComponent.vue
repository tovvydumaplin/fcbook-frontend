<script setup>
import { Eye, Search } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import ModalIADiscounts from "../../../../../components/ModalIADiscounts.vue";

const apiBase = import.meta.env.VITE_API_URL;

const isIADiscountsModalOpen = ref(false);

const selectedInstitutionalAccount = ref({});
const isTableLoading = ref(false);
const institutionalAccounts = ref([]);
const search = ref("");

const openIADiscountsModal = (ia) => {
  selectedInstitutionalAccount.value = ia;
  isIADiscountsModalOpen.value = true;
};

const closeDiscountsModal = () => {
  isIADiscountsModalOpen.value = false;
};

const fetchInstitutionalAccounts = async () => {
  try {
    isTableLoading.value = true;

    const res = await fetch(`${apiBase}/institutional-accounts`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch institutional accounts");

    const data = await res.json();

    institutionalAccounts.value = data.data.institutional_accounts.map(
      (ia) => ({
        iaId: ia.ia_id,
        iaName: ia.ia_name,
        address: ia.address,
        email: ia.email,
        contactPerson: ia.contact_person,
        contactNumber: ia.contact_number,
        area: ia.area,
        paymentMode: ia.payment_mode,
        effectiveDate: ia.effective_date,
        eocDate: ia.eoc_date,
        paymentType: ia.payment_type,
        updatedAt: new Date(ia.updated_at).toLocaleDateString(),
      }),
    );
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    isTableLoading.value = false;
  }
};

onMounted(fetchInstitutionalAccounts);
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
          Loading Institutional Accounts...
        </span>
      </div>
    </div>

    <div v-else-if="institutionalAccounts.length > 0">
      <table class="min-w-full table-fixed divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="w-16 px-6 py-3 text-left text-xs text-gray-500">#</th>

            <th class="w-64 px-6 py-3 text-left text-xs text-gray-500">
              Account Name
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
          <!-- Loading -->
          <tr v-if="isTableLoading">
            <td colspan="7" class="text-center py-6 text-gray-500">
              Loading institutional accounts...
            </td>
          </tr>

          <tr
            v-for="(ia, index) in institutionalAccounts"
            :key="ia.iaId"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 text-sm">{{ index + 1 }}</td>
            <td class="px-6 py-4 text-sm">{{ ia.iaName }}</td>
            <td class="px-6 py-4 text-sm">{{ ia.paymentMode }}</td>
            <td class="px-6 py-4 text-sm">{{ ia.paymentType }}</td>

            <td class="px-6 py-4 text-sm">
              <button
                @click="openIADiscountsModal(ia)"
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
      No Institutional Accounts Found
    </div>
  </div>

  <transition name="modal-fade">
    <ModalIADiscounts
      v-if="isIADiscountsModalOpen"
      :ia="selectedInstitutionalAccount"
      @close="closeDiscountsModal"
    />
  </transition>
</template>
