<script setup>
import { nextTick, ref, watch, computed, onMounted } from "vue";
import ModalPaymentSelection from "../components/Modals/Teller/ModalPaymentSelection.vue";
import VehicleSelection from "../components/Modals/Teller/VehicleSelection.vue";
import ViewTellerPassenger from "../components/Modals/Teller/ViewTellerPassenger.vue";
import IaModal from "../components/Modals/Teller/IaModal.vue";
import ModalBookingsList from "../components/Modals/Teller/ModalBookingsList.vue";
import TellerHeader from "../components/TellerHeader.vue";
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
const showPaymentSuccess = ref(false);
const paymentSuccessData = ref(null);
const isIaModalOpen = ref(false);
const isDriverSelectionOpen = ref(false);
const isBookingsModalOpen = ref(false);
// Selected vehicle for driver assignment
const selectedVehicleForDriver = ref(null);

// Active tab for Passenger/Vehicle selection
const activeTab = ref("Passenger");

// I.A checkbox state
const isInstitutionalAccount = ref(false);

// Store selected vehicle details from modal
const selectedVehicleDetails = ref(null);

// Store selected institutional account
const selectedInstitutionalAccount = ref(null);

// Store selected passenger type
const selectedPassengerTypeDetails = ref(null);

// Store regular passenger type for auto-selection
const regularPassengerType = ref(null);

// All passenger types fetched from API
const allPassengerTypes = ref([]);

// Serial Number - Auto-generated
const serialNo = ref("");

// Shared booking IDs for the transaction
const sharedBookingId = ref(null);
const sharedScheduleBookingId = ref(null);

// Agent ID (logged-in user/teller)
const agentId = ref(null);

// Passenger categories (Economy, Business, etc.)
const passengerCategories = ref([]);

// Selected payment method
const selectedPaymentMethod = ref(null);

// Active serial number tab for filtering bookings
const activeSerialTab = ref(null);

// Generate serial number
const generateSerialNo = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  serialNo.value = `BK-${timestamp}-${random}`;
  // Set this as the active tab when generating a new serial
  activeSerialTab.value = serialNo.value;
};

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
    
    if (!stored) {
      console.warn("No token found, skipping fetch rates");
      loadingRates.value = false;
      return;
    }
    
    const authHeader = stored.startsWith("Bearer ")
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

const outboundDate = ref("");
const returnDate = ref("");

const passengers = ref([]);
const vehicles = ref([]);

// List of incomplete bookings — drives the serial number tabs
const bookings = ref([]);

