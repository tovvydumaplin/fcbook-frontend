<script setup>
import { nextTick, ref, watch } from "vue";
import ModalPaymentSelection from "../components/ModalPaymentSelection.vue";
import VehicleSelection from "../components/VehicleSelection.vue";
import ViewTellerPassenger from "../components/ViewTellerPassenger.vue";
import TellerHeader from "../components/TellerHeader.vue";
import { onMounted } from "vue";
import {
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/vue/24/outline";
const apiBase = import.meta.env.VITE_API_URL;
const showSuccess = ref(false);
const bookingActive = ref(false);

const isPaymentModalOpen = ref(false);
const isVehicleModalOpen = ref(false);

// Store selected vehicle details from modal
const selectedVehicleDetails = ref(null);

const handleVehicleSave = (vehicle) => {
  selectedVehicleDetails.value = vehicle;
  isVehicleModalOpen.value = false;
};

// Rates per route and accommodation
const rates = [
  {
    route: "Batangas Port - Calapan Port",
    business: 653,
    premium: 500,
    economy: 300,
  },
  // Add more routes as needed
];

// Admin fee per route (or flat)
const adminFees = [
  {
    route: "Batangas Port - Calapan Port",
    fee: 2,
  },
  // Add more routes as needed
];

const getCurrentRate = () => {
  const route = `${originPort.value} - ${destinationPort.value}`;
  const found = rates.find((r) => r.route === route);
  if (!found) return 0;
  if (selectedAccommodation.value === "Business Class") return found.business;
  if (selectedAccommodation.value === "Premium Economy") return found.premium;
  if (selectedAccommodation.value === "Economy") return found.economy;
  return 0;
};

const getCurrentAdminFee = () => {
  const route = `${originPort.value} - ${destinationPort.value}`;
  const found = adminFees.find((r) => r.route === route);
  return found ? found.fee : 0;
};

const getDiscountAmount = (fare) => {
  if (selectedDiscount.value.endsWith("%")) {
    const percent = parseFloat(selectedDiscount.value) / 100;
    return fare * percent;
  }
  if (selectedDiscount.value === "100%") return fare;
  return 0;
};

const ports = [
  { id: 1, name: "Batangas Port" },
  { id: 2, name: "Calapan Port" },
  { id: 3, name: "San Carlos Port" },
];

const routes = ref([]);
const selectedRoute = ref(null);
const returnTrip = ref(false);

const originPort = ref("Batangas Port");
const destinationPort = ref("Calapan Port");

const selectedDate = ref(""); // Add date selection

const passengers = ref([]);

const selectedSchedule = ref(null); // Now stores the entire schedule object
const selectedCategory = ref("");
const selectedType = ref("");
const selectedAccommodation = ref("");
const selectedGender = ref("");
const selectedDiscount = ref("");
const fullname = ref("");

// Seatmap state
const vesselSeatmap = ref(null);
const availableSeats = ref([]);
const selectedSeat = ref(null);
const loadingSeatmap = ref(false);

// Clear selected schedule when route changes
watch(selectedRoute, (newRoute) => {
  selectedSchedule.value = null;
  if (newRoute) {
    if (returnTrip.value) {
      originPort.value =
        newRoute.portB?.port_name || newRoute.portB?.name || "";
      destinationPort.value =
        newRoute.portA?.port_name || newRoute.portA?.name || "";
    } else {
      originPort.value =
        newRoute.portA?.port_name || newRoute.portA?.name || "";
      destinationPort.value =
        newRoute.portB?.port_name || newRoute.portB?.name || "";
    }
  }
});

// Handle return trip toggle
watch(returnTrip, () => {
  selectedSchedule.value = null;
  if (selectedRoute.value) {
    if (returnTrip.value) {
      originPort.value =
        selectedRoute.value.portB?.port_name ||
        selectedRoute.value.portB?.name ||
        "";
      destinationPort.value =
        selectedRoute.value.portA?.port_name ||
        selectedRoute.value.portA?.name ||
        "";
    } else {
      originPort.value =
        selectedRoute.value.portA?.port_name ||
        selectedRoute.value.portA?.name ||
        "";
      destinationPort.value =
        selectedRoute.value.portB?.port_name ||
        selectedRoute.value.portB?.name ||
        "";
    }
  }
});

// Update origin/destination when schedule is selected
watch(selectedSchedule, (newSchedule) => {
  if (newSchedule) {
    originPort.value = newSchedule.departurePort || originPort.value;
    destinationPort.value = newSchedule.arrivalPort || destinationPort.value;
  }
  // Clear seatmap when schedule changes
  vesselSeatmap.value = null;
  availableSeats.value = [];
  selectedSeat.value = null;
});

// Fetch seatmap when accommodation is selected
watch(selectedAccommodation, async (newAccommodation) => {
  if (!newAccommodation || !selectedSchedule.value?.vesselId) {
    vesselSeatmap.value = null;
    availableSeats.value = [];
    selectedSeat.value = null;
    return;
  }

  loadingSeatmap.value = true;
  try {
    const stored = localStorage.getItem("token");
    const authHeader = stored?.startsWith("Bearer ")
      ? stored
      : `Bearer ${stored}`;

    const response = await fetch(
      `${apiBase}/vessels/${selectedSchedule.value.vesselId}/layout`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      },
    );

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        vesselSeatmap.value = result.data;

        // Find the class that matches selected accommodation
        const selectedClass = result.data.classes?.find(
          (cls) => cls.accommodation_name === newAccommodation,
        );

        if (selectedClass) {
          // Get seats for this class
          availableSeats.value = selectedClass.seats || [];
        } else {
          availableSeats.value = [];
        }
      }
    } else {
      console.error("Failed to fetch seatmap");
      vesselSeatmap.value = null;
      availableSeats.value = [];
    }
  } catch (err) {
    console.error("Error fetching seatmap:", err);
    vesselSeatmap.value = null;
    availableSeats.value = [];
  } finally {
    loadingSeatmap.value = false;
    selectedSeat.value = null;
  }
});

