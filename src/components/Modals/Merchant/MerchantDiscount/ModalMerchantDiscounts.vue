<script setup>
import { ChevronDown, Edit, Plus, Trash2 } from "lucide-vue-next";
import { onMounted, ref, watch, computed } from "vue";
import Swal from "sweetalert2";
import ModalCreateMerchantDiscount from "./ModalCreateMerchantDiscount.vue";
import ModalEditMerchantDiscount from "./ModalEditMerchantDiscount.vue";

const emit = defineEmits(["close", "save"]);
const apiBase = import.meta.env.VITE_API_URL;
const isTableLoading = ref(false);
const isLoading = ref(false);
const errorMsg = ref("");
const merchantDiscounts = ref([]);
const routes = ref([]);
const isRouteDropdownOpen = ref(false);
const selectedRoutes = ref([]);
const allRoutes = ref(true);
const isCreateMerchantDiscountModalOpen = ref(false);
const isEditMerchantDiscountModalOpen = ref(false);
const selectedMerchantDiscount = ref({});

const status = {
  0: { label: "Pending", class: "text-yellow-600 bg-yellow-100" },
  1: { label: "Active", class: "text-green-600 bg-green-100" },
  2: { label: "Inactive", class: "text-gray-600 bg-gray-100" },
  3: { label: "Cancelled", class: "text-red-600 bg-red-100" },
};

const props = defineProps({
  merchant: {
    type: Object,
    required: true,
  },
});

const openEditMerchantDiscountModal = (merchantDiscount) => {
  selectedMerchantDiscount.value = merchantDiscount;
  isEditMerchantDiscountModalOpen.value = true;
};

const toggleRouteDropdown = () => {
  isRouteDropdownOpen.value = !isRouteDropdownOpen.value;
};

const toggleAllRoutes = () => {
  if (allRoutes.value) {
    selectedRoutes.value = routes.value.map((r) => r.route_id);
  } else {
    selectedRoutes.value = [];
  }
};

const routeLabel = computed(() => {
  if (allRoutes.value) return "All Routes";
  if (selectedRoutes.value.length === 0) return "No Routes Selected";
  return `${selectedRoutes.value.length} Routes Selected`;
});

const filteredMerchantDiscounts = computed(() => {
  if (allRoutes.value) return merchantDiscounts.value;

  return merchantDiscounts.value.filter((merchantDiscount) =>
    selectedRoutes.value.includes(merchantDiscount.routeId),
  );
});

const createdMerchantDiscount = async () => {
  isCreateMerchantDiscountModalOpen.value = false;
  await Swal.fire({
    icon: "success",
    title: "Success!",
    text: `Discount has been created.`,
    timer: 2000,
    showConfirmButton: false,
  });

  await fetchMerchantDiscounts();
};

const updatedMerchantDiscount = async () => {
  isEditMerchantDiscountModalOpen.value = false;
  await Swal.fire({
    icon: "success",
    title: "Success!",
    text: `Discount has been updated.`,
    timer: 2000,
    showConfirmButton: false,
  });

  await fetchMerchantDiscounts();
};

const deleteMerchantDiscount = async (merchantDiscount) => {
  errorMsg.value = "";

  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to delete this discount?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });

  if (!confirm.isConfirmed) return;

  isLoading.value = true;

  try {
    const response = await fetch(
      `${apiBase}/merchants/${merchantDiscount.merchantDiscountId}/discounts`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to delete merchant discount",
      );
    }
  } catch (err) {
    console.error(err);
    errorMsg.value = "Failed to delete merchant discount.";
  } finally {
    isLoading.value = false;
    await Swal.fire({
      icon: "success",
      title: "Success!",
      text: `Discount has been deleted.`,
      timer: 2000,
      showConfirmButton: false,
    });

    await fetchMerchantDiscounts();
  }
};