const bookVehicleEntry = async () => {
  if (!selectedVehicleDetails.value) return;

  // Build API request body
  const requestBody = {
    serial_no: activeSerialTab.value || serialNo.value,
    travel_date: outboundDate.value,
    schedule_id: outboundSchedule.value?.schedule_id || outboundSchedule.value?.id,
    schedule_snapshot: outboundSchedule.value?.time || outboundSchedule.value,
    route_id: selectedRoute.value?.route_id || selectedRoute.value?.id,
    route_snapshot: `${originPort.value} - ${destinationPort.value}`,
    vessel_snapshot: outboundSchedule.value?.vessel?.vessel_name || outboundSchedule.value?.vessel?.name || outboundSchedule.value?.code || null,
    vehicle_type: selectedVehicleDetails.value.vehicle_class || selectedVehicleDetails.value.type,
    fare: parseFloat(selectedVehicleDetails.value.rate || 0),
    plate_no: selectedVehicleDetails.value.plate_number,
    length: null,
    weight: null,
    driver_passenger_booking_id: null,
    institutional_account_id: selectedInstitutionalAccount.value?.ia_id || selectedInstitutionalAccount.value?.id || null,
    institutional_account_snapshot: selectedInstitutionalAccount.value?.ia_name || null,
    booking_id: sharedBookingId.value,
    schedule_booking_id: outboundSchedule.value?.schedule_id || outboundSchedule.value?.id,
    is_return_trip: returnTrip.value || false,
  };

  console.log("Booking vehicle:", requestBody);

  try {
    const stored = localStorage.getItem("token");
    
    if (!stored) {
      alert("Authentication required. Please log in again.");
      return;
    }
    
    const authHeader = stored.startsWith("Bearer ") ? stored : `Bearer ${stored}`;

    const response = await fetch(`${apiBase}/teller-booking/booked-vehicles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Book vehicle response:", result);

      // Refresh booking details + tab list
      const activeSerial = activeSerialTab.value || serialNo.value;
      await fetchBookingDetails(activeSerial);
      await fetchBookings();

      // Try to extract booking IDs from latest vehicle in filtered list
      const latestVehicle = filteredVehicles.value[filteredVehicles.value.length - 1];
      if (latestVehicle) {
        // Store shared IDs for subsequent bookings
        if (!sharedBookingId.value && latestVehicle.bookingId) {
          sharedBookingId.value = latestVehicle.bookingId;
        }
        if (!sharedScheduleBookingId.value && latestVehicle.scheduleBookingId) {
          sharedScheduleBookingId.value = latestVehicle.scheduleBookingId;
        }
      }

      showSuccess.value = true;
      setTimeout(() => (showSuccess.value = false), 2000);

      // Reset vehicle selection
      selectedVehicleDetails.value = null;

      // Switch back to Passenger tab
      activeTab.value = "Passenger";
    } else {
      const error = await response.json();
      alert("API Error: " + (error.message || response.statusText));
      console.error("Book vehicle failed:", error);
    }
  } catch (err) {
    console.error("Error booking vehicle:", err);
    alert("Network error: " + err.message);
  }
};

const outboundSchedule = ref(null);
const returnSchedule = ref(null);
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
const isManualSeatSelection = ref(false);

// Clear selected schedule when route changes
watch(selectedRoute, (newRoute) => {
  outboundSchedule.value = null;
  returnSchedule.value = null;
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
  outboundSchedule.value = null;
  returnSchedule.value = null;
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

// Update origin/destination when outbound schedule is selected
watch(outboundSchedule, (newSchedule) => {
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
// Fetch booked/locked seats from backend for the current schedule + date
const fetchBookedSeats = async () => {
  const scheduleId = outboundSchedule.value?.schedule_id ?? outboundSchedule.value?.id;
  const travelDate = outboundDate.value;

  console.log("🔍 fetchBookedSeats called", {
    scheduleId,
    travelDate,
    rawSchedule: outboundSchedule.value,
  });

  if (!scheduleId || !travelDate) {
    console.warn("⚠️ fetchBookedSeats: missing scheduleId or travelDate — skipping");
    return null;
  }

  try {
    const stored = localStorage.getItem("token");
    if (!stored) return null;
    const authHeader = stored.startsWith("Bearer ") ? stored : `Bearer ${stored}`;

    const url = `${apiBase}/teller-booking/booked-seats?schedule_id=${scheduleId}&travel_date=${travelDate}`;
    console.log("📡 booked-seats request:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log("✅ booked-seats response:", {
        total_locked: result.data?.total_locked,
        total_booked: result.data?.total_booked,
        total_unavailable: result.data?.total_unavailable,
        locked_seats: result.data?.locked_seats,
        booked_seats: result.data?.booked_seats,
        seat_status_map: result.data?.seat_status_map,
      });
      return result.data?.seat_status_map ?? null;
    } else {
      console.error("❌ booked-seats fetch failed:", response.status);
    }
  } catch (err) {
    console.error("Error fetching booked seats:", err);
  }
  return null;
};

// Apply backend seat_status_map onto availableSeats — mark booked/locked as blocked
const markBackendBlockedSeats = async () => {
  const statusMap = await fetchBookedSeats();

  if (!statusMap) {
    console.warn("⚠️ markBackendBlockedSeats: no seat_status_map returned");
    return;
  }

  const occupiedIds = Object.keys(statusMap);
  console.log(`🪑 seat_status_map has ${occupiedIds.length} occupied seat(s):`, occupiedIds);

  let blockedCount = 0;
  availableSeats.value.forEach((seat) => {
    const key = String(seat.id ?? seat.seat_id);
    const seatStatus = statusMap[key];
    if (seatStatus && (seatStatus.status === "booked" || seatStatus.status === "locked")) {
      seat.blocked = true;
      blockedCount++;
      console.log(`🚫 Blocked seat ${seat.seat_no} (id=${key}) — status: ${seatStatus.status}`);
    }
  });

  console.log(`✅ markBackendBlockedSeats done — ${blockedCount} seat(s) blocked out of ${availableSeats.value.length} in class`);
};

watch(selectedAccommodation, async (newAccommodation) => {
  console.log("🛋️ selectedAccommodation →", newAccommodation);
  console.log("📅 outboundDate:", outboundDate.value);
  console.log("🗓️ outboundSchedule:", outboundSchedule.value);
  console.log("🚢 vesselId:", outboundSchedule.value?.vesselId);

  if (!newAccommodation || !outboundSchedule.value?.vesselId) {
    vesselSeatmap.value = null;
    availableSeats.value = [];
    selectedSeat.value = null;
    if (!newAccommodation) {
      console.warn("⚠️ Seatmap skipped: no accommodation selected");
    } else {
      console.warn("⚠️ Seatmap skipped: vesselId is missing from schedule. Full schedule object:", JSON.parse(JSON.stringify(outboundSchedule.value ?? {})));
    }
    return;
  }

  console.log(
    `Fetching seatmap for vessel ${outboundSchedule.value.vesselId}, accommodation: ${newAccommodation}`,
  );

  loadingSeatmap.value = true;
  try {
    const stored = localStorage.getItem("token");
    
    if (!stored) {
      console.warn("No token found, skipping fetch seatmap");
      loadingSeatmap.value = false;
      return;
    }
    
    const authHeader = stored.startsWith("Bearer ")
      ? stored
      : `Bearer ${stored}`;

    const response = await fetch(
      `${apiBase}/vessels/${outboundSchedule.value.vesselId}/layout`,
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
        console.log(`✓ Found ${availableSeats.value.length} seats for ${newAccommodation}`);
        console.log("🪑 First 5 raw seats from layout (check id/seat_id field):", JSON.parse(JSON.stringify(availableSeats.value.slice(0, 5))));

        // 1. Block seats already taken in the current local session
        passengers.value.forEach((passenger) => {
          if (passenger.accommodation === newAccommodation && passenger.seat) {
            const seat = availableSeats.value.find(
              (s) => s.seat_no === passenger.seat,
            );
            if (seat) seat.blocked = true;
          }
        });

        // 2. Block seats that are booked/locked on the backend
        await markBackendBlockedSeats();

        // 3. Auto-select the first available seat
        const firstAvailable = availableSeats.value.find(
          (s) => !s.blocked && !s.path && !s.facility && !s.pwd
        );
        if (firstAvailable) {
          selectedSeat.value = firstAvailable;
          console.log("Auto-selected seat:", firstAvailable.seat_no);
        }
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
    isManualSeatSelection.value = false;
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

// Prepare booking data for backend
const prepareBookingData = () => {
  // Calculate admin fee: 2 pesos per passenger, 25 pesos per vehicle
  const totalAdminFee = (filteredPassengers.value.length * 2) + (filteredVehicles.value.length * 25);
  
  // Calculate totals using filtered lists (active serial tab only)
  const passengerTotal = filteredPassengers.value.reduce((sum, p) => {
    return sum + parseFloat(p.fare);
  }, 0);

  const vehicleTotal = filteredVehicles.value.reduce((sum, v) => {
    return sum + (parseFloat(v.vehicle?.rate || 0));
  }, 0);

  const totalAmount = passengerTotal + vehicleTotal + totalAdminFee;

  const bookingData = {
    metadata: {
      route: `${originPort.value} - ${destinationPort.value}`,
      routeId: selectedRoute.value?.route_id || selectedRoute.value?.id || null,
      outboundDate: outboundDate.value,
      outboundSchedule: outboundSchedule.value?.time || outboundSchedule.value,
      scheduleId: outboundSchedule.value?.schedule_id || outboundSchedule.value?.id || null,
      vesselId: outboundSchedule.value?.vesselId || outboundSchedule.value?.vessel_id || null,
      returnTrip: returnTrip.value,
      returnDate: returnDate.value || null,
      returnSchedule: returnSchedule.value?.time || returnSchedule.value || null,
      bookingDate: new Date().toISOString(),
    },
    passengers: filteredPassengers.value.map((p) => ({
      fullname: p.fullname,
      type: p.type || p.passengerTypeDetails?.type || "",
      typeDetails: p.passengerTypeDetails,
      accommodation: p.accommodation,
      gender: p.gender,
      seat: p.seat,
      discount: p.discount,
      discountAmount: parseFloat(p.discountAmount),
      fare: parseFloat(p.fare),
      adminFee: 2, // 2 pesos per passenger
      cargoFare: parseFloat(p.cargoFare),
      subtotal: parseFloat(p.fare) + 2,
      institutionalAccount: p.institutionalAccount ? {
        id: p.institutionalAccount.ia_id || p.institutionalAccount.id,
        name: p.institutionalAccount.ia_name,
      } : null,
    })),
    vehicles: filteredVehicles.value.map((v) => ({
      vehicleClass: v.vehicle.vehicle_class || v.vehicle.type,
      plateNumber: v.vehicle.plate_number,
      vehicleType: v.vehicle.type,
      fare: parseFloat(v.vehicle.rate || 0),
      adminFee: 25, // 25 pesos per vehicle
      driver: v.driver ? {
        fullname: v.driver.fullname,
        type: v.driver.type,
        seat: v.driver.seat,
      } : null,
      institutionalAccount: v.institutionalAccount ? {
        id: v.institutionalAccount.ia_id || v.institutionalAccount.id,
        name: v.institutionalAccount.ia_name,
      } : null,
    })),
    summary: {
      passengerCount: filteredPassengers.value.length,
      vehicleCount: filteredVehicles.value.length,
      passengerTotal: parseFloat(passengerTotal.toFixed(2)),
      vehicleTotal: parseFloat(vehicleTotal.toFixed(2)),
      totalAdminFee: totalAdminFee,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      totalDiscount: filteredPassengers.value.reduce((sum, p) => sum + parseFloat(p.discountAmount), 0),
    },
  };

  return bookingData;
};

const proceedToPayment = () => {
  const bookingData = prepareBookingData();
  
  // Debug: Log schedule structure
  console.log("=== DEBUG INFO ===");
  console.log("outboundSchedule:", outboundSchedule.value);
  console.log("==================");
  
  console.log("=== BOOKING DATA ===");
  console.log(JSON.stringify(bookingData, null, 2));
  console.log("===================");
  
  // Open payment modal
  isPaymentModalOpen.value = true;
};

// Populate date/schedule/route from a given serial's booking data.
// Fetches detail only if the serial exists in the bookings list (i.e. has backend data).
const applySerialContext = async (serial) => {
  // Only fetch if this serial has been saved to the backend
  const bookingSummary = bookings.value.find(b => b.serial_no === serial);
  if (bookingSummary) {
    await fetchBookingDetails(serial);
  }

  // Prefer detail from passengers/vehicles, fall back to bookings list summary
  const firstBooking =
    passengers.value.find(p => p.serialNo === serial) ||
    vehicles.value.find(v => v.serialNo === serial);

  // Set travel date
  if (firstBooking?.date) {
    outboundDate.value = firstBooking.date;
  } else if (bookingSummary?.travel_date) {
    outboundDate.value = bookingSummary.travel_date.split("T")[0];
  } else {
    outboundDate.value = new Date().toISOString().split("T")[0];
  }

  // Set route
  const routeId = firstBooking?.routeId ?? bookingSummary?.route_id;
  if (routeId) {
    const matchedRoute = routes.value.find(r => r.route_id === Number(routeId));
    if (matchedRoute) selectedRoute.value = matchedRoute;
  }

  // watch(selectedRoute) clears outboundSchedule — wait for it before setting
  await nextTick();

  // Set schedule
  const scheduleId = firstBooking?.scheduleBookingId ?? bookingSummary?.schedule_id;
  const scheduleTime = firstBooking?.schedule ?? bookingSummary?.schedule_snapshot;
  if (scheduleId) {
    const targetId = Number(scheduleId);
    const matched =
      allSchedules.value.find(s => Number(s.id) === targetId) ||
      allSchedules.value.find(s => s.time === scheduleTime);
    if (matched) outboundSchedule.value = matched;
  }
};

// Re-apply when user switches serial tabs
watch(activeSerialTab, (serial) => {
  if (serial) applySerialContext(serial);
});

onMounted(async () => {
  // Don't generate serial yet - will select latest or generate after fetching
  
  // Get agent ID from logged-in user
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  agentId.value = user.id || user.user_id || null;
  
  // Fetch discounts
  fetchDiscounts();
  
  // Fetch passenger types and auto-select Regular
  fetchPassengerTypes();
  
  // Fetch passenger categories (accommodations)
  fetchPassengerCategories();
  
  // Fetch incomplete bookings list (tab list)
  await fetchBookings();

  // After fetching, select latest serial or generate new
  if (bookings.value.length > 0) {
    // API returns bookings ordered by created_at desc; pick the first
    const latestSerial = bookings.value[0].serial_no;
    serialNo.value = latestSerial;
    activeSerialTab.value = latestSerial;
    console.log("Auto-selected latest serial:", latestSerial);
    // Load full detail for the active tab
    await fetchBookingDetails(latestSerial);
  } else {
    // No existing bookings, generate new serial
    generateSerialNo();
    console.log("No existing bookings, generated new serial:", serialNo.value);
  }
  
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

      // Initial population for the active serial
      applySerialContext(activeSerialTab.value);
    } else {
      console.error("Failed to fetch routes:", result.message || result);
    }
  } catch (err) {
    console.error("Failed to fetch routes:", err);
  }
});

const accommodations = [
  "Business Class",
  "Premium Economy",
  "Economy",
  "Senior/PWD",
];
const genders = ["Male", "Female"];
const discounts = ref([
  { label: "No Discount", value: "0", percent: "0%" },
]);

// Fetch discounts from API
const fetchDiscounts = async () => {
  try {
    const stored = localStorage.getItem("token");
    
    if (!stored) {
      console.warn("No token found, skipping fetch discounts");
      return;
    }
    
    const authHeader = stored.startsWith("Bearer ")
      ? stored
      : `Bearer ${stored}`;

    const response = await fetch(`${apiBase}/discounts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Discounts Response:", result);

      if (result.success && result.data?.discounts) {
        const apiDiscounts = result.data.discounts
          .filter(d => d.status === 1) // Only active discounts
          .map(d => ({
            label: d.discount_name,
            value: `${parseFloat(d.discount_value)}%`,
            percent: `${parseFloat(d.discount_value)}%`,
            code: d.discount_code,
            id: d.discount_id,
          }));
        
        // Always keep "No Discount" as first option
        discounts.value = [
          { label: "No Discount", value: "0", percent: "0%" },
          ...apiDiscounts,
        ];
        
        console.log("Loaded discounts:", discounts.value);
      }
    } else {
      console.error("Failed to fetch discounts:", response.status);
    }
  } catch (err) {
    console.error("Error fetching discounts:", err);
  }
};

