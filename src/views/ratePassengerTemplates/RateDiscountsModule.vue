<script setup>
import { ref, computed, onMounted } from "vue";
import { Plus, Search, Edit } from "lucide-vue-next";

import ModalAddEditRate from "../../components/ModalAddEditRate.vue";
import ModalCreateAddOn from "../../components/ModalCreateAddOn.vue";

const apiBase = import.meta.env.VITE_API_URL;

const isModalOpen = ref(false);
const routes = ref([]);
const accommodations = ref([]);
const selectedRoute = ref(null);
const selectedAccommodationRate = ref(null);

const searchQuery = ref("");
const isTableLoading = ref(false);
const isRateLoading = ref(false);
const isRateModalOpen = ref(false);

const filteredRoutes = computed(() => {
  if (!searchQuery.value) return routes.value;
  const q = searchQuery.value.toLowerCase();
  return routes.value.filter((r) => r.route_name.toLowerCase().includes(q));
});

const fetchPassengerAccommodations = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${apiBase}/passenger-accommodations`, {
    headers: { Authorization: token },
  });
  const data = await res.json();
  accommodations.value = data.data || [];
};

const fetchRoutes = async () => {
  isTableLoading.value = true;
  const token = localStorage.getItem("token");
  const res = await fetch(`${apiBase}/routes`, {
    headers: { Authorization: token },
  });
  const data = await res.json();

  routes.value = data.data.routes.map((r) => ({
    id: r.route_id,
    route_name: `${r.port_a.port_name} - ${r.port_b.port_name}`,
  }));
  isTableLoading.value = false;
};

const fetchRouteAccRates = async (route) => {
  try {
    isRateLoading.value = true;
    selectedRoute.value = route;

    const res = await fetch(
      `${apiBase}/accommodation-rates/route/${route.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!res.ok) throw new Error("Failed to fetch accommodation rates");

    const data = await res.json();

    selectedRoute.value = {
      ...route,
      accommodations: data.data.accRates.map((acc) => ({
        accommodationRateId: acc.acc_rate_id,
        accommodationId: acc.accommodation?.accommodation_id,
        accommodationName: acc.accommodation?.accommodation_name,
        baseRate: acc.base_rate,
        withoutAC: acc.without_ac,
        status: acc.status,
        updatedAt: acc.updated_at
          ? new Date(acc.updated_at).toLocaleDateString()
          : null,
      })),
    };
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    isRateLoading.value = false;
  }
};
const openRateModal = (acc) => {
  selectedAccommodationRate.value = acc;
  isRateModalOpen.value = true;
};

const openCreateModal = () => {
  isModalOpen.value = true;
};

const handleAddOnSaved = async () => {
  closeModal();
  await fetchPassengerAccommodations();
  if (selectedRoute.value) {
    await fetchRouteAccRates(selectedRoute.value);
  }
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleAccRateSaved = async () => {
  isRateModalOpen.value = false;

  if (!selectedRoute.value) return;

  await fetchRouteAccRates(selectedRoute.value);
};

onMounted(async () => {
  await fetchPassengerAccommodations();
  await fetchRoutes();
});
</script>

<template>
  <div class="grid md:grid-cols-[380px_1fr] gap-6">
    <!-- LEFT ROUTE LIST -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">List of Route</h2>

        <div class="flex items-center mb-4">
          <div class="relative w-full">
            <Search
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search"
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
        </div>

        <!-- ROUTE TABLE -->
        <div>
          <div
            v-if="isTableLoading"
            class="flex justify-center items-center py-8"
          >
            <div
              class="flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg"
            >
              <span
                class="inline-block w-6 h-6 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
              ></span>
              <span class="font-semibold text-blue-700 text-base"
                >Loading routes...</span
              >
            </div>
          </div>

          <div v-else class="overflow-auto max-h-[400px]">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    #
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Route
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="route in filteredRoutes"
                  :key="route.id"
                  @click="fetchRouteAccRates(route)"
                  class="hover:bg-gray-50 cursor-pointer"
                  :class="{
                    'bg-blue-50':
                      selectedRoute && selectedRoute.id === route.id,
                  }"
                >
                  <td class="px-6 py-4 text-sm text-blue-600 font-bold">
                    {{ route.id }}
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span
                      :class="
                        selectedRoute && selectedRoute.id === route.id
                          ? 'text-blue-600 font-bold underline'
                          : 'text-gray-900'
                      "
                    >
                      {{ route.route_name }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT RATE DETAILS -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="p-6">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-lg font-medium text-gray-900">
            {{
              selectedRoute
                ? selectedRoute.route_name + " Rate"
                : "No Route Selected"
            }}
          </h2>
          <button
            @click="openCreateModal"
            class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus class="w-4 h-4" />
            Create
          </button>
        </div>

        <!-- LOADING -->
        <div
          v-if="isRateLoading"
          class="flex justify-center items-center py-10"
        >
          <div
            class="flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg"
          >
            <span
              class="w-6 h-6 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
            ></span>
            <span class="font-semibold text-blue-700 text-base"
              >Loading rate...</span
            >
          </div>
        </div>

        <!-- NO SELECTION -->
        <div v-else-if="!selectedRoute" class="text-gray-500 text-center py-10">
          Select a route to view details.
        </div>

        <!-- RATE TABLE -->
        <div v-else class="overflow-auto max-h-[400px]">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500"
                >
                  #
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500"
                >
                  Type name
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500"
                >
                  Base Rate
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500"
                >
                  W/O AC
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500"
                >
                  Updated
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500"
                >
                  User
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(acc, index) in selectedRoute.accommodations"
                :key="acc.accommodationRateId"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 text-sm">{{ index + 1 }}</td>
                <td class="px-6 py-4 text-sm">{{ acc.accommodationName }}</td>
                <td class="px-6 py-4 text-sm">
                  <span v-if="acc.baseRate === null">—</span>
                  <span v-else>₱{{ acc.baseRate }}</span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  <span v-if="acc.withoutAC === null">—</span>
                  <span v-else>₱{{ acc.withoutAC }}</span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  <span v-if="acc.updatedAt === null">—</span>
                  <span v-else>{{ acc.updatedAt }}</span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">—</td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  <span v-if="acc.status === null">—</span>
                  <span v-else>{{ acc.status }}</span>
                </td>
                <td class="px-6 py-4 text-sm">
                  <button
                    @click="openRateModal(acc)"
                    class="font-medium text-blue-600 hover:text-blue-900 flex items-center"
                  >
                    <Edit class="w-4 h-4 mr-1" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <transition name="modal-fade">
    <ModalAddEditRate
      v-if="isRateModalOpen"
      :accommodationRate="selectedAccommodationRate"
      :route="selectedRoute"
      @close="isRateModalOpen = false"
      @save="handleAccRateSaved"
    />
  </transition>
  <transition name="modal-fade">
    <ModalCreateAddOn
      v-if="isModalOpen"
      @close="closeModal"
      @saved="handleAddOnSaved"
    />
  </transition>
</template>