// const schedules = [
//   { time: "12:00 AM", code: "FCM 19", value: "12:00 AM" },
//   { time: "3:00 AM", code: "FCM 19", value: "3:00 AM" },
//   { time: "6:00 AM", code: "FCM 19", value: "6:00 AM" },
//   { time: "8:00 AM", code: "FCM 19", value: "8:00 AM" },
//   { time: "1:00 PM", code: "FCM 19", value: "1:00 PM" },
//   { time: "3:00 PM", code: "FCM 19", value: "3:00 PM" },
//   { time: "5:00 PM", code: "FCM 19", value: "5:00 PM" },
//   { time: "9:00 PM", code: "FCM 19", value: "9:00 PM" },
// ];

const allSchedules = ref([]); // Store raw schedule data with port info
const schedules = ref([]); // Will be deprecated, kept for compatibility

onMounted(async () => {
  try {
    const stored = localStorage.getItem("token");
    console.log("stored token:", stored);

    if (!stored) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return (window.location.href = "/");
    }

    // only add "Bearer " if it doesn't already start with it
    const authHeader = stored.startsWith("Bearer ")
      ? stored
      : `Bearer ${stored}`;

    const response = await fetch(`${apiBase}/routes/with-schedules`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    console.log("routes response status:", response.status);

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return (window.location.href = "/");
    }

    const result = await response.json();
    if (response.ok && result.success && result.data?.routes) {
      routes.value = result.data.routes;

      // Extract all schedules from routes keeping port separation
      const allScheds = [];
      result.data.routes.forEach((route) => {
        const portASchedules = route.portA?.schedules || [];
        const portBSchedules = route.portB?.schedules || [];

        portASchedules.forEach((item) => {
          const vesselName =
            item.vessel?.vessel_name ??
            item.vessel?.name ??
            item.vessel_name ??
            (typeof item.vessel === "string" ? item.vessel : "");
          const vesselId =
            item.vessel?.vessel_id ?? item.vessel?.id ?? item.vessel_id ?? null;
          allScheds.push({
            id: item.sched_id ?? item.id ?? null,
            time: item.departure_time,
            code: vesselName || "No vessel",
            value: item.departure_time,
            port: item.port,
            routeId: route.route_id,
            departurePort: route.portA?.port_name || route.portA?.name,
            arrivalPort: route.portB?.port_name || route.portB?.name,
            vesselId: vesselId,
            vessel: item.vessel,
          });
        });

        portBSchedules.forEach((item) => {
          const vesselName =
            item.vessel?.vessel_name ??
            item.vessel?.name ??
            item.vessel_name ??
            (typeof item.vessel === "string" ? item.vessel : "");
          const vesselId =
            item.vessel?.vessel_id ?? item.vessel?.id ?? item.vessel_id ?? null;
          allScheds.push({
            id: item.sched_id ?? item.id ?? null,
            time: item.departure_time,
            code: vesselName || "No vessel",
            value: item.departure_time,
            port: item.port,
            routeId: route.route_id,
            departurePort: route.portB?.port_name || route.portB?.name,
            arrivalPort: route.portA?.port_name || route.portA?.name,
            vesselId: vesselId,
            vessel: item.vessel,
          });
        });
      });

      allSchedules.value = allScheds;
      schedules.value = allScheds;

      // Set default route if available
      if (routes.value.length > 0) {
        selectedRoute.value = routes.value[0];
      }
    } else {
      console.error("Failed to fetch routes:", result.message || result);
    }
  } catch (err) {
    console.error("Failed to fetch routes:", err);
  }
});