// Fetch passenger types and auto-select Regular
const fetchPassengerTypes = async () => {
  try {
    const stored = localStorage.getItem("token");
    
    if (!stored) {
      console.warn("No token found, skipping fetch passenger types");
      return;
    }
    
    const authHeader = stored.startsWith("Bearer ")
      ? stored
      : `Bearer ${stored}`;

    const response = await fetch(`${apiBase}/passenger-types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Passenger Types Response:", result);

      if (result.success && result.data?.types) {
        allPassengerTypes.value = result.data.types.filter(t => t.status === 1);

        // Find and auto-select "Regular" passenger type
        const regularType = allPassengerTypes.value.find(
          (type) => type.type.toLowerCase() === "regular"
        );

        if (regularType) {
          regularPassengerType.value = regularType;
          selectedPassengerTypeDetails.value = regularType;
          console.log("Auto-selected Regular passenger type:", regularType);
        }
      }
    } else {
      console.error("Failed to fetch passenger types:", response.status);
    }
  } catch (err) {
    console.error("Error fetching passenger types:", err);
  }
};

// Fetch passenger categories (accommodations like Economy, Business, etc.)
const fetchPassengerCategories = async () => {
  try {
    const stored = localStorage.getItem("token");
    
    if (!stored) {
      console.warn("No token found, skipping fetch passenger categories");
      return;
    }
    
    const authHeader = stored.startsWith("Bearer ")
      ? stored
      : `Bearer ${stored}`;

    const response = await fetch(`${apiBase}/passenger-categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Passenger Categories Response:", result);

      if (result.success && result.data?.categories) {
        passengerCategories.value = result.data.categories;
      }
    } else {
      console.error("Failed to fetch passenger categories:", response.status);
    }
  } catch (err) {
    console.error("Error fetching passenger categories:", err);
  }
};

// Fetch list of incomplete bookings — populates serial number tabs
const fetchBookings = async () => {
  try {
    const stored = localStorage.getItem("token");
    if (!stored) {
      console.warn("No token found, skipping fetchBookings");
      return;
    }
    const authHeader = stored.startsWith("Bearer ") ? stored : `Bearer ${stored}`;

    const response = await fetch(`${apiBase}/teller-booking/bookings`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: authHeader },
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Fetched bookings list:", result);
      if (result.data?.bookings) {
        bookings.value = result.data.bookings;
      }
    } else {
      console.error("Failed to fetch bookings list:", response.status);
    }
  } catch (err) {
    console.error("Error fetching bookings list:", err);
  }
};

// Fetch full detail for a single serial — populates passengers + vehicles for that tab
const fetchBookingDetails = async (serial) => {
  if (!serial) return;
  try {
    const stored = localStorage.getItem("token");
    if (!stored) {
      console.warn("No token found, skipping fetchBookingDetails");
      return;
    }
    const authHeader = stored.startsWith("Bearer ") ? stored : `Bearer ${stored}`;

    const response = await fetch(`${apiBase}/teller-booking/bookings/${serial}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: authHeader },
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`Fetched booking details for ${serial}:`, result);
      const booking = result.data?.booking;
      if (!booking) return;

      // Map passengers
      const mappedPassengers = (booking.passengers || []).map((p) => ({
        date: booking.travel_date?.split("T")[0] ?? "",
        route: booking.route_snapshot ?? "",
        schedule: booking.schedule_snapshot ?? "",
        category: "Passenger",
        type: p.passenger_type_snapshot,
        accommodation: p.passenger_category_snapshot,
        gender: p.gender,
        discount: p.discount_id ? String(p.discount_id) : "0",
        fullname: p.fullname,
        seat: p.seat_number_snapshot,
        fare: parseFloat(p.fare || 0).toFixed(2),
        cargoFare: "0.00",
        adminFee: "0.00",
        discountAmount: parseFloat(p.discount_amount || 0).toFixed(2),
        vehicle: null,
        institutionalAccount: booking.institutional_account_id
          ? { id: booking.institutional_account_id, ia_name: booking.institutional_account_snapshot }
          : null,
        passengerTypeDetails: { type: p.passenger_type_snapshot },
        bookedPassengerId: p.booked_passenger_id,
        bookingId: p.temp_booking_id,
        scheduleBookingId: booking.schedule_id ?? null,
        scheduleId: booking.schedule_id ?? null,
        routeId: booking.route_id ?? null,
        serialNo: booking.serial_no,
      }));

      // Map vehicles — driver resolved from mappedPassengers
      const mappedVehicles = (booking.vehicles || []).map((v) => {
        let driverInfo = null;
        if (v.driver_passenger_booking_id) {
          const driverPassenger = mappedPassengers.find(
            (p) => String(p.bookedPassengerId) === String(v.driver_passenger_booking_id)
          );
          if (driverPassenger) {
            driverInfo = {
              id: v.driver_passenger_booking_id,
              fullname: driverPassenger.fullname,
              type: driverPassenger.type,
              gender: driverPassenger.gender,
            };
          } else {
            driverInfo = { id: v.driver_passenger_booking_id };
          }
        }
        return {
          date: booking.travel_date?.split("T")[0] ?? "",
          route: booking.route_snapshot ?? "",
          schedule: booking.schedule_snapshot ?? "",
          vehicle: {
            vehicle_class: v.vehicle_type,
            plate_number: v.plate_no,
            rate: parseFloat(v.fare || 0),
          },
          institutionalAccount: booking.institutional_account_id
            ? { id: booking.institutional_account_id }
            : null,
          driver: driverInfo,
          bookedVehicleId: v.booked_vehicle_id,
          bookingId: v.temp_booking_id,
          scheduleBookingId: booking.schedule_id ?? null,
          scheduleId: booking.schedule_id ?? null,
          routeId: booking.route_id ?? null,
          serialNo: booking.serial_no,
        };
      });

      // Replace passengers/vehicles for this serial only, keeping others intact
      passengers.value = [
        ...passengers.value.filter(p => p.serialNo !== serial),
        ...mappedPassengers,
      ];
      vehicles.value = [
        ...vehicles.value.filter(v => v.serialNo !== serial),
        ...mappedVehicles,
      ];
    } else {
      console.error(`Failed to fetch booking details for ${serial}:`, response.status);
    }
  } catch (err) {
    console.error("Error fetching booking details:", err);
  }
};

// Handle accommodation click with rate alert
const handleAccommodationClick = (accommodation) => {
  console.log("Accommodation clicked:", accommodation);
  selectedAccommodation.value = accommodation;

  // Calculate and show the rate
  const rate = getCurrentRate();
  console.log(`Selected: ${accommodation}, Rate: ₱${rate.toFixed(2)}`);
};

const bookEntry = async () => {
  const fare = getCurrentRate();
  const adminFee = getCurrentAdminFee();
  const discountValue = selectedDiscount.value || "0";
  const discountAmount = getDiscountAmount(fare);
  const discountedFare = fare - discountAmount;

  // Get passenger category ID from accommodation name
  const passengerCategory = passengerCategories.value.find(
    (cat) => cat.name === selectedAccommodation.value || cat.category_name === selectedAccommodation.value
  );

  // Build API request body
  const requestBody = {
    serial_no: activeSerialTab.value || serialNo.value,
    travel_date: outboundDate.value,
    schedule_id: outboundSchedule.value?.schedule_id || outboundSchedule.value?.id,
    schedule_snapshot: outboundSchedule.value?.time || outboundSchedule.value,
    route_id: selectedRoute.value?.route_id || selectedRoute.value?.id,
    route_snapshot: `${originPort.value} - ${destinationPort.value}`,
    vessel_snapshot: outboundSchedule.value?.vessel?.vessel_name || outboundSchedule.value?.vessel?.name || outboundSchedule.value?.code || null,
    fullname: fullname.value,
    passenger_type_id: selectedPassengerTypeDetails.value?.p_id || selectedPassengerTypeDetails.value?.id,
    passenger_type_snapshot: selectedPassengerTypeDetails.value?.type || "Regular",
    fare: parseFloat(discountedFare.toFixed(2)),
    gender: selectedGender.value.toLowerCase(),
    passenger_category_id: passengerCategory?.id || passengerCategory?.category_id || null,
    passenger_category_snapshot: selectedAccommodation.value,
    seat_id: selectedPassengerTypeDetails.value?.has_seat !== false ? (selectedSeat.value?.id || selectedSeat.value?.seat_id || null) : null,
    seat_number_snapshot: selectedPassengerTypeDetails.value?.has_seat !== false ? (selectedSeat.value?.seat_no || "N/A") : null,
    discount_amount: parseFloat(discountAmount.toFixed(2)),
    discount_id: null,
    institutional_account_id: selectedInstitutionalAccount.value?.ia_id || selectedInstitutionalAccount.value?.id || null,
    institutional_account_snapshot: selectedInstitutionalAccount.value?.ia_name || null,
    booking_id: sharedBookingId.value,
    schedule_booking_id: outboundSchedule.value?.schedule_id || outboundSchedule.value?.id,
    is_return_trip: returnTrip.value || false,
  };

  console.log("Booking passenger:", requestBody);

  try {
    const stored = localStorage.getItem("token");
    
    if (!stored) {
      alert("Authentication required. Please log in again.");
      return;
    }
    
    const authHeader = stored.startsWith("Bearer ") ? stored : `Bearer ${stored}`;

    const response = await fetch(`${apiBase}/teller-booking/booked-passengers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Book passenger response:", result);

      // Refresh booking details + tab list
      const activeSerial = activeSerialTab.value || serialNo.value;
      const prevFilteredCount = filteredPassengers.value.length;
      await fetchBookingDetails(activeSerial);
      await fetchBookings();
      const newFilteredCount = filteredPassengers.value.length;

      if (newFilteredCount > prevFilteredCount) {
        // Passenger was created successfully
        const newPassenger = filteredPassengers.value[filteredPassengers.value.length - 1];

        // Store shared IDs for subsequent bookings
        if (!sharedBookingId.value && newPassenger.bookingId) {
          sharedBookingId.value = newPassenger.bookingId;
        }
        if (!sharedScheduleBookingId.value && newPassenger.scheduleBookingId) {
          sharedScheduleBookingId.value = newPassenger.scheduleBookingId;
        }

        // Block the selected seat
        if (selectedSeat.value) {
          const seatToBlock = availableSeats.value.find(
            (s) => s.seat_no === selectedSeat.value.seat_no,
          );
          if (seatToBlock) {
            seatToBlock.blocked = true;
          }
        }

        showSuccess.value = true;
        setTimeout(() => (showSuccess.value = false), 2000);

        // Reset form fields
        fullname.value = "";
        selectedDiscount.value = "0";
        selectedCategory.value = "Passenger";
        selectedAccommodation.value = "";
        selectedGender.value = "";
        selectedType.value = "Regular Passenger";
        selectedVehicleDetails.value = null;
        selectedInstitutionalAccount.value = null;
        selectedPassengerTypeDetails.value = regularPassengerType.value;
        selectedSeat.value = null;
        isManualSeatSelection.value = false;
      } else {
        // Booking failed
        alert("Failed to book passenger: " + (result.message || result.error || "Unknown error"));
      }
    } else {
      const error = await response.json();
      alert("API Error: " + (error.message || response.statusText));
      console.error("Book passenger failed:", error);
    }
  } catch (err) {
    console.error("Error booking passenger:", err);
    alert("Network error: " + err.message);
  }
};

