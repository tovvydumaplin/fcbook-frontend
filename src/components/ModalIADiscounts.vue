<script setup>
import { Edit, Plus, Trash2 } from "lucide-vue-next";
import { onMounted, ref, watch, computed } from "vue";
const emit = defineEmits(["close", "save"]);
const apiBase = import.meta.env.VITE_API_URL;
const isTableLoading = ref(false);
const isLoading = ref(false);
const errorMsg = ref("");
const IADiscounts = ref([]);
const routes = ref([]);
const isRouteDropdownOpen = ref(false);
const selectedRoutes = ref([]);
const allRoutes = ref(true);

const props = defineProps({
  ia: {
    type: Object,
    required: true,
  },
});

const toggleRouteDropdown = () => {
  isRouteDropdownOpen.value = !isRouteDropdownOpen.value;
};

const isRouteSelected = (routeId) => {
  return selectedRoutes.value.includes(routeId);
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

const filteredRoutes = computed(() => {
  if (allRoutes.value) return routes.value;
  return routes.value.filter((route) =>
    selectedRoutes.value.includes(route.route_id),
  );
});

const fetchIADiscounts = async () => {
  try {
    isTableLoading.value = true;
    const res = await fetch(
      `${apiBase}/institutional-accounts/discounts/${props.ia.iaId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!res.ok) throw new Error("Failed to fetch IA Discounts");

    const data = await res.json();
    IADiscounts.value = data.data.iaDiscounts.map((iad) => ({
      iaDiscountId: iad.ia_discount_id,
      discountName: iad.discount_name,
      discountValue: iad.discount_value,
      discountType: iad.discount_type,
      iadRoutePortA: iad.route.port_a.port_name,
      iadRoutePortB: iad.route.port_b.port_name,
      status: iad.status,
      effectiveDate: iad.effective_date
        ? new Date(iad.effective_date).toLocaleDateString()
        : null,
      updatedAt: iad.updated_at
        ? new Date(iad.updated_at).toLocaleDateString()
        : null,

      routeName: `${iad.route.port_a.port_name} → ${iad.route.port_b.port_name}`,
    }));
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
  await fetchIADiscounts();
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
      class="modal-card bg-white rounded-lg shadow-xl w-full max-w-8xl mx-4"
      @click.stop
    >
      <!-- HEADER -->
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200"
      >
        <div>
          <h2 class="text-lg font-semibold text-gray-900">
            {{ props.ia.iaName }} Discounts
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
            <div class="relative w-72">
              <button
                @click="toggleRouteDropdown"
                type="button"
                class="border border-gray-300 rounded-md px-3 py-2 w-full shadow-sm text-center"
              >
                {{ routeLabel }}
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
            @click="openCreateIA"
            type="button"
            class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
          >
            <Plus class="w-4 h-4" />
            Create
          </button>
        </div>
        <form @submit.prevent="saveIADiscount" class="flex flex-col gap-6">
          <!-- IA DISCOUNTS LIST TABLE -->
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
              <span class="font-semibold text-blue-700 text-base"
                >Loading Discounts...</span
              >
            </div>
          </div>
          <div v-else class="w-full overflow-auto min-h-[40vh] max-h-[40vh]">
            <table class="min-w-full border-separate border-spacing-0">
              <thead class="sticky top-0 bg-gray-100 text-sm text-gray-600">
                <tr>
                  <th
                    class="px-6 py-4 text-left border-l border-t border-b border-gray-300 rounded-tl-md rounded-bl-md"
                  >
                    #
                  </th>
                  <th
                    class="px-6 py-4 text-left border-t border-b border-gray-300"
                  >
                    Route
                  </th>

                  <th
                    class="px-6 py-4 text-left border-t border-b border-gray-300"
                  >
                    Discount Name
                  </th>
                  <th
                    class="px-6 py-4 text-left border-t border-b border-gray-300"
                  >
                    Discount Value
                  </th>
                  <th
                    class="px-6 py-4 text-left border-t border-b border-gray-300"
                  >
                    Status
                  </th>
                  <th
                    class="px-6 py-4 text-left border-t border-b border-gray-300"
                  >
                    Effective Date
                  </th>
                  <th
                    class="px-6 py-4 text-left border-t border-b border-gray-300"
                  >
                    Updated
                  </th>

                  <th
                    class="px-6 py-4 text-left border-t border-b border-r border-gray-300 rounded-tr-md rounded-br-md"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="text-gray-900">
                <tr
                  v-for="(iad, index) in IADiscounts"
                  :key="iad.iaDiscountId"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 text-sm">{{ index + 1 }}</td>
                  <td class="px-6 py-4 text-sm">
                    {{ iad.iadRoutePortA }} → {{ iad.iadRoutePortB }}
                  </td>
                  <td class="px-6 py-4 text-sm">{{ iad.discountName }}</td>
                  <td class="px-6 py-4 text-sm">
                    {{
                      iad.discountType === "percentage"
                        ? iad.discountValue + " %"
                        : "₱ " + iad.discountValue
                    }}
                  </td>
                  <td class="px-6 py-4 text-sm">{{ iad.status }}</td>
                  <td class="px-6 py-4 text-sm">{{ iad.effectiveDate }}</td>
                  <td class="px-6 py-4 text-sm">{{ iad.updatedAt }}</td>

                  <td class="px-6 py-4 text-sm">
                    <div class="flex gap-2">
                      <button class="text-blue-600 hover:text-blue-900">
                        <Edit class="w-4 h-4" />
                      </button>

                      <button class="text-red-600 hover:text-red-900">
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
