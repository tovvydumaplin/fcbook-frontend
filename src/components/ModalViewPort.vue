<!-- filepath: d:\Fastcat Book 2\fcbook-frontend\src\components\ModalViewPort.vue -->
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-7xl p-10 relative">
      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
      >
        <span class="sr-only">Close</span>
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

      <!-- Port Header -->
      <div class="mb-2 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
            {{ port.name }}
            <a
              href="#"
              class="text-blue-600 text-sm font-medium hover:underline ml-2"
              >Edit Port</a
            >
          </h2>
          <div class="text-gray-500 text-sm">{{ port.corridor }}</div>
        </div>
      </div>

      <!-- Tabs and Filters -->
      <div class="mb-6 flex items-center gap-4">
        <div
          class="flex flex-wrap items-center gap-2 p-2 bg-gray-100 rounded-lg border-1 border-gray-300"
        >
          <button
            :class="[
              'px-3 py-1 rounded text-sm font-medium',
              filterType === 'selfbook'
                ? 'bg-white text-gray-900'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            ]"
            @click="filterType = 'selfbook'"
          >
            Self book
          </button>
          <button
            :class="[
              'px-3 py-1 rounded text-sm font-medium',
              filterType === 'teller'
                ? 'bg-white text-gray-900'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            ]"
            @click="filterType = 'teller'"
          >
            Teller
          </button>
          <button
            :class="[
              'px-3 py-1 rounded text-sm font-medium',
              filterType === 'institutional'
                ? 'bg-white text-gray-900'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            ]"
            @click="filterType = 'institutional'"
          >
            Institutional Accounts
          </button>
        </div>
        <div class="border-1 p-2 border-gray-300 bg-white rounded-lg">
          <input
            type="date"
            v-model="dateFrom"
            class="border-0 rounded px-2 py-1 text-sm"
          />
          <span class="text-gray-400">-</span>
          <input
            type="date"
            v-model="dateTo"
            class="border-0 rounded px-2 py-1 text-sm"
          />
        </div>
        <button class="ml-2 text-gray-500 hover:text-blue-600">
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V10z"
            />
          </svg>
        </button>
      </div>

      <div class="flex gap-8">
        <!-- Main Table -->
        <div class="flex-1 min-w-0 border-gray-200 border rounded-lg">
          <div
            class="mb-6 pb-4 flex items-center justify-between border-b border-gray-200 p-4"
          >
            <div class="font-semibold text-gray-900">List of Passengers</div>
            <div class="flex items-center gap-2">
              <select class="border rounded px-2 py-1 text-sm">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span class="text-gray-500 text-sm">entries per page</span>
              <input
                v-model="search"
                type="text"
                placeholder="Search"
                class="ml-2 px-3 py-1 border rounded text-sm"
              />
            </div>
          </div>
          <div class="overflow-x-auto p-4">
            <table class="min-w-full text-sm">
              <thead class="">
                <tr class="bg-gray-50">
                  <th
                    class="px-4 py-4 text-left font-medium text-gray-500 rounded-tl-lg rounded-bl-lg"
                  >
                    #
                  </th>
                  <th class="px-4 py-4 text-left font-medium text-gray-500">
                    Fullname
                  </th>
                  <th class="px-4 py-4 text-left font-medium text-gray-500">
                    Booking No.
                  </th>
                  <th class="px-4 py-4 text-left font-medium text-gray-500">
                    Departure Date
                  </th>
                  <th class="px-4 py-4 text-left font-medium text-gray-500">
                    Transaction Date
                  </th>
                  <th class="px-4 py-4 text-left font-medium text-gray-500">
                    Status
                  </th>
                  <th
                    class="px-4 py-4 text-left font-medium text-gray-500 rounded-tr-lg rounded-br-lg"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(passenger, idx) in filteredPassengers"
                  :key="passenger.id"
                >
                  <td class="px-4 py-4">{{ idx + 1 }}</td>
                  <td class="px-4 py-4">{{ passenger.fullname }}</td>
                  <td class="px-4 py-4">{{ passenger.bookingNo }}</td>
                  <td class="px-4 py-4">{{ passenger.departureDate }}</td>
                  <td class="px-4 py-4">{{ passenger.transactionDate }}</td>
                  <td class="px-4 py-4">
                    <span
                      v-if="passenger.status === 'Paid'"
                      class="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold"
                      >Paid</span
                    >
                    <span
                      v-else-if="passenger.status === 'Cancelled'"
                      class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold"
                      >Cancelled</span
                    >
                    <span
                      v-else
                      class="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold"
                      >Open</span
                    >
                  </td>
                  <td class="px-4 py-2">
                    <a
                      href="#"
                      class="text-blue-600 font-medium hover:underline"
                      >Open</a
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Side Info -->
        <div class="w-96 flex flex-col gap-4">
          <div class="border rounded-lg p-4 border-gray-300">
            <div class="font-semibold text-gray-900 mb-1">
              Port Availability
            </div>
            <div class="text-sm">
              Booking is
              <span class="text-red-600 font-semibold"
                >currently unavailable</span
              >
              because one or more required statuses are not activated.
            </div>
          </div>
          <div class="border rounded-lg flex flex-col gap-3 border-gray-300">
            <div>
              <div
                class="font-semibold text-gray-900 mb-1 border-b border-gray-300 p-4"
              >
                Ramp Status
              </div>
              <div class="text-sm pt-4 text-gray-600 px-4">
                <p>This port has a working ramp</p>
              </div>
            </div>
            <div class="flex gap-2 pb-4 px-4 items-center">
              <div class="relative inline-block w-11 h-5">
                <input
                  id="switch-ramp-status"
                  type="checkbox"
                  class="peer appearance-none w-11 h-5 bg-slate-300 rounded-full checked:bg-green-600 cursor-pointer transition-colors duration-300"
                  v-model="rampStatus"
                  :disabled="isLoading"
                />
                <label
                  for="switch-ramp-status"
                  class="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-green-600 cursor-pointer"
                ></label>
              </div>
              <span class="text-sm">{{
                rampStatus ? "Activated" : "Deactivated"
              }}</span>
            </div>
          </div>
          <div class="border rounded-lg flex gap-3 flex-col border-gray-300">
            <div>
              <div
                class="font-semibold text-gray-900 mb-1 border-b border-gray-300 p-4"
              >
                Port Status
              </div>
              <div class="text-sm pt-4 text-gray-600 px-4">
                This port will be unavailable for booking
              </div>
            </div>
            <div class="flex gap-2 pb-4 px-4 items-center">
              <div class="relative inline-block w-11 h-5">
                <input
                  id="switch-port-status"
                  type="checkbox"
                  class="peer appearance-none w-11 h-5 bg-slate-300 rounded-full checked:bg-green-600 cursor-pointer transition-colors duration-300"
                  v-model="portStatus"
                  :disabled="isLoading"
                />
                <label
                  for="switch-port-status"
                  class="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-green-600 cursor-pointer"
                ></label>
              </div>
              <span class="text-sm">{{
                portStatus ? "Activated" : "Deactivated"
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  port: Object,
  passengers: Array,
});

const filterType = ref("selfbook");
const search = ref("");
const dateFrom = ref("");
const dateTo = ref("");
const isLoading = ref(false);

// Switch states for ramp and port status
const rampStatus = ref(true);
const portStatus = ref(false);

// Example: filter by type, search, and date range
const filteredPassengers = computed(() => {
  let list = props.passengers || [];
  // Filter by type (assuming each passenger has a 'type' field)
  if (filterType.value === "selfbook") {
    list = list.filter((p) => !p.type || p.type === "selfbook");
  } else if (filterType.value === "teller") {
    list = list.filter((p) => p.type === "teller");
  } else if (filterType.value === "institutional") {
    list = list.filter((p) => p.type === "institutional");
  }
  // Filter by search
  if (search.value) {
    const q = search.value.toLowerCase();
    list = list.filter(
      (p) =>
        p.fullname.toLowerCase().includes(q) ||
        p.bookingNo.toLowerCase().includes(q)
    );
  }
  // Filter by date range (departureDate)
  if (dateFrom.value) {
    list = list.filter((p) => p.departureDate >= dateFrom.value);
  }
  if (dateTo.value) {
    list = list.filter((p) => p.departureDate <= dateTo.value);
  }
  return list;
});
</script>