const resetForm = () => {
  fullname.value = "";
  selectedDiscount.value = "0";
  selectedCategory.value = "Passenger";
  selectedAccommodation.value = "";
  selectedGender.value = "";
  selectedType.value = "Regular Passenger";
  // Don't clear passengers/vehicles - they contain API data
  // passengers.value = [];
  // vehicles.value = [];
  selectedVehicleDetails.value = null;
  selectedInstitutionalAccount.value = null;
  selectedPassengerTypeDetails.value = regularPassengerType.value; // Reset to Regular
  // Don't clear dates - keep them for the current booking session
  // outboundDate.value = "";
  // returnDate.value = "";
  activeTab.value = "Passenger";
  isInstitutionalAccount.value = false;
  isManualSeatSelection.value = false;
  
  // Don't reset shared booking IDs - they're for the current serial
  // sharedBookingId.value = null;
  // sharedScheduleBookingId.value = null;
  
  // Don't generate new serial - this is just clearing the form
  // generateSerialNo();
  
  showSuccess.value = true;
  setTimeout(() => (showSuccess.value = false), 2000);
};

// Watcher removed - tab changes now handle modal opening directly

const handleIaSelect = (ia) => {
  selectedInstitutionalAccount.value = ia;
  isInstitutionalAccount.value = true;
  console.log("Selected IA:", ia);
  // You can add additional logic here, such as applying discounts
};

// Handle I.A checkbox change
const handleIaCheckboxChange = () => {
  if (isInstitutionalAccount.value) {
    isIaModalOpen.value = true;
  } else {
    selectedInstitutionalAccount.value = null;
  }
};

// Handle I.A modal close - uncheck if no selection
watch(isIaModalOpen, (isOpen) => {
  if (!isOpen && !selectedInstitutionalAccount.value) {
    isInstitutionalAccount.value = false;
  }
});

const handlePassengerTypeSelect = (type) => {
  selectedPassengerTypeDetails.value = type;
  console.log("Selected Passenger Type:", type);
  // Apply discount if available
  if (type.discount) {
    // Discount will be applied in fare calculation
  }
};

const handlePaymentSelected = (method) => {
  selectedPaymentMethod.value = method;
  console.log("Payment method selected:", method);
};

