<script setup>
import { Search, Users } from "lucide-vue-next";
import { ref, computed, onMounted } from "vue";
import sampleData from "./walkin-data.json";
import ModalRefundDetails from "../../../components/Modals/Refund/ModalRefundDetails.vue";

const isTableLoading = ref(false);
const isModalRefundDetailsOpen = ref(false);
const bookings = ref([]);
const search = ref("");

const statusConfig = {
  paid: { label: "Paid", class: "text-green-700 bg-green-100" },
  "no action": { label: "No Action", class: "text-gray-600 bg-gray-100" },
};

const filteredBookings = computed(() => {
  const q = search.value.toLowerCase();
  if (!q) return bookings.value;
  return bookings.value.filter(
    (b) =>
      b.bookingNumber.toLowerCase().includes(q) ||
      b.customer.toLowerCase().includes(q) ||
      b.route.toLowerCase().includes(q) ||
      b.vessel.toLowerCase().includes(q),
  );
});

const formatDate = (val) => (val ? new Date(val).toLocaleDateString() : "—");

const fetchBookings = async () => {
  isTableLoading.value = true;
  try {
    bookings.value = sampleData.walkin_bookings.map((b) => ({
      bookingId: b.booking_id,
      bookingNumber: b.booking_number,
      amount: b.amount,
      customer: b.customer,
      route: b.route,
      vessel: b.vessel,
      status: b.status,
      paymentMethod: b.payment_method,
      datePaid: formatDate(b.date_paid),
      dateCancelled: formatDate(b.date_cancelled),
      bookedPassengers: b.booked_passengers,
    }));
  } finally {
    isTableLoading.value = false;
  }
};

onMounted(fetchBookings);
</script>

<template>
  <div class="border border-gray-300 bg-white rounded-lg">
    <div class="px-4 py-3 border-b border-gray-200 gap-3 flex flex-col">
      <div class="flex justify-between">
        <h2 class="text-lg font-medium text-gray-900">Walk-In Refunds</h2>
      </div>
      <!-- Search -->
      <div class="relative">
        <Search
          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
        />
        <input
          v-model="search"
          type="text"
          placeholder="Search by booking number, customer, route, or vessel"
          class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
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
            Loading Bookings...
          </span>
        </div>
      </div>

      <!-- TABLE -->
      <div v-else-if="filteredBookings.length > 0" class="overflow-x-auto">
        <table class="min-w-full table-fixed divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="w-12 px-4 py-3 text-left text-xs text-gray-500">#</th>
              <th class="w-44 px-4 py-3 text-left text-xs text-gray-500">
                Booking Number
              </th>
              <th class="w-32 px-4 py-3 text-left text-xs text-gray-500">
                Amount
              </th>
              <th class="w-44 px-4 py-3 text-left text-xs text-gray-500">
                Customer
              </th>
              <th class="w-28 px-4 py-3 text-left text-xs text-gray-500">
                Route
              </th>
              <th class="w-28 px-4 py-3 text-left text-xs text-gray-500">
                Vessel
              </th>
              <th class="w-32 px-4 py-3 text-left text-xs text-gray-500">
                Status
              </th>
              <th class="w-36 px-4 py-3 text-left text-xs text-gray-500">
                Payment Method
              </th>
              <th class="w-32 px-4 py-3 text-left text-xs text-gray-500">
                Date Paid
              </th>
              <th class="w-36 px-4 py-3 text-left text-xs text-gray-500">
                Date Cancelled
              </th>
              <th class="w-24 px-4 py-3 text-left text-xs text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(booking, index) in filteredBookings"
              :key="booking.bookingId"
              class="hover:bg-gray-50"
            >
              <td class="px-4 py-4 text-sm text-gray-500">
                {{ index + 1 }}
              </td>
              <td class="px-4 py-4 text-sm font-medium text-gray-900">
                {{ booking.bookingNumber }}
              </td>
              <td class="px-4 py-4 text-sm text-gray-700">
                ₱
                {{
                  booking.amount.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })
                }}
              </td>
              <td class="px-4 py-4 text-sm text-gray-700">
                {{ booking.customer }}
              </td>
              <td class="px-4 py-4 text-sm font-medium text-gray-700">
                {{ booking.route }}
              </td>
              <td class="px-4 py-4 text-sm text-gray-700">
                {{ booking.vessel }}
              </td>
              <td class="px-4 py-4 text-sm">
                <span
                  :class="[
                    'px-2 py-0.5 rounded text-xs font-medium',
                    statusConfig[booking.status]?.class ??
                      'text-gray-600 bg-gray-100',
                  ]"
                >
                  {{ statusConfig[booking.status]?.label ?? booking.status }}
                </span>
              </td>
              <td class="px-4 py-4 text-sm text-gray-700">
                {{ booking.paymentMethod }}
              </td>
              <td class="px-4 py-4 text-sm text-gray-600">
                {{ booking.datePaid }}
              </td>
              <td class="px-4 py-4 text-sm text-gray-600">
                {{ booking.dateCancelled }}
              </td>
              <td class="px-4 py-4 text-sm">
                <button
                  @click="isModalRefundDetailsOpen = true"
                  class="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Users class="w-4 h-4" />
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-10 text-gray-500 font-medium">
        No Walk-In Bookings Found
      </div>
    </div>
  </div>
  <transition name="modal-fade">
    <ModalRefundDetails
      v-if="isModalRefundDetailsOpen"
      @close="isModalRefundDetailsOpen = false"
      @save="refundDetailsSaved"
    />
  </transition>
</template>
