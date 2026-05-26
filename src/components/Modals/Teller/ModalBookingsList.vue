<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "viewBooking"]);

const apiBase = import.meta.env.VITE_API_URL;
const bookings = ref([]);
const loading = ref(false);
const selectedBooking = ref(null);
const showDetails = ref(false);

const fetchBookings = async () => {
  loading.value = true;
  try {
    const stored = localStorage.getItem("token");
    if (!stored) {
      alert("Authentication required. Please log in again.");
      return;
    }
    
    const authHeader = stored.startsWith("Bearer ") ? stored : `Bearer ${stored}`;

    const response = await fetch(`${apiBase}/teller-booking/payment`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Bookings Response:", result);
      
      if (result.success && result.data?.payments) {
        bookings.value = result.data.payments;
      }
    } else {
      console.error("Failed to fetch bookings:", response.status);
    }
  } catch (err) {
    console.error("Error fetching bookings:", err);
  } finally {
    loading.value = false;
  }
};

const viewBookingDetails = async (bookingId) => {
  try {
    const stored = localStorage.getItem("token");
    if (!stored) {
      alert("Authentication required. Please log in again.");
      return;
    }
    
    const authHeader = stored.startsWith("Bearer ") ? stored : `Bearer ${stored}`;

    const response = await fetch(`${apiBase}/teller-booking/payment/${bookingId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Booking Details:", result);
      
      if (result.success && result.data?.payment) {
        selectedBooking.value = result.data.payment;
        showDetails.value = true;
      }
    } else {
      console.error("Failed to fetch booking details:", response.status);
    }
  } catch (err) {
    console.error("Error fetching booking details:", err);
  }
};

const closeDetails = () => {
  showDetails.value = false;
  selectedBooking.value = null;
};

const closeModal = () => {
  closeDetails();
  emit("close");
};

// Helper function to format creator name
const formatCreatorName = (creator) => {
  if (!creator) return '';
  // If full_name exists, use it (for list view)
  if (creator.full_name) return creator.full_name;
  // Otherwise, build from first_name, middle_name, last_name (for detail view)
  const parts = [
    creator.first_name,
    creator.middle_name,
    creator.last_name
  ].filter(Boolean);
  return parts.join(' ');
};

// Watch for modal open and fetch bookings
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    fetchBookings();
  }
});
</script>

<template>
  <transition name="modal-fade">
    <div
      v-if="isOpen"
      @click="closeModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div
        @click.stop
        class="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col shadow-xl"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">Bookings</h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex-1 flex items-center justify-center p-12">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Loading bookings...</p>
          </div>
        </div>

        <!-- Bookings Details View -->
        <div v-else-if="showDetails && selectedBooking" class="flex-1 overflow-y-auto p-6">
          <button
            @click="closeDetails"
            class="mb-4 text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to list
          </button>
          
          <div class="bg-gray-50 rounded-lg p-6 space-y-6">
            <!-- Quick Summary Stats -->
            <div class="grid grid-cols-3 gap-4">
              <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p class="text-sm text-blue-600 font-medium">Passengers</p>
                <p class="text-2xl font-bold text-blue-900">{{ selectedBooking.booked_passengers?.length || 0 }}</p>
              </div>
              <div class="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <p class="text-sm text-purple-600 font-medium">Vehicles</p>
                <p class="text-2xl font-bold text-purple-900">{{ selectedBooking.booked_vehicles?.length || 0 }}</p>
              </div>
              <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                <p class="text-sm text-green-600 font-medium">Total Amount</p>
                <p class="text-2xl font-bold text-green-900">₱{{ parseFloat(selectedBooking.grand_total).toFixed(2) }}</p>
              </div>
            </div>

            <!-- Travel Information -->
            <div v-if="selectedBooking.booking" class="bg-white rounded-lg p-6 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Travel Information</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Serial Number</p>
                  <p class="font-semibold font-mono text-blue-600">{{ selectedBooking.booked_passengers?.[0]?.serial_no || selectedBooking.booked_vehicles?.[0]?.serial_no || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Travel Date</p>
                  <p class="font-semibold">{{ new Date(selectedBooking.booking.travel_date).toLocaleDateString() }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Schedule</p>
                  <p class="font-semibold">{{ selectedBooking.booking.schedule_snapshot }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Route</p>
                  <p class="font-semibold">{{ selectedBooking.booking.route_snapshot }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Vessel</p>
                  <p class="font-semibold">{{ selectedBooking.booking.vessel_snapshot || 'N/A' }}</p>
                </div>
                <div v-if="selectedBooking.booking.institutional_account_snapshot">
                  <p class="text-sm text-gray-600">Institutional Account</p>
                  <p class="font-semibold text-purple-600">{{ selectedBooking.booking.institutional_account_snapshot }}</p>
                </div>
                <div v-if="selectedBooking.booking.is_return_trip" class="col-span-2">
                  <p class="text-sm text-gray-600">Trip Type</p>
                  <p class="font-semibold text-blue-600 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Round Trip
                  </p>
                </div>
              </div>
            </div>

            <!-- Payment Summary -->
            <div class="bg-white rounded-lg p-6 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
              <div class="space-y-4">
                <!-- Payment Method & Reference -->
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p class="text-sm text-gray-600">Payment Method</p>
                    <p class="font-semibold capitalize text-lg">{{ selectedBooking.payment_method }}</p>
                  </div>
                  <div v-if="selectedBooking.reference_number" class="text-right">
                    <p class="text-sm text-gray-600">Reference Number</p>
                    <p class="font-semibold font-mono text-blue-600">{{ selectedBooking.reference_number }}</p>
                  </div>
                </div>

                <!-- Financial Breakdown -->
                <div class="space-y-2 border-t pt-4">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Total Fare</span>
                    <span class="font-semibold">₱{{ parseFloat(selectedBooking.total_fare).toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Admin Fee</span>
                    <span class="font-semibold">₱{{ parseFloat(selectedBooking.total_admin_fee).toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Discount</span>
                    <span class="font-semibold text-red-600">-₱{{ parseFloat(selectedBooking.total_discount).toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Grand Total</span>
                    <span class="text-green-600">₱{{ parseFloat(selectedBooking.grand_total).toFixed(2) }}</span>
                  </div>
                </div>

                <!-- Booking IDs -->
                <div class="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p class="text-xs text-gray-500">Payment ID</p>
                    <p class="font-mono text-sm">#{{ selectedBooking.booking_payment_id }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Booking ID</p>
                    <p class="font-mono text-sm">#{{ selectedBooking.booking_id }}</p>
                  </div>
                </div>

                <!-- Creator Info -->
                <div v-if="selectedBooking.creator" class="pt-4 border-t">
                  <p class="text-xs text-gray-500 mb-1">Created By</p>
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span class="text-blue-700 font-semibold">{{ formatCreatorName(selectedBooking.creator).charAt(0) }}</span>
                    </div>
                    <div>
                      <p class="font-semibold text-sm">{{ formatCreatorName(selectedBooking.creator) }}</p>
                      <p class="text-xs text-gray-500">{{ selectedBooking.creator.email }}</p>
                    </div>
                  </div>
                  <p class="text-xs text-gray-500 mt-2">{{ new Date(selectedBooking.created_at).toLocaleString() }}</p>
                </div>
              </div>
            </div>

            <!-- Passengers -->
            <div v-if="selectedBooking.booked_passengers && selectedBooking.booked_passengers.length > 0" class="bg-white rounded-lg p-6 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Passengers ({{ selectedBooking.booked_passengers.length }})
              </h3>
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                      <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Gender</th>
                      <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                      <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Accommodation</th>
                      <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Seat</th>
                      <th class="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase">Fare</th>
                      <th class="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase">Discount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="passenger in selectedBooking.booked_passengers" :key="passenger.booked_passenger_id" class="border-t border-gray-100 hover:bg-gray-50">
                      <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ passenger.fullname }}</td>
                      <td class="px-4 py-3 text-sm capitalize">
                        <span :class="passenger.gender === 'male' ? 'text-blue-600' : 'text-pink-600'">
                          {{ passenger.gender }}
                        </span>
                      </td>
                      <td class="px-4 py-3 text-sm">
                        <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          {{ passenger.passenger_type_snapshot }}
                        </span>
                      </td>
                      <td class="px-4 py-3 text-sm">{{ passenger.passenger_category_snapshot || 'N/A' }}</td>
                      <td class="px-4 py-3 text-sm font-mono">{{ passenger.seat_number_snapshot || 'N/A' }}</td>
                      <td class="px-4 py-3 text-sm text-right font-semibold">₱{{ parseFloat(passenger.fare).toFixed(2) }}</td>
                      <td class="px-4 py-3 text-sm text-right text-red-600 font-semibold">-₱{{ parseFloat(passenger.discount_amount).toFixed(2) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Vehicles -->
            <div v-if="selectedBooking.booked_vehicles && selectedBooking.booked_vehicles.length > 0" class="bg-white rounded-lg p-6 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Vehicles ({{ selectedBooking.booked_vehicles.length }})
              </h3>
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                      <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Plate Number</th>
                      <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Driver</th>
                      <th class="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase">Fare</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="vehicle in selectedBooking.booked_vehicles" :key="vehicle.booked_vehicle_id" class="border-t border-gray-100 hover:bg-gray-50">
                      <td class="px-4 py-3 text-sm">
                        <span class="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                          {{ vehicle.vehicle_type }}
                        </span>
                      </td>
                      <td class="px-4 py-3 text-sm font-mono font-semibold">{{ vehicle.plate_no || 'N/A' }}</td>
                      <td class="px-4 py-3 text-sm">
                        <div v-if="vehicle.driver" class="flex items-center gap-2">
                          <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span class="text-blue-700 text-xs font-semibold">{{ vehicle.driver.fullname.charAt(0) }}</span>
                          </div>
                          <div>
                            <p class="font-medium">{{ vehicle.driver.fullname }}</p>
                            <p class="text-xs text-gray-500 capitalize">{{ vehicle.driver.gender }}</p>
                          </div>
                        </div>
                        <span v-else class="text-gray-400 italic text-sm">No driver assigned</span>
                      </td>
                      <td class="px-4 py-3 text-sm text-right font-semibold">₱{{ parseFloat(vehicle.fare).toFixed(2) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Bookings List View -->
        <div v-else class="flex-1 overflow-y-auto p-6">
          <!-- Empty State -->
          <div v-if="bookings.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-gray-600 text-lg">No bookings found</p>
          </div>

          <!-- Bookings Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="booking in bookings"
              :key="booking.booking_payment_id"
              class="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-shadow cursor-pointer"
              @click="viewBookingDetails(booking.booking_payment_id)"
            >
              <div class="flex items-start justify-between mb-3">
                <div>
                  <p class="text-sm text-gray-600">Booking ID</p>
                  <p class="text-lg font-bold text-gray-900">#{{ booking.booking_id }}</p>
                </div>
                <span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  {{ booking.payment_method }}
                </span>
              </div>
              
              <div class="space-y-2 mb-4">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Fare:</span>
                  <span class="font-semibold">₱{{ parseFloat(booking.total_fare).toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Admin Fee:</span>
                  <span class="font-semibold">₱{{ parseFloat(booking.total_admin_fee).toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Discount:</span>
                  <span class="font-semibold text-red-600">-₱{{ parseFloat(booking.total_discount).toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-sm pt-2 border-t border-gray-200">
                  <span class="text-gray-900 font-semibold">Total:</span>
                  <span class="text-green-600 font-bold text-lg">₱{{ parseFloat(booking.grand_total).toFixed(2) }}</span>
                </div>
              </div>

              <div v-if="booking.creator" class="text-xs text-gray-500 border-t border-gray-100 pt-3">
                <p>Created by: {{ formatCreatorName(booking.creator) }}</p>
              </div>

              <div class="mt-3 flex items-center gap-2">
                <span v-if="booking.booked_passengers && booking.booked_passengers.length > 0" class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {{ booking.booked_passengers.length }} pax
                </span>
                <span v-if="booking.booked_vehicles && booking.booked_vehicles.length > 0" class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {{ booking.booked_vehicles.length }} vehicle(s)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 200ms ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