const passengerCategories = ["Passenger", "Driver", "Helper"];
const passengerTypes = ["Regular Passenger", "Institutional Account"];
const accommodations = [
  "Business Class",
  "Premium Economy",
  "Economy",
  "Senior/PWD",
];
const genders = ["Male", "Female"];
const discounts = [
  { label: "No Discount", value: "0", percent: "0%" },
  { label: "Special Discount", value: "25%", percent: "25%" },
  { label: "FOC", value: "100%", percent: "100%" },
];

const bookEntry = () => {
  const fare = getCurrentRate();
  const adminFee = getCurrentAdminFee();
  const discountAmount = getDiscountAmount(fare);
  const discountedFare = fare - discountAmount;

  const entry = {
    date: selectedDate.value,
    route: `${originPort.value} - ${destinationPort.value}`,
    schedule: selectedSchedule.value?.time || selectedSchedule.value,
    category: selectedCategory.value,
    type: selectedType.value,
    accommodation: selectedAccommodation.value,
    gender: selectedGender.value,
    discount: selectedDiscount.value,
    fullname: fullname.value,
    seat:
      selectedSeat.value?.seat_no ||
      (editingIndex.value !== null
        ? passengers.value[editingIndex.value].seat
        : `00${passengers.value.length + 1}A`),
    fare: discountedFare.toFixed(2),
    cargoFare: "0.00",
    adminFee: adminFee.toFixed(2),
    discountAmount: discountAmount.toFixed(2),
    vehicle: selectedVehicleDetails.value,
  };

  if (editingIndex.value !== null) {
    passengers.value[editingIndex.value] = entry;
    editingIndex.value = null;
  } else {
    passengers.value.push(entry);
  }

  showSuccess.value = true;
  setTimeout(() => (showSuccess.value = false), 2000);

  // Reset form fields
  fullname.value = "";
  selectedDiscount.value = "";
  selectedCategory.value = "Passenger";
  selectedAccommodation.value = "Business Class";
  selectedGender.value = "Male";
  selectedType.value = "Regular Passenger";
  selectedVehicleDetails.value = null;
  selectedDate.value = "";
  selectedSeat.value = null;
};

const resetForm = () => {
  fullname.value = "";
  selectedDiscount.value = "No Discount";
  selectedCategory.value = "Passenger";
  selectedAccommodation.value = "Business Class";
  selectedGender.value = "Male";
  selectedType.value = "Regular Passenger";
  passengers.value = [];
  selectedVehicleDetails.value = null;
  selectedDate.value = "";
  showSuccess.value = true;
  setTimeout(() => (showSuccess.value = false), 2000);
};

watch(selectedCategory, (newVal) => {
  if (newVal === "Driver") {
    isVehicleModalOpen.value = true;
  }
});

const handlePaymentSelected = (method) => {
  // isPaymentModalOpen.value = false;
};

const handlePrintingSelected = (option) => {
  isPaymentModalOpen.value = false;
  if (option === "e-ticket" || option.id === "eticket") {
    console.log("Passenger Array:", passengers.value);
  }
};

import { computed } from "vue";

// Filter and group schedules based on selected route
const filteredSchedules = computed(() => {
  if (!selectedRoute.value || allSchedules.value.length === 0) {
    return { portA: [], portB: [] };
  }

  const schedules = allSchedules.value.filter((schedule) => {
    return schedule.routeId === selectedRoute.value.route_id;
  });

  // Group by departure port
  const portAName =
    selectedRoute.value.portA?.port_name || selectedRoute.value.portA?.name;
  const portBName =
    selectedRoute.value.portB?.port_name || selectedRoute.value.portB?.name;

  return {
    portA: schedules.filter((s) => s.departurePort === portAName),
    portB: schedules.filter((s) => s.departurePort === portBName),
  };
});

