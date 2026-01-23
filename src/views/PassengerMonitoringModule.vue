<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-6">
      <nav class="text-sm text-gray-500 mb-2">
        <span>Dashboard</span> <span class="mx-2">></span>
        <span class="text-gray-900">Passenger Monitoring</span>
      </nav>
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">
          Passenger Monitoring
        </h1>
      </div>
    </div>
    <!-- TABS -->
    <div
      class="border border-gray-300 mb-4 rounded-lg bg-gray-200 inline-block"
    >
      <nav class="flex space-x-4 px-2 py-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'py-2 px-2 font-medium text-sm rounded-md',
            activeTab === tab.id
              ? 'bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-bold',
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>
    <!-- TABLE -->
    <div class="border border-gray-300 bg-white rounded-lg">
      <div
        class="px-4 py-3 border-b border-gray-200 flex justify-between items-center"
      >
        <h2 class="text-lg font-medium text-gray-900">List of Passengers</h2>

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
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs text-gray-500">
                Booking No.
              </th>
              <th class="px-6 py-3 text-left text-xs text-gray-500">
                Fullname
              </th>
              <th class="px-6 py-3 text-left text-xs text-gray-500">Gender</th>
              <th class="px-6 py-3 text-left text-xs text-gray-500">
                Psgr. Type
              </th>
              <th class="px-6 py-3 text-left text-xs text-gray-500">Route</th>
              <th class="px-6 py-3 text-left text-xs text-gray-500">
                Accommodation
              </th>
              <th class="px-6 py-3 text-left text-xs text-gray-500">
                Seat No.
              </th>
              <th class="px-6 py-3 text-left text-xs text-gray-500">
                Payment Method
              </th>
              <th class="px-6 py-3 text-left text-xs text-gray-500">Status</th>
              <th class="px-6 py-3 text-left text-xs text-gray-500">Action</th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Loading -->
            <tr v-if="loading">
              <td colspan="10" class="text-center py-6 text-gray-500">
                Loading passengers...
              </td>
            </tr>

            <!-- Data -->
            <tr v-for="p in passengers" :key="p.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm">{{ p.booking_no }}</td>
              <td class="px-6 py-4 text-sm">{{ p.fullname }}</td>
              <td class="px-6 py-4 text-sm">{{ p.gender }}</td>
              <td class="px-6 py-4 text-sm">{{ p.passenger_type }}</td>
              <td class="px-6 py-4 text-sm">{{ p.route }}</td>
              <td class="px-6 py-4 text-sm">{{ p.accommodation }}</td>
              <td class="px-6 py-4 text-sm">{{ p.seat_no || "-" }}</td>
              <td class="px-6 py-4 text-sm">{{ p.payment_method }}</td>
              <td class="px-6 py-4 text-sm">{{ p.status }}</td>
              <td class="px-6 py-4 text-sm">
                <button class="text-blue-600 hover:underline">View</button>
              </td>
            </tr>

            <!-- Empty -->
            <tr v-if="!loading && passengers.length === 0">
              <td colspan="10" class="text-center py-6 text-gray-500">
                No passengers found.
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="flex justify-between items-center mt-4 text-sm">
          <span> Page {{ currentPage }} of {{ totalPages }} </span>

          <div class="flex gap-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { Plus, BarChart3, AlertCircle, Search, Eye } from "lucide-vue-next";
const tabs = [
  { id: "walkin", name: "Walk-in" },
  { id: "selfbook", name: "Selfbook" },
];
/* STATE */
const passengers = ref([]);
const search = ref("");
const currentPage = ref(1);
const perPage = ref(8);
const totalPages = ref(1);
const loading = ref(false);

