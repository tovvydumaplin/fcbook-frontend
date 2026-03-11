<script setup>
import { Edit } from "lucide-vue-next";
import { ref, watch } from "vue";
import ModalEditAccommodationRate from "../../../components/Modals/Passenger/PassengerAccommodation/AccommodationRate/ModalEditAccommodationRate.vue";

const apiBase = import.meta.env.VITE_API_URL;

const selectedAccommodationRate = ref(null);
const accommodations = ref([]);
const isRateLoading = ref(false);
const isRateModalOpen = ref(false);
const emit = defineEmits(["edit", "saved"]);
const props = defineProps({
  selectedRoute: Object,
  isRateLoading: Boolean,
});

const openRateModal = (acc) => {
  selectedAccommodationRate.value = acc;
  isRateModalOpen.value = true;
};

const handleAccRateSaved = async () => {
  console.log("saved");
};

const fetchRouteAccRates = async (routeId) => {
  try {
    isRateLoading.value = true;

    const res = await fetch(`${apiBase}/accommodation-rates/route/${routeId}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch accommodation rates");

    const data = await res.json();

    accommodations.value = data.data.accRates.map((acc) => ({
      accommodationRateId: acc.acc_rate_id,
      accommodationName: acc.accommodation?.accommodation_name,
      baseRate: acc.base_rate,
      withoutAC: acc.without_ac,
      status: acc.status,
      updatedAt: acc.updated_at
        ? new Date(acc.updated_at).toLocaleDateString()
        : null,
    }));
  } catch (err) {
    console.error(err);
  } finally {
    isRateLoading.value = false;
  }
};

watch(
  () => props.selectedRoute,
  (newRoute) => {
    if (newRoute) {
      fetchRouteAccRates(newRoute.id);
    } else {
      accommodations.value = [];
    }
  },
  { immediate: true },
);
</script>

<template>
  <!-- LOADING -->
  <div v-if="isRateLoading" class="flex justify-center items-center py-10">
    <div
      class="flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg"
    >
      <span
        class="w-6 h-6 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
      ></span>
      <span class="font-semibold text-blue-700 text-base"
        >Loading Accommodation Rates...</span
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
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">
            #
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">
            Type name
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">
            Base Rate
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">
            W/O AC
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">
            Updated
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">
            User
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">
            Status
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="(acc, index) in accommodations"
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
  <transition name="modal-fade">
    <ModalEditAccommodationRate
      v-if="isRateModalOpen"
      :accommodationRate="selectedAccommodationRate"
      :route="selectedRoute"
      @close="isRateModalOpen = false"
      @saved="handleAccRateSaved"
    />
  </transition>
</template>