const totalOriginalFare = computed(() =>
  passengers.value.reduce(
    (sum, p) => sum + Number(p.fare) + Number(p.discountAmount),
    0,
  ),
);

const totalFare = computed(() =>
  passengers.value.reduce((sum, p) => sum + parseFloat(p.fare), 0),
);
const totalCargo = computed(() =>
  passengers.value.reduce((sum, p) => sum + parseFloat(p.cargoFare), 0),
);
const totalAdmin = computed(() =>
  passengers.value.reduce((sum, p) => sum + parseFloat(p.adminFee || 0), 0),
);
const totalDiscount = computed(() =>
  passengers.value.reduce(
    (sum, p) => sum + parseFloat(p.discountAmount || 0),
    0,
  ),
);
const totalAmount = computed(
  () =>
    totalOriginalFare.value +
    totalCargo.value +
    totalAdmin.value -
    totalDiscount.value,
);

const stepInstruction = computed(() => {
  if (!selectedSchedule.value) return "Select a Schedule to proceed";
  if (!selectedCategory.value) return "Select a Passenger Category to proceed";
  if (!selectedType.value) return "Select a Passenger Type to proceed";
  if (!selectedAccommodation.value)
    return "Select a Passenger Accommodation to proceed";
  if (!fullname.value) return "Enter Passenger Fullname to proceed";
  if (!selectedGender.value) return "Select Gender to proceed";
  if (!selectedDiscount.value) return "Select Discount to proceed";
  return "";
});

const rightPanel = ref(null);
watch(stepInstruction, async () => {
  await nextTick();
  if (rightPanel.value) {
    rightPanel.value.scrollTo({
      top: rightPanel.value.scrollHeight,
      behavior: "smooth",
    });
  }
});

const removePassenger = (idx) => {
  passengers.value.splice(idx, 1);
};

// View Passenger

const isViewPassengerOpen = ref(false);
const selectedPassenger = ref(null);

const openPassengerView = (passenger) => {
  selectedPassenger.value = passenger;
  isViewPassengerOpen.value = true;
};

const closePassengerView = () => {
  isViewPassengerOpen.value = false;
  selectedPassenger.value = null;
};
// View passenger....

// Edit passenger

const editingIndex = ref(null);

const editPassengerFromModal = (passenger) => {
  // Find the index of the passenger in the array
  const idx = passengers.value.findIndex(
    (p) => p.seat === passenger.seat && p.fullname === passenger.fullname,
  );
  if (idx !== -1) {
    selectedDate.value = passenger.date;
    originPort.value = passenger.route.split(" - ")[0];
    destinationPort.value = passenger.route.split(" - ")[1];
    selectedSchedule.value = passenger.schedule;
    selectedCategory.value = passenger.category;
    selectedType.value = passenger.type;
    selectedAccommodation.value = passenger.accommodation;
    selectedGender.value = passenger.gender;
    selectedDiscount.value = passenger.discount;
    fullname.value = passenger.fullname;
    selectedVehicleDetails.value = passenger.vehicle;
    editingIndex.value = idx;
    isViewPassengerOpen.value = false; // Close the modal
  }
};
</script>