const handlePrintingSelected = async (option, referenceNumber = null) => {
  if (option === "e-ticket" || option.id === "eticket") {
    console.log("E-Ticket selected, processing payment...");
    
    // Validation checks - use filtered lists for active serial
    if (filteredPassengers.value.length === 0 && filteredVehicles.value.length === 0) {
      alert("Please add at least one passenger or vehicle before proceeding to payment.");
      return;
    }

    // Try to get booking_id from existing passengers or vehicles (filtered), or generate random one
    let bookingIdToUse = sharedBookingId.value;
    
    if (!bookingIdToUse) {
      // Try from passengers (filtered by active serial)
      const passengerWithBookingId = filteredPassengers.value.find(p => p.bookingId);
      if (passengerWithBookingId) {
        bookingIdToUse = passengerWithBookingId.bookingId;
        sharedBookingId.value = bookingIdToUse;
      }
    }
    
    if (!bookingIdToUse) {
      // Try from vehicles (filtered by active serial)
      const vehicleWithBookingId = filteredVehicles.value.find(v => v.bookingId);
      if (vehicleWithBookingId) {
        bookingIdToUse = vehicleWithBookingId.bookingId;
        sharedBookingId.value = bookingIdToUse;
      }
    }

    if (!bookingIdToUse) {
      // Generate random booking_id as fallback
      bookingIdToUse = Math.floor(Math.random() * 1000000) + 10000;
      sharedBookingId.value = bookingIdToUse;
      console.log("Generated random booking_id:", bookingIdToUse);
    }
    
    try {
      const stored = localStorage.getItem("token");
      if (!stored) {
        alert("Authentication required. Please log in again.");
        return;
      }
      
      const authHeader = stored.startsWith("Bearer ")
        ? stored
        : `Bearer ${stored}`;

      // Calculate totals for payment body - use filtered lists for active serial
      const passengerFare = filteredPassengers.value.reduce(
        (sum, p) => sum + parseFloat(p.fare || 0),
        0
      );
      const vehicleFare = filteredVehicles.value.reduce(
        (sum, v) => sum + parseFloat(v.vehicle?.rate || 0),
        0
      );
      const total_fare = passengerFare + vehicleFare;
      
      const total_discount = filteredPassengers.value.reduce(
        (sum, p) => sum + parseFloat(p.discountAmount || 0),
        0
      );
      
      // Admin fee: 2 pesos per passenger, 25 pesos per vehicle
      const total_admin_fee = (filteredPassengers.value.length * 2) + (filteredVehicles.value.length * 25);
      
      const grand_total = total_fare + total_admin_fee;

      const paymentBody = {
        serial_no: activeSerialTab.value || serialNo.value,
        booking_id: bookingIdToUse,
        total_fare: parseFloat(total_fare.toFixed(2)),
        total_discount: parseFloat(total_discount.toFixed(2)),
        grand_total: parseFloat(grand_total.toFixed(2)),
        total_admin_fee: parseFloat(total_admin_fee.toFixed(2)),
        payment_method: selectedPaymentMethod.value?.id || "cash",
        reference_number: referenceNumber || null,
      };

      console.log("Payment request body:", paymentBody);

      const response = await fetch(`${apiBase}/teller-booking/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(paymentBody),
      });

      console.log("Payment response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("Payment successful:", result);
        isPaymentModalOpen.value = false;
        paymentSuccessData.value = result;
        showPaymentSuccess.value = true;
      } else {
        const error = await response.json();
        console.error("Payment error:", error);
        alert("Payment failed: " + (error.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error processing payment:", err);
      alert("Error processing payment. Please try again.");
    }
  } else {
    // Handle other printing options
    console.log("Printing option selected:", option);
    isPaymentModalOpen.value = false;
  }
};


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

// p.fare from API is already the post-discount fare
const totalPassengerFare = computed(() =>
  filteredPassengers.value.reduce((sum, p) => sum + parseFloat(p.fare || 0), 0)
);
const totalVehicleFare = computed(() =>
  filteredVehicles.value.reduce((sum, v) => sum + parseFloat(v.vehicle?.rate || 0), 0)
);
const totalCargo = computed(() =>
  filteredPassengers.value.reduce((sum, p) => sum + parseFloat(p.cargoFare || 0), 0)
);
const totalAdmin = computed(() =>
  filteredPassengers.value.length * 2 + filteredVehicles.value.length * 25
);
const totalDiscount = computed(() =>
  filteredPassengers.value.reduce((sum, p) => sum + parseFloat(p.discountAmount || 0), 0)
);
const totalAmount = computed(() =>
  totalPassengerFare.value + totalVehicleFare.value + totalCargo.value + totalAdmin.value
);

// Keep for backward compat with any remaining references
const totalOriginalFare = totalPassengerFare;
const totalFare = totalPassengerFare;

// Get unique serial numbers: from bookings list + current in-progress serial
const uniqueSerialNumbers = computed(() => {
  const set = new Set(bookings.value.map(b => b.serial_no).filter(Boolean));
  if (serialNo.value) set.add(serialNo.value);
  return Array.from(set);
});

// Handle new transaction from header
const handleNewTransaction = () => {
  // Generate a new serial number for the new transaction
  generateSerialNo();
  
  // Clear form fields for new passenger entry
  fullname.value = "";
  selectedDiscount.value = "0";
  selectedAccommodation.value = "";
  selectedGender.value = "";
  selectedVehicleDetails.value = null;
  selectedInstitutionalAccount.value = null;
  selectedPassengerTypeDetails.value = regularPassengerType.value;
  isInstitutionalAccount.value = false;
  isManualSeatSelection.value = false;
  selectedSeat.value = null;
  
  // Reset shared booking IDs for new transaction
  sharedBookingId.value = null;
  sharedScheduleBookingId.value = null;
  
  // Switch to Passenger tab
  activeTab.value = "Passenger";
  
  console.log("New transaction started with serial:", serialNo.value);
};

// Handle closing a serial tab — deletes all its bookings from backend and local state
const handleCloseTab = async (serialToClose) => {
  const stored = localStorage.getItem("token");
  if (!stored) return;
  const authHeader = stored.startsWith("Bearer ") ? stored : `Bearer ${stored}`;

  const response = await fetch(`${apiBase}/teller-booking/bookings/${serialToClose}`, {
    method: "DELETE",
    headers: { Authorization: authHeader },
  });

  if (!response.ok) {
    let message = response.statusText;
    try { const err = await response.json(); message = err.message || err.error || message; } catch {}
    alert(`Failed to cancel booking (${response.status}): ${message}`);
    return;
  }

  // Remove from local state
  passengers.value = passengers.value.filter(p => p.serialNo !== serialToClose);
  vehicles.value = vehicles.value.filter(v => v.serialNo !== serialToClose);

  // Refresh bookings list — this removes the closed serial from the tab bar
  await fetchBookings();

  // If closing the active tab, switch to another or generate new
  if (activeSerialTab.value === serialToClose || serialNo.value === serialToClose) {
    const remaining = uniqueSerialNumbers.value.filter((s) => s !== serialToClose);
    if (remaining.length > 0) {
      serialNo.value = remaining[remaining.length - 1];
      activeSerialTab.value = serialNo.value;
    } else {
      generateSerialNo();
    }
    sharedBookingId.value = null;
    sharedScheduleBookingId.value = null;
  }
};

// Handle opening bookings modal
const handleOpenBookings = () => {
  isBookingsModalOpen.value = true;
};

// Filter passengers by active serial tab
const filteredPassengers = computed(() => {
  if (!activeSerialTab.value) return [];
  return passengers.value.filter(
    p => (p.serialNo || serialNo.value) === activeSerialTab.value
  );
});

// Filter vehicles by active serial tab — strict: serialNo must be explicitly set
const filteredVehicles = computed(() => {
  if (!activeSerialTab.value) return [];
  return vehicles.value.filter(v => v.serialNo === activeSerialTab.value);
});

const stepInstruction = computed(() => {
  if (!outboundSchedule.value) return "Select a Schedule to proceed";
  if (returnTrip.value && !returnSchedule.value) return "Select a Return Schedule";
  
  // Vehicle flow - only needs vehicle
  if (activeTab.value === "Vehicle") {
    if (!selectedVehicleDetails.value) return "Select a Vehicle and enter Plate Number to proceed";
    return "Click Book Entry to add the vehicle";
  }
  
  // Passenger flow
  if (!selectedAccommodation.value) return "Select a Passenger Accommodation to proceed";
  if (!fullname.value) return "Enter Passenger Fullname to proceed";
  if (!selectedPassengerTypeDetails.value) return "Select Passenger Type to proceed";
  if (!selectedGender.value) return "Select Gender to proceed";
  // Discount is now optional/auto-set
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

const removePassenger = async (passenger) => {
  if (!passenger) return;

  // Confirm deletion
  const confirmed = confirm(`Remove ${passenger.fullname} from booking?`);
  if (!confirmed) return;

  // If passenger has a booked_passenger_id, delete from backend
  if (passenger.bookedPassengerId) {
    try {
      const stored = localStorage.getItem("token");
      if (!stored) { alert("Authentication required. Please log in again."); return; }
      const authHeader = stored.startsWith("Bearer ") ? stored : `Bearer ${stored}`;

      const response = await fetch(`${apiBase}/teller-booking/booked-passengers/${passenger.bookedPassengerId}`, {
        method: "DELETE",
        headers: { Authorization: authHeader },
      });

      if (!response.ok) {
        let message = response.statusText;
        try { const err = await response.json(); message = err.message || err.error || message; } catch {}
        alert(`Failed to delete passenger (${response.status}): ${message}`);
        return;
      }

      // Unblock the seat locally
      if (passenger.seat && passenger.seat !== "N/A") {
        const seatToUnblock = availableSeats.value.find(s => s.seat_no === passenger.seat);
        if (seatToUnblock) seatToUnblock.blocked = false;
      }

      await fetchBookingDetails(activeSerialTab.value || serialNo.value);
      await fetchBookings();
    } catch (err) {
      console.error("Error deleting passenger:", err);
      alert("Network error: " + err.message);
    }
  } else {
    // Local-only passenger (not yet saved to backend)
    if (passenger.seat && passenger.seat !== "N/A") {
      const seatToUnblock = availableSeats.value.find(
        (s) => s.seat_no === passenger.seat,
      );
      if (seatToUnblock) {
        seatToUnblock.blocked = false;
      }
    }
    // Find and remove passenger from array
    const idx = passengers.value.findIndex(p => p === passenger);
    if (idx !== -1) {
      passengers.value.splice(idx, 1);
    }
  }
};

const removeVehicle = async (vehicle) => {
  if (!vehicle) return;

  // Confirm deletion
  const confirmed = confirm(`Remove vehicle ${vehicle.vehicle?.plate_number || 'this vehicle'} from booking?`);
  if (!confirmed) return;

  // If vehicle has a booked_vehicle_id, delete from backend
  if (vehicle.bookedVehicleId) {
    try {
      const stored = localStorage.getItem("token");
      if (!stored) { alert("Authentication required. Please log in again."); return; }
      const authHeader = stored.startsWith("Bearer ") ? stored : `Bearer ${stored}`;

      const response = await fetch(`${apiBase}/teller-booking/booked-vehicles/${vehicle.bookedVehicleId}`, {
        method: "DELETE",
        headers: { Authorization: authHeader },
      });

      if (!response.ok) {
        let message = response.statusText;
        try { const err = await response.json(); message = err.message || err.error || message; } catch {}
        alert(`Failed to delete vehicle (${response.status}): ${message}`);
        return;
      }

      await fetchBookingDetails(activeSerialTab.value || serialNo.value);
      await fetchBookings();
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      alert("Network error: " + err.message);
    }
  } else {
    // Local-only vehicle (not yet saved to backend)
    const idx = vehicles.value.findIndex(v => v === vehicle);
    if (idx !== -1) {
      vehicles.value.splice(idx, 1);
    }
  }
};

const openDriverSelection = (vehicle) => {
  selectedVehicleForDriver.value = vehicle;
  isDriverSelectionOpen.value = true;
};

const assignDriver = async (passenger) => {
  if (selectedVehicleForDriver.value) {
    const vehicle = selectedVehicleForDriver.value;
    
    try {
      const stored = localStorage.getItem("token");
      if (!stored) {
        alert("Authentication required. Please log in again.");
        return;
      }
      
      const authHeader = stored.startsWith("Bearer ")
        ? stored
        : `Bearer ${stored}`;

      if (!vehicle.bookedVehicleId) {
        console.error("assignDriver: vehicle.bookedVehicleId is missing", vehicle);
        alert("Cannot assign driver: vehicle ID is missing. Try refreshing the page.");
        return;
      }

      const requestBody = {
        plate_no: vehicle.vehicle.plate_number,
        driver_passenger_booking_id: parseInt(passenger.bookedPassengerId, 10),
      };

      console.log("Assigning driver to vehicle:", {
        url: `${apiBase}/teller-booking/booked-vehicles/${vehicle.bookedVehicleId}`,
        method: "PATCH",
        body: requestBody,
        vehicleObj: vehicle,
      });

      const response = await fetch(`${apiBase}/teller-booking/booked-vehicles/${vehicle.bookedVehicleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Driver assignment response status:", response.status, response.statusText);

      if (response.ok) {
        console.log("Driver assigned successfully");
        // Refresh booking details to sync driver assignment
        await fetchBookingDetails(activeSerialTab.value || serialNo.value);
        isDriverSelectionOpen.value = false;
        selectedVehicleForDriver.value = null;
      } else {
        const error = await response.json();
        console.error("Driver assignment error:", error);
        alert("Failed to assign driver: " + (error.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error assigning driver:", err);
      alert("Error assigning driver. Please try again.");
    }
  }
};

const removeDriver = async (vehicle) => {
  if (!vehicle || !vehicle.driver) return;
  
  try {
    const stored = localStorage.getItem("token");
    if (!stored) {
      alert("Authentication required. Please log in again.");
      return;
    }
    
    const authHeader = stored.startsWith("Bearer ")
      ? stored
      : `Bearer ${stored}`;

    const response = await fetch(`${apiBase}/teller-booking/booked-vehicles/${vehicle.bookedVehicleId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        plate_no: vehicle.vehicle.plate_number,
        driver_passenger_booking_id: null,
      }),
    });

    if (response.ok) {
      console.log("Driver removed successfully");
      // Refresh booking details to sync driver removal
      await fetchBookingDetails(activeSerialTab.value || serialNo.value);
    } else {
      const error = await response.json();
      alert("Failed to remove driver: " + (error.message || "Unknown error"));
    }
  } catch (err) {
    console.error("Error removing driver:", err);
    alert("Error removing driver. Please try again.");
  }
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
    outboundDate.value = passenger.date;
    originPort.value = passenger.route.split(" - ")[0];
    destinationPort.value = passenger.route.split(" - ")[1];
    outboundSchedule.value = passenger.schedule;
    activeTab.value = "Passenger";
    selectedCategory.value = passenger.category;
    selectedType.value = passenger.type;
    selectedAccommodation.value = passenger.accommodation;
    selectedGender.value = passenger.gender;
    selectedDiscount.value = passenger.discount;
    fullname.value = passenger.fullname;
    selectedVehicleDetails.value = passenger.vehicle;
    selectedInstitutionalAccount.value = passenger.institutionalAccount;
    selectedPassengerTypeDetails.value = passenger.passengerTypeDetails;

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

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <!-- Modals (fixed-positioned, order doesn't affect layout) -->
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
    :passengers="filteredPassengers"
    :vehicles="filteredVehicles"
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
    :routeId="selectedRoute?.route_id || selectedRoute?.id"
    @close="isVehicleModalOpen = false"
    @save="handleVehicleSave"
  />

  <!-- Institutional Account Modal -->
  <IaModal
    :isOpen="isIaModalOpen"
    @close="isIaModalOpen = false"
    @select="handleIaSelect"
  />


  <!-- Bookings List Modal -->
  <ModalBookingsList
    :isOpen="isBookingsModalOpen"
    @close="isBookingsModalOpen = false"
  />

  <!-- Payment Success Modal -->
  <transition name="modal-fade">
    <div
      v-if="showPaymentSuccess"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl w-full max-w-sm border border-gray-200 overflow-hidden">
        <!-- Green top bar -->
        <div class="h-1.5 bg-emerald-500"></div>

        <div class="p-8 flex flex-col items-center text-center">
          <!-- Check icon -->
          <div class="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
            <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 class="text-xl font-bold text-gray-900 mb-1">Payment Successful</h2>
          <p class="text-sm text-gray-500 mb-5">The booking has been confirmed and payment recorded.</p>

          <!-- Booking number if available -->
          <div
            v-if="paymentSuccessData?.data?.booking_number || paymentSuccessData?.booking_number"
            class="w-full mb-5 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"
          >
            <p class="text-xs text-gray-400 mb-0.5">Booking Number</p>
            <p class="font-mono font-bold text-[#1e3a8a] text-base">
              {{ paymentSuccessData?.data?.booking_number || paymentSuccessData?.booking_number }}
            </p>
          </div>

          <button
            @click="showPaymentSuccess = false; paymentSuccessData = null; passengers = []; vehicles = []; handleNewTransaction(); fetchBookings();"
            class="w-full py-3 bg-[#1e3a8a] text-white font-semibold rounded-xl hover:bg-[#162d6e] transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </transition>

  <!-- App shell: header fixed, panels fill remaining height -->
  <div class="h-screen flex flex-col overflow-hidden">
    <TellerHeader
      :serialNo="serialNo"
      :uniqueSerialNumbers="uniqueSerialNumbers"
      :activeSerialTab="activeSerialTab"
      @update:activeSerialTab="activeSerialTab = $event; serialNo = $event"
      @newTransaction="handleNewTransaction"
      @closeTab="handleCloseTab"
      @openBookings="handleOpenBookings"
    />
  <main class="flex-1 min-h-0 grid grid-cols-[0.75fr_1.25fr]">
      <!-- LEFT PANEL -->
      <div class="left-panel h-full min-h-0 flex flex-col bg-white border-r border-gray-200">

        <!-- Scrollable content -->
        <div class="flex-1 overflow-y-auto scrollbar-hidden px-8 pt-7 pb-6 space-y-6">

          <!-- Route Header -->
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-1">Active Route</p>
              <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {{ originPort }}
                <svg class="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                {{ destinationPort }}
              </h2>
              <p class="text-sm text-gray-400 mt-0.5">
                {{ outboundSchedule?.code || 'No vessel selected' }}
              </p>
            </div>
            <button class="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0 mt-1">
              <ArrowsRightLeftIcon class="w-4 h-4" />
              Different Port
            </button>
          </div>

          <!-- Trip Details Card -->
          <div class="grid grid-cols-3 divide-x divide-gray-200 border border-gray-200 rounded-xl overflow-hidden">
            <div class="px-4 py-3">
              <p class="text-xs text-gray-400 mb-1">Date</p>
              <div class="flex items-center gap-1.5">
                <CalendarDaysIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
                <p class="text-sm font-semibold text-gray-800">
                  {{ outboundDate || filteredPassengers[0]?.date || filteredVehicles[0]?.date || '—' }}
                  <span v-if="returnTrip && returnDate" class="text-blue-600"> ⇄ {{ returnDate }}</span>
                </p>
              </div>
            </div>
            <div class="px-4 py-3">
              <p class="text-xs text-gray-400 mb-1">Schedule</p>
              <div class="flex items-center gap-1.5">
                <ClockIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
                <p class="text-sm font-semibold text-gray-800">{{ outboundSchedule?.time || filteredPassengers[0]?.schedule || filteredVehicles[0]?.schedule || '—' }}</p>
              </div>
            </div>
            <div class="px-4 py-3">
              <p class="text-xs text-gray-400 mb-1">Passengers</p>
              <div class="flex items-center gap-1.5">
                <UserIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
                <p class="text-sm font-bold text-blue-600">{{ filteredPassengers.length }}</p>
              </div>
            </div>
          </div>

          <!-- Payment Breakdown -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-2">Payment Breakdown</p>
            <div class="border border-gray-200 rounded-xl overflow-hidden">
              <div class="divide-y divide-gray-100 text-sm">
                <div class="flex justify-between items-center px-4 py-3">
                  <span class="text-gray-500">Passenger Fare</span>
                  <span class="font-medium text-gray-800">₱{{ totalPassengerFare.toFixed(2) }}</span>
                </div>
                <div v-if="totalVehicleFare > 0" class="flex justify-between items-center px-4 py-3">
                  <span class="text-gray-500">Vehicle Fare</span>
                  <span class="font-medium text-gray-800">₱{{ totalVehicleFare.toFixed(2) }}</span>
                </div>
                <div v-if="totalCargo > 0" class="flex justify-between items-center px-4 py-3">
                  <span class="text-gray-500">Cargo Rate</span>
                  <span class="font-medium text-gray-800">₱{{ totalCargo.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between items-center px-4 py-3">
                  <span class="text-gray-500">Admin Fee</span>
                  <span class="font-medium text-gray-800">₱{{ totalAdmin.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between items-center px-4 py-3.5 bg-gray-50">
                  <span class="font-bold text-gray-900">Total Due</span>
                  <span class="font-bold text-gray-900 text-base">₱{{ totalAmount.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Passenger List -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <p class="text-xs font-semibold uppercase tracking-widest text-gray-600">Passenger List</p>
              <span v-if="selectedInstitutionalAccount" class="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                {{ selectedInstitutionalAccount.ia_name }}
              </span>
            </div>
            <div class="border border-gray-200 rounded-xl overflow-hidden">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-gray-50 border-b border-gray-200">
                    <th class="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Name</th>
                    <th class="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Seat</th>
                    <th class="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Fare</th>
                    <th class="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Type</th>
                    <th class="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Class</th>
                    <th class="px-2 py-2.5"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-if="filteredPassengers.length === 0">
                    <td colspan="6" class="px-4 py-6 text-center text-gray-400 text-sm">
                      No passengers added yet
                    </td>
                  </tr>
                  <tr
                    v-else
                    v-for="(p, index) in filteredPassengers"
                    :key="index"
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <td class="px-4 py-3 font-semibold text-gray-900">{{ p.fullname }}</td>
                    <td class="px-4 py-3 text-gray-600">{{ p.seat }}</td>
                    <td class="px-4 py-3 text-gray-600">
                      ₱{{ p.fare }}
                      <span v-if="parseFloat(p.discountAmount) > 0" class="text-xs text-green-600 ml-1">(-₱{{ p.discountAmount }})</span>
                    </td>
                    <td class="px-4 py-3 text-gray-600 capitalize">{{ p.passengerTypeDetails?.type || 'Regular' }}</td>
                    <td class="px-4 py-3 text-gray-600">{{ p.accommodation }}</td>
                    <td class="px-2 py-3">
                      <div class="flex items-center gap-0.5">
                        <button
                          @click="openPassengerView(p)"
                          class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          @click="removePassenger(p)"
                          class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Remove"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m2 0v14a2 2 0 01-2 2H8a2 2 0 01-2-2V6m5 10v-6" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Vehicle List -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-2">Vehicle List</p>
            <div class="border border-gray-200 rounded-xl overflow-hidden">
              <!-- Empty state -->
              <div v-if="filteredVehicles.length === 0" class="flex flex-col items-center justify-center py-10 text-gray-400">
                <ArrowsRightLeftIcon class="w-8 h-8 mb-2 text-gray-300" />
                <p class="text-sm">No vehicles added yet</p>
              </div>

              <!-- Vehicle rows -->
              <div v-else class="divide-y divide-gray-100">
                <div
                  v-for="(v, index) in filteredVehicles"
                  :key="index"
                  class="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div class="flex-1 grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p class="text-xs text-gray-400 mb-0.5">Class</p>
                      <p class="font-semibold text-gray-900">{{ v.vehicle.vehicle_class || v.vehicle.type || 'Vehicle' }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400 mb-0.5">Plate</p>
                      <p class="text-gray-700">{{ v.vehicle.plate_number || 'N/A' }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400 mb-0.5">Fare</p>
                      <p class="font-semibold text-blue-600">₱{{ parseFloat(v.vehicle.rate || 0).toFixed(2) }}</p>
                    </div>
                  </div>

                  <!-- Driver -->
                  <div class="flex-shrink-0">
                    <div v-if="v.driver" class="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 text-sm">
                      <span class="font-medium text-gray-800">{{ v.driver.fullname }}</span>
                      <button @click="removeDriver(v)" class="text-gray-400 hover:text-red-500 transition-colors">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <button
                      v-else
                      @click="openDriverSelection(v)"
                      class="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      + Driver
                    </button>
                  </div>

                  <!-- Remove -->
                  <button @click="removeVehicle(v)" class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors flex-shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Driver Selection Modal -->
          <transition name="modal-fade">
            <div
              v-if="isDriverSelectionOpen"
              class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              @click="isDriverSelectionOpen = false"
            >
              <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden" @click.stop>
                <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-gray-800">Select Driver</h3>
                  <button @click="isDriverSelectionOpen = false" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div class="p-6 overflow-y-auto max-h-[60vh] space-y-2">
                  <div v-if="filteredPassengers.length === 0" class="text-center py-8 text-gray-500 text-sm">
                    No passengers available. Please add passengers first.
                  </div>
                  <button
                    v-else
                    v-for="(passenger, index) in filteredPassengers"
                    :key="index"
                    @click="assignDriver(passenger)"
                    class="w-full p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-400 rounded-lg text-left transition-all"
                  >
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-semibold text-gray-900">{{ passenger.fullname }}</p>
                        <div class="flex gap-3 mt-1 text-sm text-gray-500">
                          <span>{{ passenger.type }}</span>
                          <span>·</span>
                          <span>{{ passenger.gender }}</span>
                          <span>·</span>
                          <span>Seat {{ passenger.seat }}</span>
                        </div>
                      </div>
                      <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </transition>

        </div>

        <!-- Sticky bottom action bar -->
        <div class="border-t border-gray-200 bg-white px-8 py-4 flex items-center justify-between flex-shrink-0">
          <button class="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Save for later
          </button>
          <div class="flex items-center gap-3">
            <button
              class="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              @click="resetForm"
            >
              Cancel
            </button>
            <button
              class="px-6 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
              @click="proceedToPayment"
            >
              Proceed To Payment
            </button>
          </div>
        </div>

      </div>
      <div
        ref="rightPanel"
        class="right-panel bg-gray-50 h-full min-h-0 overflow-y-auto scrollbar-hidden"
      >
        <div class="p-7 space-y-4">

          <!-- ── Card 1: Date & Route ──────────────────────────────────────── -->
          <div class="bg-white rounded-2xl border border-gray-200 p-5">
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Trip Setup</p>
            <div class="flex gap-4 items-end flex-wrap">
              <!-- Outbound date -->
              <div class="flex-shrink-0">
                <label class="block text-sm font-medium text-gray-600 mb-1.5">{{ returnTrip ? "Outbound Date" : "Travel Date" }}</label>
                <div class="relative">
                  <CalendarDaysIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    v-model="outboundDate"
                    class="pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>
              </div>
              <!-- Return date -->
              <div v-if="returnTrip" class="flex-shrink-0">
                <label class="block text-sm font-medium text-gray-600 mb-1.5">Return Date</label>
                <div class="relative">
                  <CalendarDaysIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    v-model="returnDate"
                    :min="outboundDate"
                    class="pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>
              </div>
              <!-- Route -->
              <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-gray-600 mb-1.5">Route</label>
                <div class="relative">
                  <ArrowsRightLeftIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select
                    v-model="selectedRoute"
                    class="hide-select-icon w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option v-for="route in routes" :key="route.route_id" :value="route">
                      {{ route.portA?.port_name || route.portA?.name || "Port A" }} → {{ route.portB?.port_name || route.portB?.name || "Port B" }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- ── Card 2: Schedule ──────────────────────────────────────────── -->
          <div class="bg-white rounded-2xl border border-gray-200 p-5">
            <div class="flex items-center justify-between mb-4">
              <p class="text-xs font-semibold uppercase tracking-widest text-gray-500">{{ returnTrip ? "Outbound Schedule" : "Select Schedule" }}</p>
              <button
                v-if="outboundSchedule"
                @click="outboundSchedule = null"
                class="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                <ArrowsRightLeftIcon class="w-3.5 h-3.5" /> Change
              </button>
            </div>

            <!-- Port A -->
            <div v-if="filteredSchedules.portA.length > 0" class="mb-5">
              <p class="text-xs font-semibold text-gray-400 mb-3">
                {{ selectedRoute.portA?.port_name || selectedRoute.portA?.name }} → {{ selectedRoute.portB?.port_name || selectedRoute.portB?.name }}
              </p>
              <div class="grid grid-cols-4 gap-3">
                <button
                  v-for="time in filteredSchedules.portA"
                  :key="time.id"
                  @click="outboundSchedule = time"
                  :class="[
                    'py-3 px-2 text-center rounded-xl border transition-all',
                    outboundSchedule?.id === time.id
                      ? 'border-[#1e3a8a] bg-[#1e3a8a] text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50',
                  ]"
                >
                  <div class="font-bold text-base">{{ time.time }}</div>
                  <div class="text-xs opacity-60 mt-0.5">{{ time.code }}</div>
                </button>
              </div>
            </div>

            <!-- Port B -->
            <div v-if="filteredSchedules.portB.length > 0" class="mb-2">
              <p class="text-xs font-semibold text-gray-400 mb-3">
                <span v-if="returnTrip">Return · </span>
                {{ selectedRoute.portB?.port_name || selectedRoute.portB?.name }} → {{ selectedRoute.portA?.port_name || selectedRoute.portA?.name }}
              </p>
              <div class="grid grid-cols-4 gap-3">
                <button
                  v-for="time in filteredSchedules.portB"
                  :key="time.id"
                  @click="returnTrip ? (returnSchedule = time) : (outboundSchedule = time)"
                  :class="[
                    'py-3 px-2 text-center rounded-xl border transition-all',
                    returnTrip
                      ? (returnSchedule?.id === time.id ? 'border-[#1e3a8a] bg-[#1e3a8a] text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50')
                      : (outboundSchedule?.id === time.id ? 'border-[#1e3a8a] bg-[#1e3a8a] text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'),
                  ]"
                >
                  <div class="font-bold text-base">{{ time.time }}</div>
                  <div class="text-xs opacity-60 mt-0.5">{{ time.code }}</div>
                </button>
              </div>
            </div>

            <!-- No schedules -->
            <div
              v-if="filteredSchedules.portA.length === 0 && filteredSchedules.portB.length === 0"
              class="py-10 text-center"
            >
              <ClockIcon class="w-10 h-10 mx-auto mb-2 text-gray-200" />
              <p class="text-sm text-gray-400">{{ selectedRoute ? "No schedules available for this route" : "Select a route to view schedules" }}</p>
            </div>
          </div>

          <!-- ── Cards only shown after schedule selected ──────────────────── -->
          <template v-if="outboundSchedule">

            <!-- ── Card 3: I.A ─────────────────────────────────────────────── -->
            <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <label class="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-blue-50/50 transition-colors">
                <input
                  type="checkbox"
                  v-model="isInstitutionalAccount"
                  @change="handleIaCheckboxChange"
                  class="theme-checkbox w-5 h-5 flex-shrink-0"
                />
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-800">Institutional Account (I.A)</p>
                  <p class="text-xs text-gray-400 mt-0.5">Check if this booking is for an institutional account</p>
                </div>
              </label>
              <!-- Selected I.A -->
              <div v-if="isInstitutionalAccount && selectedInstitutionalAccount" class="px-5 pb-4 border-t border-gray-100">
                <div class="flex items-center gap-3 mt-3">
                  <div class="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <img
                      v-if="selectedInstitutionalAccount.ia_image"
                      :src="`${apiBase}/${selectedInstitutionalAccount.ia_image}`"
                      :alt="selectedInstitutionalAccount.ia_name"
                      class="w-full h-full object-cover"
                    />
                    <span v-else class="text-lg font-bold text-gray-400">{{ selectedInstitutionalAccount.ia_name.charAt(0) }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs text-gray-400 uppercase tracking-widest">Selected Institution</p>
                    <p class="text-sm font-bold text-[#1e3a8a] truncate">{{ selectedInstitutionalAccount.ia_name }}</p>
                  </div>
                  <button @click="isIaModalOpen = true" class="text-xs text-blue-600 hover:text-blue-800 font-medium flex-shrink-0">Change</button>
                </div>
              </div>
            </div>

            <!-- ── Card 4: Tabs + booking form ───────────────────────────── -->
            <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">

              <!-- Tab bar -->
              <div class="flex border-b border-gray-200">
                <button
                  @click="activeTab = 'Passenger'"
                  :class="[
                    'flex-1 py-3.5 text-sm font-semibold transition-all',
                    activeTab === 'Passenger' ? 'text-[#1e3a8a] border-b-2 border-[#1e3a8a]' : 'text-gray-400 hover:text-gray-600',
                  ]"
                >
                  Passenger
                </button>
                <button
                  @click="activeTab = 'Vehicle'"
                  :class="[
                    'flex-1 py-3.5 text-sm font-semibold transition-all',
                    activeTab === 'Vehicle' ? 'text-[#1e3a8a] border-b-2 border-[#1e3a8a]' : 'text-gray-400 hover:text-gray-600',
                  ]"
                >
                  Vehicle
                </button>
              </div>

              <div class="p-6 space-y-5">

                <!-- ── VEHICLE TAB ──────────────────────────────────────── -->
                <template v-if="activeTab === 'Vehicle'">
                  <div class="text-center py-6">
                    <div class="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mx-auto mb-4">
                      <svg class="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <h3 class="text-base font-semibold text-gray-800 mb-1">Book a Vehicle</h3>
                    <p class="text-sm text-gray-400 mb-5">Select vehicle type and enter plate number</p>
                    <button
                      @click="isVehicleModalOpen = true"
                      class="px-6 py-2.5 bg-[#1e3a8a] text-white rounded-xl text-sm font-semibold hover:bg-[#162d6e] transition-colors"
                    >
                      Select Vehicle
                    </button>
                    <div v-if="selectedVehicleDetails" class="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200 text-left">
                      <p class="text-xs text-gray-400 uppercase tracking-widest mb-1">Selected</p>
                      <p class="text-base font-bold text-[#1e3a8a]">{{ selectedVehicleDetails.vehicle_class || selectedVehicleDetails.type || "Vehicle" }}</p>
                      <p v-if="selectedVehicleDetails.plate_number" class="font-mono text-sm text-gray-600 mt-0.5">{{ selectedVehicleDetails.plate_number }}</p>
                    </div>
                  </div>
                  <button
                    v-if="selectedVehicleDetails"
                    @click="bookVehicleEntry"
                    class="w-full py-3.5 rounded-xl text-sm font-semibold transition-all bg-orange-500 text-white hover:bg-orange-600"
                  >
                    Book Entry
                  </button>
                </template>

                <!-- ── PASSENGER TAB ────────────────────────────────────── -->
                <template v-if="activeTab === 'Passenger'">

                  <!-- Accommodation -->
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Accommodation Class</p>
                    <div class="grid grid-cols-4 gap-2">
                      <button
                        @click="handleAccommodationClick('Economy')"
                        :class="['py-2.5 text-center rounded-xl text-sm font-semibold border transition-all', selectedAccommodation === 'Economy' ? 'border-[#1e3a8a] bg-[#1e3a8a] text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50']"
                      >Economy</button>
                      <button
                        @click="handleAccommodationClick('Premium Economy')"
                        :class="['py-2.5 text-center rounded-xl text-sm font-semibold border transition-all', selectedAccommodation === 'Premium Economy' ? 'border-[#1e3a8a] bg-[#1e3a8a] text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50']"
                      >Prem. Economy</button>
                      <button
                        @click="handleAccommodationClick('Business Class')"
                        :class="['py-2.5 text-center rounded-xl text-sm font-semibold border transition-all', selectedAccommodation === 'Business Class' ? 'border-[#1e3a8a] bg-[#1e3a8a] text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50']"
                      >Business</button>
                      <button
                        @click="handleAccommodationClick('Senior/PWD')"
                        :class="['py-2.5 text-center rounded-xl text-sm font-semibold border transition-all', selectedAccommodation === 'Senior/PWD' ? 'border-[#1e3a8a] bg-[#1e3a8a] text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50']"
                      >PWD</button>
                    </div>
                  </div>

                  <!-- Seat Selection — hidden for types that don't require a seat -->
                  <div v-if="selectedAccommodation && selectedPassengerTypeDetails?.has_seat !== false">
                    <div class="flex items-center justify-between mb-3">
                      <p class="text-xs font-semibold uppercase tracking-widest text-gray-500">Seat</p>
                      <button
                        v-if="!isManualSeatSelection && availableSeats.length > 0"
                        @click="isManualSeatSelection = true"
                        class="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        Choose manually →
                      </button>
                    </div>

                    <!-- Loading -->
                    <div v-if="loadingSeatmap" class="flex items-center gap-3 py-4">
                      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1e3a8a] flex-shrink-0"></div>
                      <p class="text-sm text-gray-400">Loading seatmap…</p>
                    </div>

                    <!-- Auto-selected -->
                    <div v-else-if="!isManualSeatSelection && selectedSeat" class="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div class="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                        <span class="text-white font-bold text-sm">{{ selectedSeat.seat_no }}</span>
                      </div>
                      <div>
                        <p class="text-sm font-semibold text-emerald-800">Seat {{ selectedSeat.seat_no }} auto-assigned</p>
                        <p class="text-xs text-emerald-600">Click "Choose manually" to change</p>
                      </div>
                    </div>

                    <!-- Manual seatmap -->
                    <div v-else-if="isManualSeatSelection && availableSeats.length > 0" class="bg-gray-50 rounded-xl border border-gray-200 p-4">
                      <div class="flex items-center justify-between mb-3">
                        <span class="text-xs font-semibold text-gray-500 bg-[#1e3a8a] text-white px-2 py-0.5 rounded-full">{{ selectedAccommodation }}</span>
                        <div class="flex items-center gap-3">
                          <div class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-white border border-gray-300"></span><span class="text-xs text-gray-400">Free</span></div>
                          <div class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-red-500"></span><span class="text-xs text-gray-400">Blocked</span></div>
                          <div class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-blue-600"></span><span class="text-xs text-gray-400">Selected</span></div>
                          <div class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-green-400"></span><span class="text-xs text-gray-400">PWD</span></div>
                          <div class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-orange-400"></span><span class="text-xs text-gray-400">Facility</span></div>
                        </div>
                      </div>
                      <!-- Seatmap grid — internals unchanged -->
                      <div class="relative h-[350px] overflow-auto border rounded-lg p-4 bg-white">
                        <div
                          class="relative select-none"
                          :style="{ width: Math.max(...availableSeats.map(s => s.col)) * 44 + 44 + 'px', height: Math.max(...availableSeats.map(s => s.row)) * 44 + 44 + 'px' }"
                        >
                          <div
                            v-for="seat in availableSeats"
                            :key="seat.seat_no"
                            :data-row="seat.row"
                            :data-col="seat.col"
                            class="absolute flex items-center justify-center border rounded-md text-xs font-medium cursor-pointer select-none transition-colors"
                            :style="{ width: '40px', height: '40px', top: seat.row * 44 + 2 + 'px', left: seat.col * 44 + 2 + 'px' }"
                            :class="{
                              'bg-red-600 border-red-700 text-white hover:bg-red-500': seat.blocked,
                              'bg-gray-200 border-gray-300 text-gray-400 cursor-default': seat.path && !seat.blocked,
                              'bg-orange-400 border-orange-500 text-white cursor-default': seat.facility && !seat.blocked && !seat.path,
                              'bg-green-400 border-green-500 text-black': seat.pwd && !seat.blocked && !seat.path && !seat.facility,
                              'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300': !seat.blocked && !seat.path && !seat.facility && !seat.pwd && selectedSeat?.seat_no !== seat.seat_no,
                              'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400': selectedSeat?.seat_no === seat.seat_no,
                            }"
                            @click="!seat.blocked && !seat.path && !seat.facility && !seat.pwd ? (selectedSeat = seat) : null"
                          >
                            <span v-if="seat.blocked" class="text-white font-bold text-sm pointer-events-none">✕</span>
                            <span v-else-if="!seat.path && !seat.facility" class="pointer-events-none">{{ seat.seat_no }}</span>
                          </div>
                          <div
                            v-for="(facility, index) in computeFacilityLabels(availableSeats)"
                            :key="index"
                            class="absolute flex items-center justify-center text-white font-bold pointer-events-none bg-orange-500 rounded-md text-xs"
                            :style="{ top: facility.top + 2 + 'px', left: facility.left + 2 + 'px', width: facility.width - 4 + 'px', height: facility.height - 4 + 'px', zIndex: 10 }"
                          >{{ facility.name }}</div>
                        </div>
                      </div>
                      <div v-if="selectedSeat" class="mt-3 flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <span class="text-sm font-medium text-blue-900">Seat <strong>{{ selectedSeat.seat_no }}</strong> selected</span>
                        <button @click="isManualSeatSelection = false" class="px-4 py-1.5 bg-[#1e3a8a] text-white text-xs font-semibold rounded-lg hover:bg-[#162d6e] transition-colors">Confirm</button>
                      </div>
                    </div>

                    <!-- No seatmap -->
                    <div v-else class="py-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <p class="text-sm text-gray-400">No seatmap for this class</p>
                      <p class="text-xs text-gray-300 mt-0.5">Seat will be auto-assigned</p>
                    </div>
                  </div>

                  <!-- Passenger name -->
                  <div v-if="selectedAccommodation">
                    <p class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Passenger Name</p>
                    <input
                      type="text"
                      v-model="fullname"
                      placeholder="Enter full name"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    />
                  </div>

                  <!-- Gender -->
                  <div v-if="fullname">
                    <p class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Gender</p>
                    <div class="grid grid-cols-2 gap-2">
                      <button
                        @click="selectedGender = 'Male'"
                        :class="['py-3 text-center rounded-xl text-base font-semibold border transition-all', selectedGender === 'Male' ? 'border-[#1e3a8a] bg-[#1e3a8a] text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50']"
                      >Male</button>
                      <button
                        @click="selectedGender = 'Female'"
                        :class="['py-3 text-center rounded-xl text-base font-semibold border transition-all', selectedGender === 'Female' ? 'border-[#1e3a8a] bg-[#1e3a8a] text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50']"
                      >Female</button>
                    </div>
                  </div>

                  <!-- Passenger Type -->
                  <div v-if="fullname">
                    <p class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Passenger Type</p>
                    <div class="grid grid-cols-4 gap-2">
                      <button
                        v-for="type in allPassengerTypes"
                        :key="type.p_id || type.id"
                        @click="handlePassengerTypeSelect(type)"
                        :class="['py-2.5 text-center rounded-xl text-sm font-semibold border transition-all capitalize', selectedPassengerTypeDetails === type ? 'border-[#1e3a8a] bg-[#1e3a8a] text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50']"
                      >
                        {{ type.type }}
                        <span v-if="parseFloat(type.discount) > 0" class="block text-xs font-normal opacity-75">{{ (parseFloat(type.discount) * 100).toFixed(0) }}% off</span>
                      </button>
                    </div>
                  </div>

                  <!-- Book Entry -->
                  <button
                    v-if="selectedGender"
                    @click="bookEntry"
                    :class="['w-full py-3.5 rounded-xl text-sm font-semibold transition-all', bookingActive ? 'bg-white shadow-border-brand-color' : 'bg-orange-500 text-white hover:bg-orange-600']"
                  >
                    Book Entry
                  </button>

                </template>
              </div>
            </div>

          </template>

          <!-- Step instruction -->
          <div v-if="stepInstruction" class="pb-2">
            <div class="flex items-center gap-2.5 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
              <svg class="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-blue-700 font-medium">{{ stepInstruction }}</p>
            </div>
          </div>

        </div>
      </div>
  </main>
  </div>
</template>
