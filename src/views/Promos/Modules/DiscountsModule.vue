<script setup>
import { Edit, Plus, Search } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import ModalCreateDiscount from "../../../components/Modals/Discount/ModalCreateDiscount.vue";
import ModalEditDiscount from "../../../components/Modals/Discount/ModalEditDiscount.vue";

const apiBase = import.meta.env.VITE_API_URL;
const isTableLoading = ref(false);
const isEditModalOpen = ref(false);
const isCreateModalOpen = ref(false);
const selectedDiscount = ref([]);
const discounts = ref([]);
const search = ref("");

const openEditDiscount = (discount) => {
  selectedDiscount.value = discount;
  isEditModalOpen.value = true;
};

const createdDiscount = async () => {
  isCreateModalOpen.value = false;
  await fetchDiscounts();
};

const editedDiscount = async () => {
  isEditModalOpen.value = false;
  await fetchDiscounts();
};

const fetchDiscounts = async () => {
  try {
    isTableLoading.value = true;

    const res = await fetch(`${apiBase}/discounts`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch discounts");

    const data = await res.json();

    discounts.value = data.data.discounts.map((discount) => ({
      discount_id: discount.discount_id,
      discountName: discount.discount_name,
      discountCode: discount.discount_code,
      discountValue: discount.discount_value,
      discountType: discount.discount_type,
      status: discount.status,
      effectiveDate: discount.effective_date
        ? new Date(discount.effective_date).toLocaleDateString()
        : "-",
      endDate: discount.end_date
        ? new Date(discount.end_date).toLocaleDateString()
        : "-",

      updatedAt: new Date(discount.updated_at).toLocaleDateString(),
    }));
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    isTableLoading.value = false;
  }
};

onMounted(fetchDiscounts);
</script>

<template>
  <!-- TABLE -->
  <div class="border border-gray-300 bg-white rounded-lg">
    <div class="px-4 py-3 border-b border-gray-200 gap-3 flex flex-col">
      <div class="flex justify-between">
        <h2 class="text-lg font-medium text-gray-900">List of Discounts</h2>
        <button
          @click="isCreateModalOpen = true"
          type="button"
          class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          Create
        </button>
      </div>
      <!-- Search -->
      <div class="relative">
        <Search
          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
        />
        <input
          v-model="search"
          @input="currentPage = 1"
          type="text"
          placeholder="Search"
          class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
    <div class="p-4">
      <table class="min-w-full table-fixed divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="w-16 px-6 py-3 text-left text-xs text-gray-500">#</th>

            <th class="w-64 px-6 py-3 text-left text-xs text-gray-500">
              Discount Name
            </th>

            <th class="w-64 px-6 py-3 text-left text-xs text-gray-500">
              Discount Code
            </th>

            <th class="w-64 px-6 py-3 text-left text-xs text-gray-500">
              Discount Value
            </th>

            <th class="w-64 px-6 py-3 text-left text-xs text-gray-500">
              Effective Date
            </th>

            <th class="w-64 px-6 py-3 text-left text-xs text-gray-500">
              End Date
            </th>
            <th class="w-40 px-6 py-3 text-left text-xs text-gray-500">
              Updated
            </th>
            <th class="w-40 px-6 py-3 text-left text-xs text-gray-500">User</th>
            <th class="w-40 px-6 py-3 text-left text-xs text-gray-500">
              Action
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- Loading -->
          <tr v-if="isTableLoading">
            <td colspan="6" class="text-center py-6 text-gray-500">
              Loading discounts...
            </td>
          </tr>
          <!-- Data -->
          <tr
            v-else-if="discounts.length > 0"
            v-for="(discount, index) in discounts"
            :key="discount.discount_id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 text-sm">
              {{ index + 1 }}
            </td>
            <td class="px-6 py-4 text-sm">
              {{ discount.discountName }}
            </td>
            <td class="px-6 py-4 text-sm">
              {{ discount.discountCode }}
            </td>
            <td class="px-6 py-4 text-sm">
              {{
                discount.discountType === "percentage"
                  ? discount.discountValue + " %"
                  : "₱ " + discount.discountValue
              }}
            </td>
            <td class="px-6 py-4 text-sm">
              {{ discount.effectiveDate }}
            </td>
            <td class="px-6 py-4 text-sm">
              {{ discount.endDate }}
            </td>
            <td class="px-6 py-4 text-sm">
              {{ discount.updatedAt }}
            </td>
            <td class="px-6 py-4 text-sm">-</td>
            <td class="px-6 py-4 text-sm flex items-start gap-1">
              <button
                @click="openEditDiscount(discount)"
                class="font-medium text-blue-600 hover:text-blue-900 flex items-center"
              >
                <Edit class="w-4 h-4 mr-1" />
              </button>
            </td>
          </tr>
          <!-- Empty -->
          <tr v-else>
            <td colspan="6" class="text-center py-6 text-gray-500">
              No discounts found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <transition name="modal-fade">
    <ModalCreateDiscount
      v-if="isCreateModalOpen"
      @close="isCreateModalOpen = false"
      @save="createdDiscount"
    />
  </transition>
  <transition name="modal-fade">
    <ModalEditDiscount
      v-if="isEditModalOpen"
      :discount="selectedDiscount"
      @close="isEditModalOpen = false"
      @save="editedDiscount"
    />
  </transition>
</template>
