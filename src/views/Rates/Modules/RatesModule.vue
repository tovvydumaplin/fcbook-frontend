<script setup>
import { ref, computed, onMounted } from "vue";
import { Search } from "lucide-vue-next";
import ModalCreateAddOn from "../../../components/Modals/AddOn/ModalCreateAddOn.vue";
import AccommodationRateComponent from "../Components/AccommodationRatesComponent.vue";
import VehicleRatesComponent from "../Components/VehicleRatesComponent.vue";

const emit = defineEmits(["edit", "saved"]);

const apiBase = import.meta.env.VITE_API_URL;

const tabs = [
  { id: "accommodation", name: "Accommodations" },
  { id: "vehicle", name: "Vehicles" },
];

const activeTab = ref("accommodation");
const isModalOpen = ref(false);
const routes = ref([]);
const selectedRoute = ref(null);
const searchQuery = ref("");
const isTableLoading = ref(false);
const isRateLoading = ref(false);

const filteredRoutes = computed(() => {
  if (!searchQuery.value) return routes.value;
  const q = searchQuery.value.toLowerCase();
  return routes.value.filter((r) => r.route_name.toLowerCase().includes(q));
});

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

const handleAddOnSaved = async () => {
  isModalOpen.value = false;
  if (selectedRoute.value) {
    await fetchRouteAccRates(selectedRoute.value);
  }
};

onMounted(async () => {
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
                  @click="selectedRoute = route"
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
          <!-- <button
            @click="openCreateModal"
            class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus class="w-4 h-4" />
            Create
          </button> -->
        </div>
        <div
          class="border border-gray-300 mb-2 rounded-lg bg-gray-200 inline-block"
        >
          <nav class="flex space-x-4 p-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'p-2 font-medium text-sm rounded-md',
                activeTab === tab.id
                  ? 'bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-bold',
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>
        <AccommodationRateComponent
          v-if="activeTab === 'accommodation'"
          :selectedRoute="selectedRoute"
          :isRateLoading="isRateLoading"
        />
        <VehicleRatesComponent
          v-if="activeTab === 'vehicle'"
          :selectedRoute="selectedRoute"
          :isRateLoading="isRateLoading"
        />
      </div>
    </div>
  </div>

  <transition name="modal-fade">
    <ModalCreateAddOn
      v-if="isModalOpen"
      @close="isModalOpen = false"
      @saved="handleAddOnSaved"
    />
  </transition>
</template>
