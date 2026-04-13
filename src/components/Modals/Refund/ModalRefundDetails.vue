<script setup>
import { Calendar, HandCoins } from "lucide-vue-next";
import { ref, computed } from "vue";

const emit = defineEmits(["close"]);

const SERVICE_FEE = 50.0;

const booking = ref({
  customerName: "John Doe",
  bookingNumber: "BK-2024-00123",
  route: "Manila → Cebu",
  tripType: "One Way",
  paymentMethod: "GCash",
  datePaid: "2024-03-15",
  amountPaid: 2650.0,
  booked_passengers: [
    { type: "adult", amount: 500.0 },
    { type: "adult", amount: 500.0 },
    { type: "adult", amount: 500.0 },
    { type: "senior", amount: 400.0 },
    { type: "senior", amount: 400.0 },
    { type: "student", amount: 350.0 },
  ],
});

const passengerGroups = computed(() => {
  const groups = {};

  for (const passenger of booking.value.booked_passengers) {
    if (!groups[passenger.type]) {
      groups[passenger.type] = {
        type: passenger.type,
        quantity: 0,
        priceEach: passenger.amount,
      };
    }
    groups[passenger.type].quantity += 1;
  }

  return Object.values(groups).map((group) => ({
    ...group,
    total: group.quantity * group.priceEach,
  }));
});

const subtotal = computed(() =>
  passengerGroups.value.reduce((sum, g) => sum + g.total, 0),
);

const grandTotal = computed(() => subtotal.value + SERVICE_FEE);

function formatCurrency(value) {
  return value.toFixed(2);
}

function formatPassengerType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    @click="$emit('close')"
  >
    <div
      class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col"
      @click.stop
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0"
      >
        <h2 class="text-lg font-semibold text-gray-900">Refund Payment</h2>
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

      <!-- Body -->
      <div class="overflow-y-auto flex-1 px-6 py-6 flex flex-col gap-6">
        <!-- Customer Details -->
        <div>
          <h3 class="text-base font-semibold text-gray-900 mb-4">
            Customer Details
          </h3>
          <div class="grid grid-cols-2 gap-x-12 gap-y-4">
            <!-- Left Column -->
            <div class="flex flex-col gap-4">
              <div class="flex justify-between items-center">
                <span class="font-medium text-gray-700">Customer Name</span>
                <span class="text-gray-500">{{ booking.customerName }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-medium text-gray-700">Booking Number</span>
                <span class="text-blue-500 font-bold">{{
                  booking.bookingNumber
                }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-medium text-gray-700">Route</span>
                <span class="text-gray-500">{{ booking.route }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-medium text-gray-700">Trip Type</span>
                <span class="text-gray-500">{{ booking.tripType }}</span>
              </div>
            </div>
            <!-- Right Column -->
            <div class="flex flex-col gap-4">
              <div class="flex justify-between items-center">
                <span class="font-medium text-gray-700">Payment Method</span>
                <span class="text-gray-500">{{ booking.paymentMethod }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-medium text-gray-700">Date Paid</span>
                <span class="text-gray-500">{{ booking.datePaid }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-medium text-gray-700">Amount Paid</span>
                <span class="text-gray-500"
                  >₱ {{ formatCurrency(booking.amountPaid) }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Passenger Summary Table -->
        <div>
          <h3 class="text-base font-semibold text-gray-900 mb-3">
            Passenger Summary
          </h3>
          <div class="overflow-hidden rounded-lg border border-gray-200">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th class="px-4 py-3 text-left font-medium">
                    Passenger Type
                  </th>
                  <th class="px-4 py-3 text-center font-medium">Quantity</th>
                  <th class="px-4 py-3 text-right font-medium">Price Each</th>
                  <th class="px-4 py-3 text-right font-medium">Total Amount</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr
                  v-for="group in passengerGroups"
                  :key="group.type"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-4 py-3 text-gray-800 font-medium">
                    {{ formatPassengerType(group.type) }}
                  </td>
                  <td class="px-4 py-3 text-center text-gray-600">
                    {{ group.quantity }}
                  </td>
                  <td class="px-4 py-3 text-right text-gray-600">
                    ₱ {{ formatCurrency(group.priceEach) }}
                  </td>
                  <td class="px-4 py-3 text-right text-gray-800 font-medium">
                    ₱ {{ formatCurrency(group.total) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pricing Summary -->
        <div class="flex justify-end">
          <div class="w-72 flex flex-col gap-2 text-sm">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₱ {{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Service Fee</span>
              <span>₱ {{ formatCurrency(SERVICE_FEE) }}</span>
            </div>
            <div
              class="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-2 mt-1"
            >
              <span>Grand Total</span>
              <span>₱ {{ formatCurrency(grandTotal) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div
        class="shrink-0 px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2"
      >
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          No Action
        </button>
        <button
          type="button"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
        >
          <Calendar class="w-4 h-4" />
          Slide Trip
        </button>
        <button
          type="button"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 transition-colors"
        >
          <Calendar class="w-4 h-4" />
          Rebook
        </button>
        <button
          type="button"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 transition-colors"
        >
          <HandCoins class="w-4 h-4" />
          Issue Refund
        </button>
      </div>
    </div>
  </div>
</template>