/* MOCK DATA (temporary) */
const mockPassengerResponse = {
  data: [
    {
      id: 1,
      booking_no: "BK-001",
      fullname: "Juan Dela Cruz",
      gender: "M",
      passenger_type: "Adult",
      route: "BAT-CAL", // Batangas → Calapan
      accommodation: "Economy",
      seat_no: "A12",
      payment_method: "GCash",
      status: "PAID",
    },
    {
      id: 2,
      booking_no: "BK-002",
      fullname: "Maria Santos",
      gender: "F",
      passenger_type: "Senior",
      route: "BAT-CAL",
      accommodation: "Economy",
      seat_no: null,
      payment_method: "Cash",
      status: "PENDING",
    },
    {
      id: 3,
      booking_no: "BK-003",
      fullname: "Pedro Ramirez",
      gender: "M",
      passenger_type: "Adult",
      route: "CEB-BOH", // Cebu → Bohol
      accommodation: "Tourist",
      seat_no: "B05",
      payment_method: "Credit Card",
      status: "PAID",
    },
    {
      id: 4,
      booking_no: "BK-004",
      fullname: "Ana Lopez",
      gender: "F",
      passenger_type: "Student",
      route: "CEB-BOH",
      accommodation: "Economy",
      seat_no: "C18",
      payment_method: "GCash",
      status: "PAID",
    },
    {
      id: 5,
      booking_no: "BK-005",
      fullname: "Roberto Cruz",
      gender: "M",
      passenger_type: "PWD",
      route: "ILO-BAC", // Iloilo → Bacolod
      accommodation: "Tourist",
      seat_no: null,
      payment_method: "Cash",
      status: "CANCELLED",
    },
    {
      id: 6,
      booking_no: "BK-006",
      fullname: "Liza Mendoza",
      gender: "F",
      passenger_type: "Adult",
      route: "ILO-BAC",
      accommodation: "Business",
      seat_no: "D02",
      payment_method: "Credit Card",
      status: "PAID",
    },
    {
      id: 7,
      booking_no: "BK-007",
      fullname: "Mark Villanueva",
      gender: "M",
      passenger_type: "Adult",
      route: "MNL-COR", // Manila → Coron
      accommodation: "Economy",
      seat_no: "E21",
      payment_method: "GCash",
      status: "PAID",
    },
    {
      id: 8,
      booking_no: "BK-008",
      fullname: "Sofia Reyes",
      gender: "F",
      passenger_type: "Senior",
      route: "MNL-COR",
      accommodation: "Tourist",
      seat_no: "F09",
      payment_method: "Cash",
      status: "PENDING",
    },
    {
      id: 9,
      booking_no: "BK-009",
      fullname: "Daniel Flores",
      gender: "M",
      passenger_type: "Student",
      route: "DGT-SIQ", // Dumaguete → Siquijor
      accommodation: "Economy",
      seat_no: "A03",
      payment_method: "GCash",
      status: "PAID",
    },
    {
      id: 10,
      booking_no: "BK-010",
      fullname: "Christine Navarro",
      gender: "F",
      passenger_type: "Adult",
      route: "DGT-SIQ",
      accommodation: "Business",
      seat_no: null,
      payment_method: "Credit Card",
      status: "PENDING",
    },
  ],
  meta: {
    current_page: 1,
    last_page: 5,
    total: 100,
  },
};

const fetchPassengers = async () => {
  loading.value = true;
  passengers.value = []; // clear old rows immediately

  try {
    await new Promise((r) => setTimeout(r, 400)); // simulate API

    // 1️⃣ Filter data by search term
    const filtered = mockPassengerResponse.data.filter((p) => {
      const term = search.value.toLowerCase();
      return (
        p.booking_no.toLowerCase().includes(term) ||
        p.fullname.toLowerCase().includes(term)
      );
    });

    // 2️⃣ Slice for pagination
    const start = (currentPage.value - 1) * perPage.value;
    const end = start + perPage.value;

    passengers.value = filtered.slice(start, end);

    // 3️⃣ Update total pages based on filtered results
    totalPages.value = Math.ceil(filtered.length / perPage.value);
  } finally {
    loading.value = false;
  }
};

/* WATCHERS */
watch([currentPage, search], fetchPassengers);

/* INIT */
onMounted(fetchPassengers);
</script>