<style scoped>
::v-deep(.scrollbar-hidden) {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
::v-deep(.scrollbar-hidden)::-webkit-scrollbar {
  display: none;
}
</style>

<template>
  <TellerHeader />
  <!-- Passenger View -->
  <ViewTellerPassenger
    :isOpen="isViewPassengerOpen"
    :passenger="selectedPassenger"
    @close="closePassengerView"
    @edit="editPassengerFromModal"
  />
  <!-- Payment Selection Modal -->
  <ModalPaymentSelection
    :isOpen="isPaymentModalOpen"
    @close="isPaymentModalOpen = false"
    @paymentSelected="handlePaymentSelected"
    @printingSelected="handlePrintingSelected"
  />
  <!-- Success Toast Notification -->
  <div
    v-if="showSuccess"
    class="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold text-base transition-all duration-300"
  >
    Passenger Added!
  </div>
  <!-- Vehicle Selection Modal -->
  <VehicleSelection
    :isOpen="isVehicleModalOpen"
    @close="isVehicleModalOpen = false"
    @save="handleVehicleSave"
  />

  <main>
    <div class="w-full grid grid-cols-[0.75fr_1.25fr]">
      <div
        class="left-panel h-screen overflow-y-auto scrollbar-hidden bg-white"
      >
        <div class="top-header border-b border-gray-300 pt-8 pb-8 pl-10 pr-10">
          <div class="text-header mb-6">
            <p class="text-neutral-700 text-3xl font-bold">
              {{ originPort }} - {{ destinationPort }}
            </p>
            <p class="text-neutral-600 font-medium text-base">FCM 19</p>
          </div>
          <!-- Details -->
          <div class="booking__box grid grid-cols-3 gap-6">
            <div class="booking__container">
              <div class="booking__item flex items-center gap-4">
                <div class="icon__box">
                  <CalendarDaysIcon class="text-blue-900 w-6 h-6" />
                </div>
                <div class="description__box">
                  <p class="text-gray-400 text-sm">Date</p>
                  <p class="text-neutral-700 text-base font-semibold">
                    {{ selectedDate || "Select a date" }}
                  </p>
                </div>
              </div>
            </div>
            <div class="booking__container">
              <div class="booking__item flex items-center gap-4">
                <div class="icon__box">
                  <ClockIcon class="text-blue-900 w-6 h-6" />
                </div>
                <div class="description__box">
                  <p class="text-gray-400 text-sm">Schedule</p>
                  <p class="text-neutral-700 text-base font-semibold">
                    {{ selectedSchedule?.time || "00:00 AM" }}
                  </p>
                </div>
              </div>
            </div>
            <div class="booking__container">
              <div class="booking__item flex items-center gap-4">
                <div class="icon__box">
                  <UserIcon class="text-blue-900 w-6 h-6" />
                </div>
                <div class="description__box">
                  <p class="text-gray-400 text-sm">Passengers</p>
                  <p class="text-neutral-700 text-base font-semibold">
                    {{ passengers.length }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Payment Breakdown Section -->
        <div class="main-body pt-8 pb-8 pl-10 pr-10">
          <div
            class="payment-breakdown border border-gray-300 py-8 px-7 rounded-lg mb-6"
          >
            <p class="text-neutral-700 text-2xl font-bold">Payment Breakdown</p>
            <div
              class="fares flex justify-between mb-2 border-b border-gray-300 pt-7 pb-4"
            >
              <p class="fare__text">Fare:</p>
              <p class="fare__amount">
                {{ totalOriginalFare.toFixed(2) }}
              </p>
            </div>
            <div
              class="fares flex justify-between mb-2 border-b border-gray-300 pb-4"
            >
              <p class="fare__text">Cargo Rate:</p>
              <p class="fare__amount">{{ totalCargo.toFixed(2) }}</p>
            </div>
            <div
              class="fares flex justify-between mb-2 border-b border-gray-300 pb-4"
            >
              <p class="fare__text">Admin Fee:</p>
              <p class="fare__amount">{{ totalAdmin.toFixed(2) }}</p>
            </div>
            <div
              class="fares flex justify-between mb-2 border-b border-gray-300 pb-4"
            >
              <p class="fare__text">Discount:</p>
              <p class="fare__amount">-{{ totalDiscount.toFixed(2) }}</p>
            </div>
            <div
              class="fares flex justify-between mb-2 border-b border-gray-300 pb-4"
            >
              <p class="fare__text font-bold">Amount to be paid:</p>
              <p class="fare__amount font-bold">{{ totalAmount.toFixed(2) }}</p>
            </div>
          </div>
          <div class="max-w-6xl mx-auto rounded-lg">
            <div class="mb-6">
              <h1 class="text-2xl font-semibold text-gray-800 mb-4">
                Passenger List
              </h1>
            </div>
            <div class="rounded-lg overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="bg-blue-900 text-white">
                      <th class="px-3 py-3 text-left font-semibold text-sm">
                        Fullname
                      </th>
                      <th class="px-3 py-3 text-left font-semibold text-sm">
                        Seat
                      </th>
                      <th class="px-3 py-3 text-left font-semibold text-sm">
                        Fare
                      </th>

                      <th class="px-3 py-3 text-left font-semibold text-sm">
                        Category
                      </th>
                      <th class="px-3 py-3 text-left font-semibold text-sm">
                        Class
                      </th>
                      <!-- <th class="px-3 py-3 text-left font-semibold text-sm">
                        Action
                      </th> -->
                    </tr>
                  </thead>
                  <tbody>
                    <!-- If no passengers -->
                    <tr v-if="passengers.length === 0">
                      <td
                        colspan="5"
                        class="px-2 py-4 text-center text-gray-500 text-sm italic"
                      >
                        No passengers
                      </td>
                    </tr>

                    <!-- If there are passengers -->
                    <tr
                      v-else
                      v-for="(p, index) in passengers"
                      :key="index"
                      class="bg-white hover:bg-gray-50"
                    >
                      <td class="px-2 py-2 font-medium text-gray-900 text-sm">
                        {{ p.fullname }}
                      </td>
                      <td class="px-2 py-2 text-gray-700 text-sm">
                        {{ p.seat }}
                      </td>
                      <td class="px-2 py-2 text-gray-700 text-sm">
                        {{ p.fare }}
                      </td>
                      <td class="px-2 py-2 text-gray-700 text-sm">
                        {{ p.category }} ({{
                          discounts.find((d) => d.value === p.discount)
                            ?.percent || "0%"
                        }})
                      </td>
                      <td class="px-2 py-2">
                        <button
                          class="p-2 text-blue-600 hover:bg-blue-50 rounded-md cursor-pointer"
                          @click="openPassengerView(p)"
                          title="View Passenger"
                        >
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          class="p-2 text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                          @click="removePassenger(index)"
                          title="Remove Passenger"
                        >
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m2 0v14a2 2 0 01-2 2H8a2 2 0 01-2-2V6m5 10v-6"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="flex items-center justify-between py-6 border-t">
                <button
                  class="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-base"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    ></path>
                  </svg>
                  Save for later
                </button>
                <div class="flex gap-3">
                  <button
                    class="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium text-base"
                    @click="resetForm"
                  >
                    Cancel
                  </button>
                  <button
                    class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium text-base"
                    @click="isPaymentModalOpen = true"
                  >
                    Proceed To Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        ref="rightPanel"
        class="right-panel bg-gray-100 h-screen overflow-y-auto scrollbar-hidden"
      >
        <div
          class="flex flex-col gap-8 border-b border-gray-300 pt-8 pb-8 pl-10 pr-10"
        >
          <div class="top__part flex gap-5">
            <div>
              <h3 class="text-base font-medium text-gray-700 mb-3">
                Select Date
              </h3>
              <input
                type="date"
                v-model="selectedDate"
                class="text-base text-gray-900 p-3 bg-white rounded-lg border border-gray-300"
              />
            </div>
            <div>
              <h3 class="text-base font-medium text-gray-700 mb-3">
                Select Route
              </h3>
              <div class="flex items-center gap-5">
                <div
                  class="bg-white flex gap-2 items-center p-3 rounded-lg border border-gray-300"
                >
                  <div class="flex items-center">
                    <select
                      v-model="selectedRoute"
                      class="hide-select-icon text-center text-base min-w-[280px]"
                    >
                      <option
                        v-for="route in routes"
                        :key="route.route_id"
                        :value="route"
                      >
                        {{
                          route.portA?.port_name ||
                          route.portA?.name ||
                          "Port A"
                        }}
                        →
                        {{
                          route.portB?.port_name ||
                          route.portB?.name ||
                          "Port B"
                        }}
                      </option>
                    </select>
                  </div>
                </div>
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="returnTrip"
                    class="theme-checkbox"
                  />
                  <span class="text-sm">Return Trip</span>
                </label>
              </div>
            </div>
          </div>
          <div>
            <div class="flex gap-4 items-center mb-3 justify-between">
              <h3 class="text-base font-medium text-gray-700">
                Select Schedule
              </h3>

              <!-- Only show if a schedule is selected -->
              <span
                v-if="selectedSchedule"
                class="text-sm flex gap-2 items-center justify-center cursor-pointer font-medium text-blue-900"
                @click="selectedSchedule = null"
              >
                <ArrowsRightLeftIcon class="w-4 h-4" /> Change Schedule
              </span>
            </div>

            <!-- Port A Schedules -->
            <div v-if="filteredSchedules.portA.length > 0" class="mb-8">
              <h4 class="text-sm font-semibold text-gray-600 mb-3">
                {{
                  selectedRoute.portA?.port_name || selectedRoute.portA?.name
                }}
                →
                {{
                  selectedRoute.portB?.port_name || selectedRoute.portB?.name
                }}
              </h4>
              <div class="grid grid-cols-4 gap-5">
                <button
                  v-for="time in filteredSchedules.portA"
                  :key="time.id"
                  @click="selectedSchedule = time"
                  :class="[
                    'p-3 text-center rounded-lg text-base border-2 transition-all duration-300',
                    selectedSchedule?.id === time.id
                      ? 'border-2 bg-blue-900 text-white'
                      : 'bg-white text-gray-700 border-gray-300 hover:shadow-[0_0_0_2px_#3b3b3b]',
                  ]"
                >
                  <div class="font-medium">{{ time.time }}</div>
                  <div class="text-xs opacity-75">{{ time.code }}</div>
                </button>
              </div>
            </div>

            <!-- Port B Schedules -->
            <div v-if="filteredSchedules.portB.length > 0" class="mb-8">
              <h4 class="text-sm font-semibold text-gray-600 mb-3">
                {{
                  selectedRoute.portB?.port_name || selectedRoute.portB?.name
                }}
                →
                {{
                  selectedRoute.portA?.port_name || selectedRoute.portA?.name
                }}
              </h4>
              <div class="grid grid-cols-4 gap-5">
                <button
                  v-for="time in filteredSchedules.portB"
                  :key="time.id"
                  @click="selectedSchedule = time"
                  :class="[
                    'p-3 text-center rounded-lg text-base border-2 transition-all duration-300',
                    selectedSchedule?.id === time.id
                      ? 'border-2 bg-blue-900 text-white'
                      : 'bg-white text-gray-700 border-gray-300 hover:shadow-[0_0_0_2px_#3b3b3b]',
                  ]"
                >
                  <div class="font-medium">{{ time.time }}</div>
                  <div class="text-xs opacity-75">{{ time.code }}</div>
                </button>
              </div>
            </div>

            <!-- No schedules message -->
            <div
              v-if="
                filteredSchedules.portA.length === 0 &&
                filteredSchedules.portB.length === 0
              "
              class="text-center py-8 text-gray-500"
            >
              <span v-if="selectedRoute">
                No schedules available for this route
              </span>
              <span v-else> Please select a route to view schedules </span>
            </div>
          </div>

          <div v-if="selectedSchedule">
            <h3 class="text-base font-medium text-gray-700 mb-3">
              Choose Passenger Category
            </h3>
            <div class="grid grid-cols-3 gap-5">
              <button
                v-for="category in passengerCategories"
                :key="category"
                @click="selectedCategory = category"
                :class="[
                  'p-3 text-center rounded-lg text-base border border-gray-300 transition-all duration-300',
                  selectedCategory === category
                    ? 'bg-blue-900 text-white font-medium'
                    : 'bg-white hover:shadow-[0_0_0_2px_#3b3b3b]',
                ]"
              >
                {{ category }}
              </button>
            </div>
          </div>

          <div v-if="selectedCategory">
            <h3 class="text-base font-medium text-gray-700 mb-3">
              Choose Passenger Type
            </h3>
            <div class="grid grid-cols-2 gap-5">
              <button
                v-for="type in passengerTypes"
                :key="type"
                @click="selectedType = type"
                :class="[
                  'p-3 text-center rounded-lg text-base border border-gray-300 transition-all duration-300',
                  selectedType === type
                    ? 'bg-blue-900 text-white font-medium'
                    : 'bg-white hover:shadow-[0_0_0_2px_#3b3b3b]',
                ]"
              >
                {{ type }}
              </button>
            </div>
          </div>
          <div v-if="selectedType">
            <h3 class="text-base font-medium text-gray-700 mb-3">
              Choose Passenger Accommodation
            </h3>
            <div class="grid grid-cols-2 gap-5">
              <button
                v-for="accommodation in accommodations"
                :key="accommodation"
                @click="selectedAccommodation = accommodation"
                :class="[
                  'p-3 text-center rounded-lg text-base border border-gray-300 transition-all duration-300',
                  selectedAccommodation === accommodation
                    ? 'bg-blue-900 text-white font-medium'
                    : 'bg-white hover:shadow-[0_0_0_2px_#3b3b3b]',
                ]"
              >
                {{ accommodation }}
              </button>
            </div>
          </div>

          <!-- Seatmap Display -->
          <div v-if="selectedAccommodation">
            <h3 class="text-base font-medium text-gray-700 mb-3">
              Select Your Seat
            </h3>

            <!-- Loading State -->
            <div v-if="loadingSeatmap" class="text-center py-8">
              <div
                class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"
              ></div>
              <p class="text-gray-600 mt-2">Loading seatmap...</p>
            </div>

            <!-- Seatmap -->
            <div
              v-else-if="availableSeats.length > 0"
              class="bg-white p-6 rounded-lg border border-gray-300"
            >
              <!-- Legend -->
              <div class="flex gap-4 mb-4 text-xs">
                <div class="flex items-center gap-1">
                  <div class="w-8 h-8 bg-green-500 rounded"></div>
                  <span>Available</span>
                </div>
                <div class="flex items-center gap-1">
                  <div class="w-8 h-8 bg-blue-900 rounded"></div>
                  <span>Selected</span>
                </div>
                <div class="flex items-center gap-1">
                  <div class="w-8 h-8 bg-gray-400 rounded"></div>
                  <span>Blocked/Path</span>
                </div>
              </div>

              <!-- Seats Grid -->
              <div
                class="grid gap-2"
                :style="{
                  gridTemplateColumns: `repeat(${Math.max(...availableSeats.map((s) => s.col)) + 1}, minmax(0, 1fr))`,
                }"
              >
                <button
                  v-for="seat in availableSeats"
                  :key="`${seat.row}-${seat.col}`"
                  @click="
                    !seat.blocked && !seat.path && !seat.facility
                      ? (selectedSeat = seat)
                      : null
                  "
                  :disabled="seat.blocked || seat.path || seat.facility"
                  :class="[
                    'w-10 h-10 rounded text-xs font-semibold transition-all duration-200',
                    seat.blocked || seat.path || seat.facility
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : selectedSeat?.seat_no === seat.seat_no
                        ? 'bg-blue-900 text-white shadow-lg scale-110'
                        : 'bg-green-500 text-white hover:bg-green-600 hover:scale-105 cursor-pointer',
                  ]"
                  :style="{ gridColumn: seat.col + 1, gridRow: seat.row + 1 }"
                  :title="seat.renaming || seat.seat_no"
                >
                  {{ seat.renaming || seat.seat_no }}
                </button>
              </div>

              <!-- Selected Seat Info -->
              <div
                v-if="selectedSeat"
                class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <p class="text-sm font-medium text-blue-900">
                  Selected Seat:
                  <span class="font-bold">{{
                    selectedSeat.renaming || selectedSeat.seat_no
                  }}</span>
                </p>
              </div>
            </div>

            <!-- No Seatmap Available -->
            <div
              v-else
              class="bg-gray-50 p-6 rounded-lg border border-gray-300 text-center"
            >
              <p class="text-gray-600">
                No seatmap available for this accommodation class.
              </p>
              <p class="text-sm text-gray-500 mt-1">
                Seat will be assigned automatically.
              </p>
            </div>
          </div>

          <div v-if="selectedAccommodation">
            <h3 class="text-base font-medium text-gray-700 mb-3">
              Passenger Information
            </h3>
            <div class="space-y-2">
              <label class="block text-sm text-gray-600">Fullname</label>
              <input
                type="text"
                v-model="fullname"
                placeholder="Enter Passenger Fullname"
                class="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:shadow-[0_0_0_2px_#155dfc]"
              />
            </div>
          </div>
          <div v-if="fullname" class="grid grid-cols-2 gap-5">
            <button
              v-for="gender in genders"
              :key="gender"
              @click="selectedGender = gender"
              :class="[
                'p-3 text-center rounded-lg text-base border border-gray-300 transition-all duration-300',
                selectedGender === gender
                  ? 'bg-blue-900 text-white font-medium'
                  : 'bg-white hover:shadow-[0_0_0_2px_#3b3b3b]',
              ]"
            >
              {{ gender }}
            </button>
          </div>
          <div v-if="selectedGender">
            <h3 class="text-base font-medium text-gray-700 mb-3">
              Choose Discount
            </h3>
            <div class="grid grid-cols-3 gap-5">
              <button
                v-for="discount in discounts"
                :key="discount.value"
                @click="selectedDiscount = discount.value"
                :class="[
                  'p-3 text-center rounded-lg text-base border border-gray-300 transition-all duration-300',
                  selectedDiscount === discount.value
                    ? 'bg-blue-900 text-white font-medium'
                    : 'bg-white hover:shadow-[0_0_0_2px_#3b3b3b]',
                ]"
              >
                {{ discount.label }}
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              *req. valid/soft ID for new entry
            </p>
          </div>
          <button
            v-if="selectedDiscount"
            @click="bookEntry"
            :class="[
              'w-full p-4 rounded-lg text-base font-medium transition-all duration-300',
              bookingActive
                ? 'bg-white shadow-border-brand-color font-medium'
                : 'bg-orange-500 text-white hover:bg-orange-600',
            ]"
          >
            Book Entry
          </button>
        </div>
        <div class="mt-8 mb-8">
          <h4
            class="step__instruction text-base font-medium text-gray-700 text-center"
          >
            {{ stepInstruction }}
          </h4>
        </div>
      </div>
    </div>
  </main>
</template>
