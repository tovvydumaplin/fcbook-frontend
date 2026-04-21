<script setup>
import { nextTick, ref, watch } from "vue";
import ModalPaymentSelection from "../components/Modals/Teller/ModalPaymentSelection.vue";
import VehicleSelection from "../components/Modals/Teller/VehicleSelection.vue";
import ViewTellerPassenger from "../components/Modals/Teller/ViewTellerPassenger.vue";
import IaModal from "../components/Modals/Teller/IaModal.vue";
import PassengerTypeModal from "../components/Modals/Teller/PassengerTypeModal.vue";
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
const isIaModalOpen = ref(false);
const isPassengerTypeModalOpen = ref(false);

// Store selected vehicle details from modal
const selectedVehicleDetails = ref(null);

// Store selected institutional account
const selectedInstitutionalAccount = ref(null);

// Store selected passenger type
const selectedPassengerTypeDetails = ref(null);

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

// Dynamic rates fetched from API
const dynamicRates = ref([]);
const loadingRates = ref(false);

// Fetch rates for selected route
const fetchRates = async (routeId) => {
  if (!routeId) {
    dynamicRates.value = [];
    return;
  }

  loadingRates.value = true;
  try {
    const stored = localStorage.getItem("token");
    const authHeader = stored?.startsWith("Bearer ")
      ? stored
      : `Bearer ${stored}`;

    const response = await fetch(
      `${apiBase}/accommodation-rates/route/${routeId}`,
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
      console.log("Rate API Response:", result);

      if (result.data?.accRates) {
        dynamicRates.value = result.data.accRates;
        console.log("Fetched rates:", dynamicRates.value);
      } else {
        console.error("No accRates found in response");
        dynamicRates.value = [];
      }
    } else {
      console.error("Failed to fetch rates, status:", response.status);
      dynamicRates.value = [];
    }
  } catch (err) {
    console.error("Error fetching rates:", err);
    dynamicRates.value = [];
  } finally {
    loadingRates.value = false;
  }
};

const getCurrentRate = () => {
  // Use dynamic rates if available
  if (dynamicRates.value && dynamicRates.value.length > 0) {
    const rateEntry = dynamicRates.value.find(
      (r) =>
        r.accommodation?.accommodation_name === selectedAccommodation.value,
    );
    if (rateEntry) {
      const rate = parseFloat(rateEntry.base_rate || 0);
      console.log(`Rate for ${selectedAccommodation.value}: ${rate}`);
      return rate;
    }
    console.log(`No rate found for ${selectedAccommodation.value}`);
  } else {
    console.log("No dynamic rates available");
  }

  // Return 0 if no rate found
  return 0;
};

const getCurrentAdminFee = () => {
  // Check if admin fee is waived for this passenger type
  if (selectedPassengerTypeDetails.value?.waived) {
    return 0;
  }

  const route = `${originPort.value} - ${destinationPort.value}`;
  const found = adminFees.find((r) => r.route === route);
  return found ? found.fee : 0;
};

