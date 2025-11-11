<!-- filepath: d:\Fastcat Book 2\fcbook-frontend\src\components\ModalViewPort.vue -->
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl p-10 relative">
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
      <div class="flex flex-wrap items-center gap-2 mb-4">
        <button
          :class="[
            'px-3 py-1 rounded text-sm font-medium',
            filterType === 'selfbook'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-blue-100',
          ]"
          @click="filterType = 'selfbook'"
        >
          Self book
        </button>
        <button
          :class="[
            'px-3 py-1 rounded text-sm font-medium',
            filterType === 'teller'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-blue-100',
          ]"
          @click="filterType = 'teller'"
        >
          Teller
        </button>
        <button
          :class="[
            'px-3 py-1 rounded text-sm font-medium',
            filterType === 'institutional'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-blue-100',
          ]"
          @click="filterType = 'institutional'"
        >
          Institutional Accounts
        </button>
        <input
          type="date"
          v-model="dateFrom"
          class="border rounded px-2 py-1 text-sm"
        />
        <span class="text-gray-400">-</span>
        <input
          type="date"
          v-model="dateTo"
          class="border rounded px-2 py-1 text-sm"
        />
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
        <div class="flex-1 min-w-0">
          <div class="mb-2 flex items-center justify-between">
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
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="bg-gray-50">
                  <th class="px-4 py-2 text-left font-medium text-gray-500">
                    #
                  </th>
                  <th class="px-4 py-2 text-left font-medium text-gray-500">
                    Fullname
                  </th>
                  <th class="px-4 py-2 text-left font-medium text-gray-500">
                    Booking No.
                  </th>
                  <th class="px-4 py-2 text-left font-medium text-gray-500">
                    Departure Date
                  </th>
                  <th class="px-4 py-2 text-left font-medium text-gray-500">
                    Transaction Date
                  </th>
                  <th class="px-4 py-2 text-left font-medium text-gray-500">
                    Status
                  </th>
                  <th class="px-4 py-2 text-left font-medium text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(passenger, idx) in filteredPassengers"
                  :key="passenger.id"
                  class="border-b"
                >
                  <td class="px-4 py-2">{{ idx + 1 }}</td>
                  <td class="px-4 py-2">{{ passenger.fullname }}</td>
                  <td class="px-4 py-2">{{ passenger.bookingNo }}</td>
                  <td class="px-4 py-2">{{ passenger.departureDate }}</td>
                  <td class="px-4 py-2">{{ passenger.transactionDate }}</td>
                  <td class="px-4 py-2">
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
          <div class="border rounded-lg p-4">
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
          <div class="border rounded-lg p-4 flex items-center gap-3">
            <div>
              <div class="font-semibold text-gray-900 mb-1">Ramp Status</div>
              <div class="text-sm text-gray-600">
                This port has a working ramp
              </div>
            </div>
            <div class="ml-auto">
              <span class="inline-flex items-center">
                <span
                  class="w-10 h-6 flex items-center bg-green-200 rounded-full p-1"
                >
                  <span class="w-4 h-4 bg-green-500 rounded-full"></span>
                </span>
                <span class="ml-2 text-green-700 font-semibold text-sm"
                  >Activated</span
                >
              </span>
            </div>
          </div>
          <div class="border rounded-lg p-4 flex items-center gap-3">
            <div>
              <div class="font-semibold text-gray-900 mb-1">Port Status</div>
              <div class="text-sm text-gray-600">
                This port will be unavailable for booking
              </div>
            </div>
            <div class="ml-auto">
              <span class="inline-flex items-center">
                <span
                  class="w-10 h-6 flex items-center bg-gray-200 rounded-full p-1"
                >
                  <span class="w-4 h-4 bg-gray-400 rounded-full"></span>
                </span>
                <span class="ml-2 text-gray-700 font-semibold text-sm"
                  >Deactivated</span
                >
              </span>
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