const fetchMerchantDiscounts = async () => {
  try {
    isTableLoading.value = true;
    const res = await fetch(
      `${apiBase}/merchants/${props.merchant.merchantId}/discounts`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!res.ok) throw new Error("Failed to fetch Merchant Discounts");

    const data = await res.json();

    merchantDiscounts.value = data.data.merchantDiscounts.map(
      (merchantDiscount) => ({
        merchantDiscountId: merchantDiscount.merchant_discount_id,
        routeId: merchantDiscount.route_id,
        discountName: merchantDiscount.discount_name,
        discountValue: merchantDiscount.discount_value,
        discountType: merchantDiscount.discount_type,
        merchantDiscountRoutePortA: merchantDiscount.route.port_a.port_name,
        merchantDiscountRoutePortB: merchantDiscount.route.port_b.port_name,
        status: merchantDiscount.status,
        effectiveDate: merchantDiscount.effective_date
          ? new Date(merchantDiscount.effective_date).toLocaleDateString()
          : "-",
        updatedAt: merchantDiscount.updated_at
          ? new Date(merchantDiscount.updated_at).toLocaleDateString()
          : "-",
      }),
    );
  } catch (err) {
    console.error(err);
  } finally {
    isTableLoading.value = false;
  }
};

const fetchRoutes = async () => {
  try {
    const res = await fetch(`${apiBase}/routes`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch routes");

    const data = await res.json();
    routes.value = data.data.routes ?? data.routes;
  } catch (err) {
    console.error(err);
  }
};

watch(routes, (newRoutes) => {
  if (newRoutes.length) {
    selectedRoutes.value = newRoutes.map((r) => r.route_id);
    allRoutes.value = true;
  }
});

watch(selectedRoutes, (newSelected) => {
  allRoutes.value = newSelected.length === routes.value.length;
});

onMounted(async () => {
  await fetchMerchantDiscounts();
  await fetchRoutes();
});
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
      class="modal-card bg-white rounded-lg shadow-xl w-full max-w-7xl mx-4"
      @click.stop
    >
      <!-- HEADER -->
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200"
      >
        <div>
          <h2 class="text-lg font-semibold text-gray-900">
            {{ props.merchant.merchantName }} Discounts
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
      <!-- CONTENT -->
      <div class="p-6 gap-6 flex flex-col">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center justify-center gap-2">
            <div class="relative w-60 text-xs">
              <button
                @click="toggleRouteDropdown"
                type="button"
                class="border text-sm border-gray-300 rounded-md px-3 py-2 w-full shadow-sm text-center"
              >
                <div class="flex items-center justify-between gap-2">
                  {{ routeLabel }}

                  <ChevronDown
                    :class="[
                      'w-4 h-4 transition-transform duration-300',
                      isRouteDropdownOpen ? 'rotate-180' : '',
                    ]"
                  />
                </div>
              </button>
              <div
                v-if="isRouteDropdownOpen"
                class="absolute mt-2 w-full bg-white border-gray-300 border rounded-md shadow-sm max-h-60 overflow-y-auto z-50"
              >
                <!-- ALL ROUTES -->
                <label
                  class="flex items-center gap-2 px-3 py-2 font-medium hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    v-model="allRoutes"
                    @change="toggleAllRoutes"
                  />
                  All Routes
                </label>

                <!-- ROUTES -->
                <label
                  v-for="route in routes"
                  :key="route.route_id"
                  class="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :value="route.route_id"
                    v-model="selectedRoutes"
                  />
                  {{ route.port_a.port_name }} → {{ route.port_b.port_name }}
                </label>
              </div>
            </div>
          </div>
          <button
            @click="isCreateMerchantDiscountModalOpen = true"
            type="button"
            class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
          >
            <Plus class="w-4 h-4" />
            Create
          </button>
        </div>
        <form @submit.prevent="saveIADiscount" class="flex flex-col gap-6">
          <!-- MERCHANT DISCOUNTS LIST TABLE -->
          <div
            v-if="isTableLoading"
            class="flex justify-center items-center py-8 min-h-[50vh]"
          >
            <div
              class="flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg"
            >
              <span
                class="inline-block w-6 h-6 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
              ></span>
              <span class="font-semibold text-blue-700 text-base"
                >Loading Discounts...</span
              >
            </div>
          </div>
          <div v-else class="w-full overflow-auto min-h-[50vh] max-h-[50vh]">
            <table class="table-fixed w-full border-separate border-spacing-0">
              <thead class="sticky top-0 bg-gray-100 text-sm text-gray-600">
                <tr>
                  <th
                    class="w-10 px-6 py-4 text-left border-l border-t border-b border-gray-300 rounded-tl-md rounded-bl-md"
                  >
                    #
                  </th>
                  <th
                    class="w-64 px-6 py-4 text-left border-t border-b border-gray-300"
                  >
                    Route
                  </th>

                  <th
                    class="w-48 px-6 py-4 text-left border-t border-b border-gray-300"
                  >
                    Discount Name
                  </th>
                  <th
                    class="w-35 px-6 py-4 text-left border-t border-b border-gray-300"
                  >
                    Discount Value
                  </th>
                  <th
                    class="w-20 px-6 py-4 text-left border-t border-b border-gray-300"
                  >
                    Status
                  </th>
                  <th
                    class="w-32 px-6 py-4 text-left border-t border-b border-gray-300"
                  >
                    Effective Date
                  </th>
                  <th
                    class="w-25 px-6 py-4 text-left border-t border-b border-gray-300"
                  >
                    Updated
                  </th>

                  <th
                    class="w-32 px-6 py-4 text-left border-t border-b border-r border-gray-300 rounded-tr-md rounded-br-md"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="text-gray-900">
                <tr
                  v-for="(merchantDiscount, index) in filteredMerchantDiscounts"
                  :key="merchantDiscount.merchantDiscountId"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 text-sm">{{ index + 1 }}</td>
                  <td class="px-6 py-4 text-sm">
                    {{ merchantDiscount.merchantDiscountRoutePortA }} →
                    {{ merchantDiscount.merchantDiscountRoutePortB }}
                  </td>
                  <td class="px-6 py-4 text-sm">
                    {{ merchantDiscount.discountName }}
                  </td>
                  <td class="px-6 py-4 text-sm">
                    {{
                      merchantDiscount.discountType === "percentage"
                        ? merchantDiscount.discountValue + " %"
                        : "₱ " + merchantDiscount.discountValue
                    }}
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span
                      :class="[
                        'px-2 py-1 rounded text-sm font-medium',
                        status[merchantDiscount.status].class,
                      ]"
                    >
                      {{ status[merchantDiscount.status].label }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm">
                    {{ merchantDiscount.effectiveDate }}
                  </td>
                  <td class="px-6 py-4 text-sm">
                    {{ merchantDiscount.updatedAt }}
                  </td>

                  <td class="px-6 py-4 text-sm">
                    <div class="flex gap-2">
                      <button
                        @click="openEditMerchantDiscountModal(merchantDiscount)"
                        class="text-blue-600 hover:text-blue-900"
                      >
                        <Edit class="w-4 h-4" />
                      </button>

                      <button
                        @click="deleteMerchantDiscount(merchantDiscount)"
                        class="text-red-600 hover:text-red-900"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- MODAL MERCHANT DISCOUNTS -->
          <transition name="modal-fade">
            <ModalCreateMerchantDiscount
              v-if="isCreateMerchantDiscountModalOpen"
              :routes="routes"
              :merchant-id="props.merchant.merchantId"
              @save="createdMerchantDiscount"
              @close="isCreateMerchantDiscountModalOpen = false"
            />
          </transition>
          <transition name="modal-fade">
            <ModalEditMerchantDiscount
              v-if="isEditMerchantDiscountModalOpen"
              :merchant-discount="selectedMerchantDiscount"
              @save="updatedMerchantDiscount"
              @close="isEditMerchantDiscountModalOpen = false"
            />
          </transition>
        </form>
      </div>
    </div>
  </div>
</template>