const getDiscountAmount = (fare) => {
  let totalDiscount = 0;

  // Apply passenger type discount if selected
  if (selectedPassengerTypeDetails.value?.discount) {
    const passengerTypePercent = parseFloat(
      selectedPassengerTypeDetails.value.discount,
    );
    totalDiscount += fare * passengerTypePercent;
  }

  // Apply manual discount from dropdown
  if (selectedDiscount.value.endsWith("%")) {
    const percent = parseFloat(selectedDiscount.value) / 100;
    totalDiscount += fare * percent;
  }

  if (selectedDiscount.value === "100%") return fare;

  return totalDiscount;
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

    // Fetch rates for the selected route
    const routeId = newRoute.route_id || newRoute.id;
    if (routeId) {
      fetchRates(routeId);
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
    console.log("Schedule selected:", newSchedule);
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
  console.log(
    "Watch triggered - selectedAccommodation changed to:",
    newAccommodation,
  );
  console.log("Current schedule:", selectedSchedule.value);
  console.log("Vessel ID:", selectedSchedule.value?.vesselId);

  if (!newAccommodation || !selectedSchedule.value?.vesselId) {
    vesselSeatmap.value = null;
    availableSeats.value = [];
    selectedSeat.value = null;
    if (!newAccommodation) {
      console.log("No accommodation selected");
    } else if (!selectedSchedule.value?.vesselId) {
      console.log("No vessel ID found in schedule:", selectedSchedule.value);
    }
    return;
  }

  console.log(
    `Fetching seatmap for vessel ${selectedSchedule.value.vesselId}, accommodation: ${newAccommodation}`,
  );

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

    console.log("Seatmap fetch response status:", response.status);

    if (response.ok) {
      const result = await response.json();
      console.log("Seatmap API Response:", result);

      // Response structure: { name, status, classes: [...] }
      const classes = result.classes || [];
      vesselSeatmap.value = result;

      // Find the class that matches selected accommodation by name
      const selectedClass = classes.find((cls) => {
        const matchByName = cls.name === newAccommodation;
        console.log(`Checking class: ${cls.name} - Match: ${matchByName}`);
        return matchByName;
      });

      if (selectedClass) {
        // Get seats for this class
        availableSeats.value = selectedClass.seats || [];
        console.log(
          `✓ Found ${availableSeats.value.length} seats for ${newAccommodation}`,
        );
        console.log("First few seats:", availableSeats.value.slice(0, 5));

        // Mark seats as blocked if they're already assigned to passengers
        passengers.value.forEach((passenger) => {
          if (passenger.accommodation === newAccommodation && passenger.seat) {
            const seat = availableSeats.value.find(
              (s) => s.seat_no === passenger.seat,
            );
            if (seat) {
              seat.blocked = true;
            }
          }
        });
      } else {
        availableSeats.value = [];
        console.log(`✗ No class found matching ${newAccommodation}`);
        console.log(
          "Available classes:",
          classes.map((c) => c.name),
        );
      }
    } else {
      console.error("Failed to fetch seatmap, status:", response.status);
      const errorText = await response.text();
      console.error("Error response:", errorText);
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

// Compute facility labels from seats with facility property
const computeFacilityLabels = (seats) => {
  const facilityMap = {};
  const seatSize = 44;

  seats.forEach((s) => {
    if (s.facility) {
      if (!facilityMap[s.facility]) {
        facilityMap[s.facility] = { rows: [], cols: [] };
      }
      facilityMap[s.facility].rows.push(s.row);
      facilityMap[s.facility].cols.push(s.col);
    }
  });

  return Object.entries(facilityMap).map(([name, { rows, cols }]) => {
    const r1 = Math.min(...rows);
    const r2 = Math.max(...rows);
    const c1 = Math.min(...cols);
    const c2 = Math.max(...cols);
    return {
      name,
      top: r1 * seatSize,
      left: c1 * seatSize,
      width: (c2 - c1 + 1) * seatSize,
      height: (r2 - r1 + 1) * seatSize,
    };
  });
};

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

// Handle accommodation click with rate alert
const handleAccommodationClick = (accommodation) => {
  console.log("Accommodation clicked:", accommodation);
  selectedAccommodation.value = accommodation;

  // Calculate and show the rate
  const rate = getCurrentRate();
  console.log(`Selected: ${accommodation}, Rate: ₱${rate.toFixed(2)}`);
};

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
    institutionalAccount: selectedInstitutionalAccount.value,
    passengerTypeDetails: selectedPassengerTypeDetails.value,
  };

  // Handle seat blocking
  if (editingIndex.value !== null) {
    // When editing, unblock the old seat if it changed
    const oldSeat = passengers.value[editingIndex.value].seat;
    const newSeat = entry.seat;

    if (oldSeat !== newSeat) {
      // Unblock the old seat
      const oldSeatObj = availableSeats.value.find(
        (s) => s.seat_no === oldSeat,
      );
      if (oldSeatObj) {
        oldSeatObj.blocked = false;
      }

      // Block the new seat
      const newSeatObj = availableSeats.value.find(
        (s) => s.seat_no === newSeat,
      );
      if (newSeatObj) {
        newSeatObj.blocked = true;
      }
    }

    passengers.value[editingIndex.value] = entry;
    editingIndex.value = null;
  } else {
    // When adding new passenger, block the selected seat
    const seatToBlock = availableSeats.value.find(
      (s) => s.seat_no === entry.seat,
    );
    if (seatToBlock) {
      seatToBlock.blocked = true;
    }

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
  selectedInstitutionalAccount.value = null;
  selectedPassengerTypeDetails.value = null;
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
  selectedInstitutionalAccount.value = null;
  selectedPassengerTypeDetails.value = null;
  selectedDate.value = "";
  showSuccess.value = true;
  setTimeout(() => (showSuccess.value = false), 2000);
};

watch(selectedCategory, (newVal) => {
  if (newVal === "Driver") {
    isVehicleModalOpen.value = true;
  }
});

watch(selectedType, (newVal) => {
  if (newVal === "Institutional Account") {
    isIaModalOpen.value = true;
  } else if (newVal === "Regular Passenger") {
    isPassengerTypeModalOpen.value = true;
  }
});

const handleIaSelect = (ia) => {
  selectedInstitutionalAccount.value = ia;
  console.log("Selected IA:", ia);
  // You can add additional logic here, such as applying discounts
};

const handlePassengerTypeSelect = (type) => {
  selectedPassengerTypeDetails.value = type;
  console.log("Selected Passenger Type:", type);
  // Apply discount if available
  if (type.discount) {
    // Discount will be applied in fare calculation
  }
};

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
  // Unblock the seat before removing the passenger
  const passenger = passengers.value[idx];
  if (passenger && passenger.seat) {
    const seatToUnblock = availableSeats.value.find(
      (s) => s.seat_no === passenger.seat,
    );
    if (seatToUnblock) {
      seatToUnblock.blocked = false;
    }
  }

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

    // Set the selected seat for editing
    const seat = availableSeats.value.find((s) => s.seat_no === passenger.seat);
    if (seat) {
      selectedSeat.value = seat;
    }

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

  <!-- Institutional Account Modal -->
  <IaModal
    :isOpen="isIaModalOpen"
    @close="isIaModalOpen = false"
    @select="handleIaSelect"
  />

  <!-- Passenger Type Modal -->
  <PassengerTypeModal
    :isOpen="isPassengerTypeModalOpen"
    @close="isPassengerTypeModalOpen = false"
    @select="handlePassengerTypeSelect"
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

          <!-- Selected Vehicle Display -->
          <div
            v-if="selectedCategory === 'Driver' && selectedVehicleDetails"
            class="p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"
              >
                <svg
                  class="w-7 h-7 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-xs text-gray-600 font-medium">
                  Selected Vehicle
                </p>
                <p class="text-sm font-bold text-blue-900">
                  {{
                    selectedVehicleDetails.vehicle_class ||
                    selectedVehicleDetails.type ||
                    "Vehicle"
                  }}
                </p>
              </div>
              <button
                @click="isVehicleModalOpen = true"
                class="text-blue-600 hover:text-blue-800 text-xs font-medium"
              >
                Change
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

          <!-- Selected Passenger Type Display -->
          <div
            v-if="
              selectedType === 'Regular Passenger' &&
              selectedPassengerTypeDetails
            "
            class="p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-xs text-gray-600 font-medium">
                  Selected Passenger Type
                </p>
                <p class="text-sm font-bold text-blue-900 capitalize">
                  {{ selectedPassengerTypeDetails.type }}
                </p>
                <div class="flex items-center gap-2 mt-0.5">
                  <span
                    v-if="parseFloat(selectedPassengerTypeDetails.discount) > 0"
                    class="text-xs text-green-600 font-medium"
                  >
                    {{
                      (
                        parseFloat(selectedPassengerTypeDetails.discount) * 100
                      ).toFixed(0)
                    }}% Discount
                  </span>
                  <span
                    v-if="selectedPassengerTypeDetails.waived"
                    class="text-xs text-orange-600 font-medium"
                  >
                    Fee Waived
                  </span>
                </div>
              </div>
              <button
                @click="isPassengerTypeModalOpen = true"
                class="text-blue-600 hover:text-blue-800 text-xs font-medium"
              >
                Change
              </button>
            </div>
          </div>

          <!-- Selected Institutional Account Display -->
          <div
            v-if="
              selectedType === 'Institutional Account' &&
              selectedInstitutionalAccount
            "
            class="p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-lg overflow-hidden bg-white flex items-center justify-center"
              >
                <img
                  v-if="selectedInstitutionalAccount.ia_image"
                  :src="`${apiBase}/${selectedInstitutionalAccount.ia_image}`"
                  :alt="selectedInstitutionalAccount.ia_name"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-xl font-bold text-gray-400">
                  {{ selectedInstitutionalAccount.ia_name.charAt(0) }}
                </span>
              </div>
              <div class="flex-1">
                <p class="text-xs text-gray-600 font-medium">
                  Selected Institution
                </p>
                <p class="text-sm font-bold text-blue-900">
                  {{ selectedInstitutionalAccount.ia_name }}
                </p>
              </div>
              <button
                @click="isIaModalOpen = true"
                class="text-blue-600 hover:text-blue-800 text-xs font-medium"
              >
                Change
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
                @click="handleAccommodationClick(accommodation)"
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
              class="bg-white p-4 rounded-lg border border-gray-300"
            >
              <!-- Title and Selected Class -->
              <div class="flex items-center justify-center gap-3 mb-3">
                <p class="text-sm font-medium text-gray-700">Seatmap Preview</p>
                <span
                  class="px-3 py-1 bg-blue-900 text-white text-xs font-semibold rounded-full"
                >
                  {{ selectedAccommodation }}
                </span>
              </div>

              <!-- Legend -->
              <div class="flex items-center gap-4 mb-4 flex-wrap justify-center">
                <div class="flex items-center gap-1.5">
                  <span
                    class="w-4 h-4 rounded bg-white border border-gray-300 flex-shrink-0"
                  ></span>
                  <span class="text-xs text-gray-500">Available</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-4 h-4 rounded bg-red-600 flex-shrink-0"></span>
                  <span class="text-xs text-gray-500">Blocked</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-4 h-4 rounded bg-gray-200 flex-shrink-0"></span>
                  <span class="text-xs text-gray-500">Path</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-4 h-4 rounded bg-green-400 flex-shrink-0"></span>
                  <span class="text-xs text-gray-500">PWD</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span
                    class="w-4 h-4 rounded bg-orange-400 flex-shrink-0"
                  ></span>
                  <span class="text-xs text-gray-500">Facility</span>
                </div>
              </div>

              <!-- Seatmap Container -->
              <div
                class="relative h-[350px] overflow-auto border rounded-lg p-4 bg-white"
              >
                <div
                  class="relative select-none"
                  :style="{
                    width: Math.max(...availableSeats.map(s => s.col)) * 44 + 44 + 'px',
                    height: Math.max(...availableSeats.map(s => s.row)) * 44 + 44 + 'px',
                  }"
                >
                  <!-- Seats with Absolute Positioning -->
                  <div
                    v-for="seat in availableSeats"
                    :key="seat.seat_no"
                    :data-row="seat.row"
                    :data-col="seat.col"
                    class="absolute flex items-center justify-center border rounded-md text-xs font-medium cursor-pointer select-none transition-colors"
                    :style="{
                      width: '40px',
                      height: '40px',
                      top: seat.row * 44 + 2 + 'px',
                      left: seat.col * 44 + 2 + 'px',
                    }"
                    :class="{
                      'bg-red-600 border-red-700 text-white hover:bg-red-500':
                        seat.blocked,
                      'bg-gray-200 border-gray-300 text-gray-400 cursor-default':
                        seat.path && !seat.blocked,
                      'bg-orange-400 border-orange-500 text-white cursor-default':
                        seat.facility && !seat.blocked && !seat.path,
                      'bg-green-400 border-green-500 text-black':
                        seat.pwd && !seat.blocked && !seat.path && !seat.facility,
                      'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300':
                        !seat.blocked &&
                        !seat.path &&
                        !seat.facility &&
                        !seat.pwd &&
                        selectedSeat?.seat_no !== seat.seat_no,
                      'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400':
                        selectedSeat?.seat_no === seat.seat_no,
                    }"
                    @click="
                      !seat.blocked && !seat.path && !seat.facility && !seat.pwd
                        ? (selectedSeat = seat)
                        : null
                    "
                  >
                    <span v-if="seat.blocked" class="text-white font-bold text-sm pointer-events-none">✕</span>
                    <span v-else-if="!seat.path && !seat.facility" class="pointer-events-none">
                      {{ seat.seat_no }}
                    </span>
                  </div>

                  <!-- Facility labels overlay -->
                  <div
                    v-for="(facility, index) in computeFacilityLabels(availableSeats)"
                    :key="index"
                    class="absolute flex items-center justify-center text-white font-bold pointer-events-none bg-orange-500 rounded-md text-xs"
                    :style="{
                      top: facility.top + 2 + 'px',
                      left: facility.left + 2 + 'px',
                      width: facility.width - 4 + 'px',
                      height: facility.height - 4 + 'px',
                      zIndex: 10,
                    }"
                  >
                    {{ facility.name }}
                  </div>
                </div>
              </div>

              <!-- Selected Seat Info -->
              <div
                v-if="selectedSeat"
                class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <p class="text-sm font-medium text-blue-900">
                  Selected Seat:
                  <span class="font-bold">{{ selectedSeat.seat_no }}</span>
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
            <div class="text-xs text-gray-500 mt-1">
              <p>*req. valid/soft ID for new entry</p>
              <p
                v-if="
                  selectedPassengerTypeDetails?.discount &&
                  parseFloat(selectedPassengerTypeDetails.discount) > 0
                "
                class="text-green-600 font-medium mt-0.5"
              >
                ✓ Passenger Type Discount ({{
                  (
                    parseFloat(selectedPassengerTypeDetails.discount) * 100
                  ).toFixed(0)
                }}%) will be automatically applied
              </p>
              <p
                v-if="selectedPassengerTypeDetails?.waived"
                class="text-orange-600 font-medium mt-0.5"
              >
                ✓ Admin Fee Waived for this passenger type
              </p>
            </div>
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
