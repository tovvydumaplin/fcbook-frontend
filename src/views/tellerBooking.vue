<script setup>
import { nextTick, ref, watch, computed, onMounted } from "vue";
import ModalPaymentSelection from "../components/Modals/Teller/ModalPaymentSelection.vue";
import VehicleSelection from "../components/Modals/Teller/VehicleSelection.vue";
import ViewTellerPassenger from "../components/Modals/Teller/ViewTellerPassenger.vue";
import IaModal from "../components/Modals/Teller/IaModal.vue";
import PassengerTypeModal from "../components/Modals/Teller/PassengerTypeModal.vue";
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
const isIaModalOpen = ref(false);
const isPassengerTypeModalOpen = ref(false);
const isDriverSelectionOpen = ref(false);
const isBookingPassenger = ref(false);
const isBookingVehicle = ref(false);
const isProcessingPayment = ref(false);
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

const outboundDate = ref(new Date().toISOString().split('T')[0]);
const returnDate = ref("");

const passengers = ref([]);
const vehicles = ref([]);

const bookVehicleEntry = async () => {
  if (!selectedVehicleDetails.value) return;
  isBookingVehicle.value = true;

  // Build API request body
  const requestBody = {
    serial_no: serialNo.value,
    booking_id: sharedBookingId.value,
    schedule_booking_id: sharedScheduleBookingId.value,
    is_return_trip: returnTrip.value || false,
    travel_date: outboundDate.value,
    schedule_id: outboundSchedule.value?.schedule_id || outboundSchedule.value?.id,
    schedule_snapshot: outboundSchedule.value?.time || outboundSchedule.value,
    route_id: selectedRoute.value?.route_id || selectedRoute.value?.id,
    route_snapshot: `${originPort.value} - ${destinationPort.value}`,
    vehicle_type: selectedVehicleDetails.value.vehicle_class || selectedVehicleDetails.value.type,
    plate_no: selectedVehicleDetails.value.plate_number,
    length: null,
    weight: null,
    fare: parseFloat(selectedVehicleDetails.value.rate || 0),
    driver_passenger_booking_id: null, // Will be updated when driver is assigned
    institutional_account_id: selectedInstitutionalAccount.value?.ia_id || selectedInstitutionalAccount.value?.id || null,
  };

  console.log("Booking vehicle:", requestBody);

  try {
    const stored = localStorage.getItem("token");
    
    if (!stored) {
      alert("Authentication required. Please log in again.");
      return;
    }
    
    const authHeader = stored.startsWith("Bearer ") ? stored : `Bearer ${stored}`;

    const response = await fetch(`${apiBase}/teller-booking/book-vehicle`, {
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

      // Refresh vehicle list from API
      await fetchBookedVehicles();

      // Try to extract booking IDs from latest vehicle
      const latestVehicle = vehicles.value[vehicles.value.length - 1];
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
  } finally {
    isBookingVehicle.value = false;
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
watch(selectedAccommodation, async (newAccommodation) => {
  console.log(
    "Watch triggered - selectedAccommodation changed to:",
    newAccommodation,
  );
  console.log("Current schedule:", outboundSchedule.value);
  console.log("Vessel ID:", outboundSchedule.value?.vesselId);

  if (!newAccommodation || !outboundSchedule.value?.vesselId) {
    vesselSeatmap.value = null;
    availableSeats.value = [];
    selectedSeat.value = null;
    if (!newAccommodation) {
      console.log("No accommodation selected");
    } else if (!outboundSchedule.value?.vesselId) {
      console.log("No vessel ID found in schedule:", outboundSchedule.value);
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

        // Auto-select the first available seat
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
  
  // Fetch existing booked passengers first, then vehicles (to map drivers)
  await fetchBookedPassengers();
  
  // Fetch existing booked vehicles
  await fetchBookedVehicles();
  
  // After fetching, select latest serial or generate new
  const allSerials = [];
  passengers.value.forEach(p => {
    if (p.serialNo) allSerials.push(p.serialNo);
  });
  vehicles.value.forEach(v => {
    if (v.serialNo) allSerials.push(v.serialNo);
  });
  
  if (allSerials.length > 0) {
    // Find latest serial by extracting timestamp from format BK-{timestamp}-{random}
    const uniqueSerials = [...new Set(allSerials)];
    const sortedSerials = uniqueSerials.sort((a, b) => {
      const timestampA = parseInt(a.split('-')[1] || '0');
      const timestampB = parseInt(b.split('-')[1] || '0');
      return timestampB - timestampA; // Descending order (latest first)
    });
    
    // Select the latest serial
    const latestSerial = sortedSerials[0];
    serialNo.value = latestSerial;
    activeSerialTab.value = latestSerial;
    console.log("Auto-selected latest serial:", latestSerial);
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
    } else {
      console.error("Failed to fetch routes:", result.message || result);
    }
  } catch (err) {
    console.error("Failed to fetch routes:", err);
  }
});

const passengerTypes = ["Regular Passenger", "Institutional Account"];
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
        // Find and auto-select "Regular" passenger type
        const regularType = result.data.types.find(
          (type) => type.type.toLowerCase() === "regular" && type.status === 1
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

// Fetch booked passengers from API
const fetchBookedPassengers = async () => {
  try {
    const stored = localStorage.getItem("token");
    
    if (!stored) {
      console.warn("No token found, skipping fetch booked passengers");
      return;
    }
    
    const authHeader = stored.startsWith("Bearer ")
      ? stored
      : `Bearer ${stored}`;

    const response = await fetch(`${apiBase}/teller-booking/book-passenger`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Fetched booked passengers:", result);

      if (result.success && result.data?.booked_passengers) {
        // Map API response to display format
        passengers.value = result.data.booked_passengers.map((p) => ({
          date: p.travel_date,
          route: p.route_snapshot,
          schedule: p.schedule_snapshot,
          category: "Passenger",
          type: p.passenger_type_snapshot,
          accommodation: p.passenger_category_snapshot,
          gender: p.gender,
          discount: p.discount_id ? String(p.discount_id) : "0",
          fullname: p.fullname,
          seat: p.seat_number_snapshot,
          fare: parseFloat(p.fare).toFixed(2),
          cargoFare: "0.00",
          adminFee: "0.00", // Not in API response
          discountAmount: parseFloat(p.discount_amount).toFixed(2),
          vehicle: null,
          institutionalAccount: p.institutional_account_id ? { id: p.institutional_account_id } : null,
          passengerTypeDetails: { type: p.passenger_type_snapshot },
          bookedPassengerId: p.booked_passenger_id,
          bookingId: p.booking_id,
          scheduleBookingId: p.schedule_booking_id,
          serialNo: p.serial_no,
        }));
      }
    } else {
      console.error("Failed to fetch booked passengers:", response.status);
    }
  } catch (err) {
    console.error("Error fetching booked passengers:", err);
  }
};

// Fetch booked vehicles from API
const fetchBookedVehicles = async () => {
  try {
    const stored = localStorage.getItem("token");
    
    if (!stored) {
      console.warn("No token found, skipping fetch booked vehicles");
      return;
    }
    
    const authHeader = stored.startsWith("Bearer ")
      ? stored
      : `Bearer ${stored}`;

    const response = await fetch(`${apiBase}/teller-booking/book-vehicle`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Fetched booked vehicles:", result);

      if (result.success && result.data?.booked_vehicles) {
        // Map API response to display format
        vehicles.value = result.data.booked_vehicles.map((v) => {
          // Find driver details from passengers array if driver is assigned
          let driverInfo = null;
          if (v.driver_passenger_booking_id) {
            const driverPassenger = passengers.value.find(
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
              // Driver not found in current passengers array
              console.log("Driver not found in passengers:", v.driver_passenger_booking_id, "Available:", passengers.value.map(p => p.bookedPassengerId));
              driverInfo = { id: v.driver_passenger_booking_id };
            }
          }
          
          return {
            date: v.travel_date,
            route: v.route_snapshot,
            schedule: v.schedule_snapshot,
            vehicle: {
              vehicle_class: v.vehicle_type,
              plate_number: v.plate_no,
              rate: parseFloat(v.fare || 0),
            },
            institutionalAccount: v.institutional_account_id ? { id: v.institutional_account_id } : null,
            driver: driverInfo,
            bookedVehicleId: v.booked_vehicle_id,
            bookingId: v.booking_id,
            scheduleBookingId: v.schedule_booking_id,
            serialNo: v.serial_no,
          };
        });
      }
    } else {
      console.error("Failed to fetch booked vehicles:", response.status);
    }
  } catch (err) {
    console.error("Error fetching booked vehicles:", err);
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
  isBookingPassenger.value = true;
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
    serial_no: serialNo.value,
    booking_id: sharedBookingId.value,
    schedule_booking_id: sharedScheduleBookingId.value,
    is_return_trip: returnTrip.value || false,
    travel_date: outboundDate.value,
    schedule_id: outboundSchedule.value?.schedule_id || outboundSchedule.value?.id,
    schedule_snapshot: outboundSchedule.value?.time || outboundSchedule.value,
    route_id: selectedRoute.value?.route_id || selectedRoute.value?.id,
    route_snapshot: `${originPort.value} - ${destinationPort.value}`,
    fullname: fullname.value,
    gender: selectedGender.value.toLowerCase(),
    passenger_type_id: selectedPassengerTypeDetails.value?.p_id || selectedPassengerTypeDetails.value?.id,
    passenger_type_snapshot: selectedPassengerTypeDetails.value?.type || "Regular",
    passenger_category_id: passengerCategory?.id || passengerCategory?.category_id || null,
    passenger_category_snapshot: selectedAccommodation.value,
    seat_id: selectedSeat.value?.id || selectedSeat.value?.seat_id || null,
    seat_number_snapshot: selectedSeat.value?.seat_no || "N/A",
    agent_id: agentId.value,
    fare: parseFloat(discountedFare.toFixed(2)),
    discount_amount: parseFloat(discountAmount.toFixed(2)),
    discount_id: null, // TODO: Map discount if needed
    institutional_account_id: selectedInstitutionalAccount.value?.ia_id || selectedInstitutionalAccount.value?.id || null,
  };

  console.log("Booking passenger:", requestBody);

  try {
    const stored = localStorage.getItem("token");
    
    if (!stored) {
      alert("Authentication required. Please log in again.");
      return;
    }
    
    const authHeader = stored.startsWith("Bearer ") ? stored : `Bearer ${stored}`;

    const response = await fetch(`${apiBase}/teller-booking/book-passenger`, {
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

      // Refresh passenger list from API to check if creation worked
      const previousCount = passengers.value.length;
      await fetchBookedPassengers();
      const newCount = passengers.value.length;

      if (newCount > previousCount) {
        // Passenger was created successfully
        const newPassenger = passengers.value[passengers.value.length - 1];

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
  } finally {
    isBookingPassenger.value = false;
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

const handlePrintingSelected = async (option) => {
  if (option === "e-ticket" || option.id === "eticket") {
    isProcessingPayment.value = true;
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
      
      const grand_total = total_fare + total_admin_fee - total_discount;

      const paymentBody = {
        serial_no: serialNo.value,
        booking_id: bookingIdToUse,
        total_fare: parseFloat(total_fare.toFixed(2)),
        total_discount: parseFloat(total_discount.toFixed(2)),
        grand_total: parseFloat(grand_total.toFixed(2)),
        total_admin_fee: parseFloat(total_admin_fee.toFixed(2)),
        payment_method: selectedPaymentMethod.value?.id || "cash",
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
        resetAfterTransaction();
      } else {
        const error = await response.json();
        console.error("Payment error:", error);
        alert("Payment failed: " + (error.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error processing payment:", err);
      alert("Error processing payment. Please try again.");
    } finally {
      isProcessingPayment.value = false;
    }
  } else {
    // Handle other printing options
    console.log("Printing option selected:", option);
    isPaymentModalOpen.value = false;
  }
};

const resetAfterTransaction = () => {
  passengers.value = [];
  vehicles.value = [];
  sharedBookingId.value = null;
  sharedScheduleBookingId.value = null;
  fullname.value = "";
  selectedDiscount.value = "0";
  selectedCategory.value = "Passenger";
  selectedAccommodation.value = "";
  selectedGender.value = "";
  selectedVehicleDetails.value = null;
  selectedInstitutionalAccount.value = null;
  selectedPassengerTypeDetails.value = regularPassengerType.value;
  isInstitutionalAccount.value = false;
  isManualSeatSelection.value = false;
  selectedSeat.value = null;
  vesselSeatmap.value = null;
  availableSeats.value = [];
  activeTab.value = "Passenger";
  outboundSchedule.value = null;
  generateSerialNo();

  showSuccess.value = true;
  setTimeout(() => (showSuccess.value = false), 3000);
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

const totalOriginalFare = computed(() => {
  const passengerFare = filteredPassengers.value.reduce(
    (sum, p) => sum + Number(p.fare) + Number(p.discountAmount),
    0,
  );
  const vehicleFare = filteredVehicles.value.reduce(
    (sum, v) => sum + Number(v.vehicle?.rate || 0),
    0,
  );
  return passengerFare + vehicleFare;
});

const totalFare = computed(() =>
  filteredPassengers.value.reduce((sum, p) => sum + parseFloat(p.fare), 0),
);
const totalCargo = computed(() =>
  filteredPassengers.value.reduce((sum, p) => sum + parseFloat(p.cargoFare), 0),
);
const totalAdmin = computed(() => {
  // Admin fee: 2 pesos per passenger, 25 pesos per vehicle
  return (filteredPassengers.value.length * 2) + (filteredVehicles.value.length * 25);
});
const totalDiscount = computed(() =>
  filteredPassengers.value.reduce(
    (sum, p) => sum + parseFloat(p.discountAmount || 0),
    0,
  ),
);
const totalAmount = computed(() => {
  const vehicleFare = filteredVehicles.value.reduce(
    (sum, v) => sum + Number(v.vehicle?.rate || 0),
    0,
  );
  return (
    totalOriginalFare.value +
    totalCargo.value +
    totalAdmin.value -
    totalDiscount.value
  );
});

// Track manually-closed empty tabs
const closedEmptyTabs = ref([]);

// Get unique serial numbers from all bookings
const uniqueSerialNumbers = computed(() => {
  const serials = new Set();
  passengers.value.forEach(p => {
    if (p.bookedPassengerId) serials.add(p.serialNo || serialNo.value);
  });
  vehicles.value.forEach(v => {
    if (v.bookedVehicleId) serials.add(v.serialNo || serialNo.value);
  });
  if (serialNo.value && !closedEmptyTabs.value.includes(serialNo.value)) {
    serials.add(serialNo.value);
  }
  return Array.from(serials);
});

// Serials that have at least one actual booking (passenger or vehicle)
const serialsWithBookings = computed(() => {
  const serials = new Set();
  passengers.value.forEach(p => {
    if (p.bookedPassengerId) serials.add(p.serialNo || serialNo.value);
  });
  vehicles.value.forEach(v => {
    if (v.bookedVehicleId) serials.add(v.serialNo || serialNo.value);
  });
  return Array.from(serials);
});

const handleCloseTab = (serial) => {
  closedEmptyTabs.value.push(serial);
  if (activeSerialTab.value === serial) {
    const remaining = uniqueSerialNumbers.value.filter(s => s !== serial);
    if (remaining.length > 0) {
      activeSerialTab.value = remaining[remaining.length - 1];
    } else {
      generateSerialNo();
    }
  }
};

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

// Filter passengers by active serial tab
const filteredPassengers = computed(() => {
  if (!activeSerialTab.value) return [];
  return passengers.value.filter(p => (p.serialNo || serialNo.value) === activeSerialTab.value);
});

// Filter vehicles by active serial tab
const filteredVehicles = computed(() => {
  if (!activeSerialTab.value) return [];
  return vehicles.value.filter(v => (v.serialNo || serialNo.value) === activeSerialTab.value);
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
      
      if (!stored) {
        alert("Authentication required. Please log in again.");
        return;
      }
      
      const authHeader = stored.startsWith("Bearer ") ? stored : `Bearer ${stored}`;

      const response = await fetch(`${apiBase}/teller-booking/book-passenger/${passenger.bookedPassengerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      });

      // Even if response has error, the deletion might have worked
      // So we refresh the list to check
      const previousCount = passengers.value.length;
      await fetchBookedPassengers();
      const newCount = passengers.value.length;

      if (newCount < previousCount) {
        // Passenger was deleted successfully
        // Unblock the seat
        if (passenger.seat && passenger.seat !== "N/A") {
          const seatToUnblock = availableSeats.value.find(
            (s) => s.seat_no === passenger.seat,
          );
          if (seatToUnblock) {
            seatToUnblock.blocked = false;
          }
        }
        console.log("Passenger deleted successfully");
      } else {
        // Deletion failed
        try {
          const result = await response.json();
          alert("Failed to delete passenger: " + (result.message || result.error || response.statusText));
        } catch {
          alert("Failed to delete passenger");
        }
      }
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
      
      if (!stored) {
        alert("Authentication required. Please log in again.");
        return;
      }
      
      const authHeader = stored.startsWith("Bearer ") ? stored : `Bearer ${stored}`;

      const response = await fetch(`${apiBase}/teller-booking/book-vehicle/${vehicle.bookedVehicleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      });

      // Even if response has error, the deletion might have worked
      // So we refresh the list to check
      const previousCount = vehicles.value.length;
      await fetchBookedVehicles();
      const newCount = vehicles.value.length;

      if (newCount < previousCount) {
        // Vehicle was deleted successfully
        console.log("Vehicle deleted successfully");
      } else {
        // Deletion failed
        try {
          const result = await response.json();
          alert("Failed to delete vehicle: " + (result.message || result.error || response.statusText));
        } catch {
          alert("Failed to delete vehicle");
        }
      }
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

      const requestBody = {
        plateNo: vehicle.vehicle.plate_number,
        driver_passenger_booking_id: String(passenger.bookedPassengerId),
      };
      
      console.log("Assigning driver to vehicle:", {
        url: `${apiBase}/teller-booking/book-vehicle/${vehicle.bookedVehicleId}`,
        method: "PATCH",
        body: requestBody,
      });

      const response = await fetch(`${apiBase}/teller-booking/book-vehicle/${vehicle.bookedVehicleId}`, {
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
        // Refresh vehicle list from backend to sync
        await fetchBookedVehicles();
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

    const response = await fetch(`${apiBase}/teller-booking/book-vehicle/${vehicle.bookedVehicleId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        plateNo: vehicle.vehicle.plate_number,
        driver_passenger_booking_id: null,
      }),
    });

    if (response.ok) {
      console.log("Driver removed successfully");
      // Refresh vehicle list from backend
      await fetchBookedVehicles();
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
  <!-- Fixed-position modals and toasts — unaffected by layout -->
  <ViewTellerPassenger
    :isOpen="isViewPassengerOpen"
    :passenger="selectedPassenger"
    @close="closePassengerView"
    @edit="editPassengerFromModal"
  />
  <ModalPaymentSelection
    :isOpen="isPaymentModalOpen"
    :passengers="filteredPassengers"
    :vehicles="filteredVehicles"
    :isProcessingPayment="isProcessingPayment"
    @close="isPaymentModalOpen = false"
    @paymentSelected="handlePaymentSelected"
    @printingSelected="handlePrintingSelected"
  />
  <div
    v-if="showSuccess"
    class="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold text-base transition-all duration-300"
  >
    Passenger Added!
  </div>
  <VehicleSelection
    :isOpen="isVehicleModalOpen"
    :routeId="selectedRoute?.route_id || selectedRoute?.id"
    @close="isVehicleModalOpen = false"
    @save="handleVehicleSave"
  />
  <IaModal
    :isOpen="isIaModalOpen"
    @close="isIaModalOpen = false"
    @select="handleIaSelect"
  />
  <PassengerTypeModal
    :isOpen="isPassengerTypeModalOpen"
    @close="isPassengerTypeModalOpen = false"
    @select="handlePassengerTypeSelect"
  />

  <!-- Full-viewport shell: header fixed on top, panels below -->
  <div class="h-screen flex flex-col overflow-hidden">
    <TellerHeader
      :serialNo="serialNo"
      :uniqueSerialNumbers="uniqueSerialNumbers"
      :activeSerialTab="activeSerialTab"
      :serialsWithBookings="serialsWithBookings"
      @update:activeSerialTab="activeSerialTab = $event"
      @newTransaction="handleNewTransaction"
      @closeTab="handleCloseTab"
    />
    <main class="flex-1 min-h-0 overflow-hidden">
      <div class="h-full w-full grid grid-cols-[0.75fr_1.25fr]">
        <div
          class="left-panel h-full flex flex-col overflow-hidden bg-white"
        >
        <div class="top-header border-b border-gray-200 px-10 py-6 flex-shrink-0">
          <!-- Route + action -->
          <div class="flex items-start justify-between mb-5">
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Active Route</p>
              <p class="text-2xl font-bold text-gray-900 leading-tight">
                {{ originPort }}
                <span class="text-gray-400 font-normal mx-1">→</span>
                {{ destinationPort }}
              </p>
              <p class="text-sm text-gray-400 mt-1">{{ outboundSchedule?.code || 'No vessel selected' }}</p>
            </div>
            <button
              class="mt-1 flex items-center gap-1.5 text-sm text-gray-500 border border-gray-300 px-3 py-1.5 rounded-lg hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Different Port
            </button>
          </div>

          <!-- Stats row -->
          <div class="grid grid-cols-3 divide-x divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            <div class="px-5 py-3">
              <p class="text-xs text-gray-400 mb-1.5">Date</p>
              <div class="flex items-center gap-2">
                <CalendarDaysIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span class="text-sm font-semibold text-gray-800 truncate">
                  {{ outboundDate || '—' }}
                  <span v-if="returnTrip && returnDate" class="text-gray-400 font-normal"> ⇄ {{ returnDate }}</span>
                </span>
              </div>
            </div>
            <div class="px-5 py-3">
              <p class="text-xs text-gray-400 mb-1.5">Schedule</p>
              <div class="flex items-center gap-2">
                <ClockIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span class="text-sm font-semibold text-gray-800">{{ outboundSchedule?.time || '—' }}</span>
              </div>
            </div>
            <div class="px-5 py-3">
              <p class="text-xs text-gray-400 mb-1.5">Passengers</p>
              <div class="flex items-center gap-2">
                <UserIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span class="text-sm font-semibold text-gray-800">{{ filteredPassengers.length }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Payment Breakdown Section -->
        <div class="main-body flex-1 overflow-y-auto scrollbar-hidden pt-8 pb-4 pl-10 pr-10">
          <div class="mb-6">
            <p class="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Payment Breakdown</p>
            <div class="rounded-lg border border-gray-200 overflow-hidden">
              <div class="divide-y divide-gray-100">
                <div class="flex justify-between items-center px-4 py-2.5">
                  <span class="text-sm text-gray-500">Fare</span>
                  <span class="text-sm font-medium text-gray-800">₱{{ totalOriginalFare.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between items-center px-4 py-2.5">
                  <span class="text-sm text-gray-500">Cargo Rate</span>
                  <span class="text-sm font-medium text-gray-800">₱{{ totalCargo.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between items-center px-4 py-2.5">
                  <span class="text-sm text-gray-500">Admin Fee</span>
                  <span class="text-sm font-medium text-gray-800">₱{{ totalAdmin.toFixed(2) }}</span>
                </div>
                <div v-if="totalDiscount > 0" class="flex justify-between items-center px-4 py-2.5">
                  <span class="text-sm text-gray-500">Discount</span>
                  <span class="text-sm font-medium text-green-600">−₱{{ totalDiscount.toFixed(2) }}</span>
                </div>
              </div>
              <div class="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200">
                <span class="text-sm font-semibold text-gray-600">Total Due</span>
                <span class="text-xl font-bold text-gray-900">₱{{ totalAmount.toFixed(2) }}</span>
              </div>
            </div>
          </div>
          
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <p class="text-xs font-semibold text-gray-600 uppercase tracking-widest">Passenger List</p>
              <span v-if="selectedInstitutionalAccount" class="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                {{ selectedInstitutionalAccount.ia_name }}
              </span>
            </div>

            <div class="rounded-lg border border-gray-200 overflow-hidden">
              <!-- Empty state -->
              <div v-if="filteredPassengers.length === 0" class="py-10 flex flex-col items-center gap-2">
                <UserIcon class="w-7 h-7 text-gray-300" />
                <p class="text-sm text-gray-400">No passengers added yet</p>
              </div>

              <!-- Table -->
              <table v-else class="w-full">
                <thead>
                  <tr class="bg-gray-50 border-b border-gray-200">
                    <th class="px-3 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                    <th class="px-3 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Seat</th>
                    <th class="px-3 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Fare</th>
                    <th class="px-3 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                    <th class="px-3 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Class</th>
                    <th class="px-3 py-2.5"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr
                    v-for="(p, index) in filteredPassengers"
                    :key="index"
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <td class="px-3 py-2.5 text-sm font-medium text-gray-900">{{ p.fullname }}</td>
                    <td class="px-3 py-2.5 text-sm text-gray-500">{{ p.seat }}</td>
                    <td class="px-3 py-2.5 text-sm text-gray-700">
                      ₱{{ p.fare }}
                      <span v-if="parseFloat(p.discountAmount) > 0" class="text-xs text-green-600 ml-0.5">
                        (−₱{{ p.discountAmount }})
                      </span>
                    </td>
                    <td class="px-3 py-2.5 text-sm text-gray-500 capitalize">{{ p.passengerTypeDetails?.type || 'Regular' }}</td>
                    <td class="px-3 py-2.5 text-sm text-gray-500">{{ p.accommodation }}</td>
                    <td class="px-3 py-2.5">
                      <div class="flex items-center justify-end gap-0.5">
                        <button
                          @click="openPassengerView(p)"
                          title="Edit"
                          class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          @click="removePassenger(p)"
                          title="Remove"
                          class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          <!-- Vehicle List Section -->
          <div class="mb-6 mt-6">
            <p class="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Vehicle List</p>

            <div class="rounded-lg border border-gray-200 overflow-hidden">
              <!-- Empty state -->
              <div v-if="filteredVehicles.length === 0" class="py-10 flex flex-col items-center gap-2">
                <svg class="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <p class="text-sm text-gray-400">No vehicles added yet</p>
              </div>

              <!-- Vehicle rows -->
              <div v-else class="divide-y divide-gray-100">
                <div
                  v-for="(v, index) in filteredVehicles"
                  :key="index"
                  class="px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex-1 min-w-0">
                      <!-- Vehicle class + plate + fare -->
                      <div class="flex items-center gap-2 mb-1.5">
                        <span class="text-sm font-semibold text-gray-900">{{ v.vehicle.vehicle_class || v.vehicle.type || 'Vehicle' }}</span>
                        <span class="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{{ v.vehicle.plate_number || 'N/A' }}</span>
                        <span class="text-sm font-semibold text-gray-700 ml-auto">₱{{ parseFloat(v.vehicle.rate || 0).toFixed(2) }}</span>
                      </div>
                      <!-- Driver row -->
                      <div class="flex items-center gap-1.5">
                        <span class="text-xs text-gray-400">Driver:</span>
                        <template v-if="v.driver">
                          <span class="text-xs font-medium text-gray-600">{{ v.driver.fullname }}</span>
                          <button
                            @click="removeDriver(v)"
                            title="Remove driver"
                            class="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </template>
                        <button
                          v-else
                          @click="openDriverSelection(v)"
                          class="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          + Assign driver
                        </button>
                      </div>
                    </div>

                    <!-- Remove vehicle -->
                    <button
                      @click="removeVehicle(v)"
                      title="Remove vehicle"
                      class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Driver Selection Modal -->
          <transition name="modal-fade">
            <div
              v-if="isDriverSelectionOpen"
              class="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
              @click="isDriverSelectionOpen = false"
            >
              <div
                class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden"
                @click.stop
              >
                <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 class="text-xl font-semibold text-gray-800">Select Driver from Passenger List</h3>
                  <button
                    @click="isDriverSelectionOpen = false"
                    class="text-gray-400 hover:text-gray-600"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div class="p-6 overflow-y-auto max-h-[60vh]">
                  <div v-if="passengers.length === 0" class="text-center py-8 text-gray-500">
                    No passengers available. Please add passengers first.
                  </div>
                  
                  <div v-else class="space-y-2">
                    <button
                      v-for="(passenger, index) in passengers"
                      :key="index"
                      @click="assignDriver(passenger)"
                      class="w-full p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-400 rounded-lg text-left transition-all"
                    >
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="font-semibold text-gray-900">{{ passenger.fullname }}</p>
                          <div class="flex gap-4 mt-1 text-sm text-gray-600">
                            <span>{{ passenger.type }}</span>
                            <span>•</span>
                            <span>{{ passenger.gender }}</span>
                            <span>•</span>
                            <span>Seat {{ passenger.seat }}</span>
                          </div>
                        </div>
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </transition>

        </div>

        <!-- Action Buttons — pinned to bottom -->
        <div class="flex-shrink-0 bg-white border-t-2 border-gray-300">
          <div class="px-10 py-4 flex items-center justify-between">
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
                @click="proceedToPayment"
              >
                Proceed To Payment
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        ref="rightPanel"
        class="right-panel bg-gray-100 h-full overflow-y-auto scrollbar-hidden"
      >
        <div
          class="flex flex-col gap-8 border-b border-gray-300 pt-8 pb-8 pl-10 pr-10"
        >
          <div class="top__part flex gap-5">
            <div>
              <h3 class="text-base font-medium text-gray-700 mb-3">
                {{ returnTrip ? "Outbound Date" : "Select Date" }}
              </h3>
              <input
                type="date"
                v-model="outboundDate"
                class="text-base text-gray-900 p-3 bg-white rounded-lg border border-gray-300"
              />
            </div>
            <div v-if="returnTrip">
              <h3 class="text-base font-medium text-gray-700 mb-3">
                Return Date
              </h3>
              <input
                type="date"
                v-model="returnDate"
                :min="outboundDate"
                class="text-base text-gray-900 p-3 bg-white rounded-lg border border-gray-300"
              />
            </div>
            <div class="flex-1">
              <h3 class="text-base font-medium text-gray-700 mb-3">
                Select Route
              </h3>
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
            </div>
          </div>
          <div>
            <div class="flex gap-4 items-center mb-3 justify-between">
              <h3 class="text-base font-medium text-gray-700">
                {{ returnTrip ? "Outbound Schedule" : "Select Schedule" }}
              </h3>

              <!-- Only show if a schedule is selected -->
              <span
                v-if="outboundSchedule"
                class="text-sm flex gap-2 items-center justify-center cursor-pointer font-medium text-blue-900"
                @click="outboundSchedule = null"
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
                  @click="outboundSchedule = time"
                  :class="[
                    'p-3 text-center rounded-lg text-base border-2 transition-all duration-300',
                    outboundSchedule?.id === time.id
                      ? 'border-2 bg-blue-900 text-white'
                      : 'bg-white text-gray-700 border-gray-300 hover:shadow-[0_0_0_2px_#3b3b3b]',
                  ]"
                >
                  <div class="font-medium">{{ time.time }}</div>
                  <div class="text-xs opacity-75">{{ time.code }}</div>
                </button>
              </div>
            </div>

            <!-- Port B Schedules (Return) -->
            <div v-if="filteredSchedules.portB.length > 0" class="mb-8">
              <h4 class="text-sm font-semibold text-gray-600 mb-3">
                <span v-if="returnTrip">Return - </span>
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
                  @click="returnTrip ? (returnSchedule = time) : (outboundSchedule = time)"
                  :class="[
                    'p-3 text-center rounded-lg text-base border-2 transition-all duration-300',
                    returnTrip
                      ? (returnSchedule?.id === time.id ? 'border-2 bg-blue-900 text-white' : 'bg-white text-gray-700 border-gray-300 hover:shadow-[0_0_0_2px_#3b3b3b]')
                      : (outboundSchedule?.id === time.id ? 'border-2 bg-blue-900 text-white' : 'bg-white text-gray-700 border-gray-300 hover:shadow-[0_0_0_2px_#3b3b3b]'),
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

          <!-- I.A Checkbox - Before tabs so it applies to both -->
          <div v-if="outboundSchedule">
            <label class="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-300 cursor-pointer hover:border-blue-500 transition-colors">
              <input
                type="checkbox"
                v-model="isInstitutionalAccount"
                @change="handleIaCheckboxChange"
                class="theme-checkbox w-5 h-5"
              />
              <div class="flex-1">
                <span class="text-base font-medium text-gray-700">Institutional Account (I.A)</span>
                <p class="text-xs text-gray-500 mt-0.5">Check if this booking is for an institutional account</p>
              </div>
            </label>
          </div>

          <!-- Passenger/Vehicle Tabs -->
          <div v-if="outboundSchedule">
            <div class="flex gap-2 border-b border-gray-300 mb-6">
              <button
                @click="activeTab = 'Passenger'"
                :class="[
                  'px-6 py-3 text-base font-medium transition-all',
                  activeTab === 'Passenger'
                    ? 'border-b-2 border-blue-900 text-blue-900'
                    : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                Passenger
              </button>
              <button
                @click="activeTab = 'Vehicle'"
                :class="[
                  'px-6 py-3 text-base font-medium transition-all',
                  activeTab === 'Vehicle'
                    ? 'border-b-2 border-blue-900 text-blue-900'
                    : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                Vehicle
              </button>
            </div>
          </div>

          <!-- Vehicle Flow: Just vehicle selection -->
          <div v-if="activeTab === 'Vehicle' && outboundSchedule" class="space-y-6">
            <div class="text-center py-8">
              <div class="max-w-md mx-auto">
                <div class="mb-6">
                  <svg class="w-16 h-16 mx-auto text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h3 class="text-xl font-semibold text-gray-800 mb-2">Book Vehicle</h3>
                  <p class="text-gray-600">Click below to select a vehicle and enter plate number</p>
                </div>
                <button
                  @click="isVehicleModalOpen = true"
                  class="px-6 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
                >
                  Select Vehicle
                </button>
                <div v-if="selectedVehicleDetails" class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p class="text-sm text-gray-600 mb-1">Selected Vehicle:</p>
                  <p class="text-lg font-bold text-blue-900">
                    {{ selectedVehicleDetails.vehicle_class || selectedVehicleDetails.type || "Vehicle" }}
                  </p>
                  <p v-if="selectedVehicleDetails.plate_number" class="text-sm text-gray-600 mt-1">
                    Plate: {{ selectedVehicleDetails.plate_number }}
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Book Entry Button for Vehicle -->
            <button
              v-if="selectedVehicleDetails"
              @click="bookVehicleEntry"
              :disabled="isBookingVehicle"
              class="w-full p-4 rounded-lg text-base font-medium transition-all duration-300 bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="isBookingVehicle" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 22 6.477 22 12h-4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {{ isBookingVehicle ? 'Booking...' : 'Book Entry' }}
            </button>
          </div>

          <!-- Selected Institutional Account Display - Shows for both tabs -->
          <div
            v-if="isInstitutionalAccount && selectedInstitutionalAccount"
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

          <!-- Passenger Accommodation - Only for Passenger tab -->
          <div v-if="activeTab === 'Passenger' && outboundSchedule">
            <h3 class="text-base font-medium text-gray-700 mb-3">
              Choose Passenger Accommodation
            </h3>
            <div class="grid gap-5" style="grid-template-columns: 1fr 1fr 1fr 0.5fr;">
              <button
                @click="handleAccommodationClick('Economy')"
                :class="[
                  'p-3 text-center rounded-lg text-base border border-gray-300 transition-all duration-300',
                  selectedAccommodation === 'Economy'
                    ? 'bg-blue-900 text-white font-medium'
                    : 'bg-white hover:shadow-[0_0_0_2px_#3b3b3b]',
                ]"
              >
                Economy
              </button>
              <button
                @click="handleAccommodationClick('Premium Economy')"
                :class="[
                  'p-3 text-center rounded-lg text-base border border-gray-300 transition-all duration-300',
                  selectedAccommodation === 'Premium Economy'
                    ? 'bg-blue-900 text-white font-medium'
                    : 'bg-white hover:shadow-[0_0_0_2px_#3b3b3b]',
                ]"
              >
                Premium Economy
              </button>
              <button
                @click="handleAccommodationClick('Business Class')"
                :class="[
                  'p-3 text-center rounded-lg text-base border border-gray-300 transition-all duration-300',
                  selectedAccommodation === 'Business Class'
                    ? 'bg-blue-900 text-white font-medium'
                    : 'bg-white hover:shadow-[0_0_0_2px_#3b3b3b]',
                ]"
              >
                Business Class
              </button>
              <button
                @click="handleAccommodationClick('Senior/PWD')"
                :class="[
                  'p-3 text-center rounded-lg text-sm border border-gray-300 transition-all duration-300',
                  selectedAccommodation === 'Senior/PWD'
                    ? 'bg-blue-900 text-white font-medium'
                    : 'bg-white hover:shadow-[0_0_0_2px_#3b3b3b]',
                ]"
              >
                PWD
              </button>
            </div>
          </div>

          <!-- Seatmap Display -->
          <div v-if="activeTab === 'Passenger' && selectedAccommodation">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-base font-medium text-gray-700">
                Select Your Seat
              </h3>
              <button
                v-if="!isManualSeatSelection && availableSeats.length > 0"
                @click="isManualSeatSelection = true"
                class="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Select a Seat
              </button>
            </div>

            <!-- Loading State -->
            <div v-if="loadingSeatmap" class="text-center py-8">
              <div
                class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"
              ></div>
              <p class="text-gray-600 mt-2">Loading seatmap...</p>
            </div>

            <!-- Auto-selected Seat Info -->
            <div
              v-if="!isManualSeatSelection && selectedSeat"
              class="p-4 bg-green-50 rounded-lg border border-green-200"
            >
              <p class="text-sm font-medium text-green-900">
                Auto-selected Seat: <span class="font-bold text-lg">{{ selectedSeat.seat_no }}</span>
              </p>
              <p class="text-xs text-green-700 mt-1">
                This seat has been automatically assigned. Click "Select a Seat" to choose a different one.
              </p>
            </div>

            <!-- Seatmap (only shown when manual selection is active) -->
            <div
              v-else-if="isManualSeatSelection && availableSeats.length > 0"
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

              <!-- Done Button -->
              <button
                v-if="selectedSeat"
                @click="isManualSeatSelection = false"
                class="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Confirm Seat
              </button>
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

          <!-- Passenger Information -->
          <div v-if="activeTab === 'Passenger' && selectedAccommodation">
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
          
          <!-- Passenger Type and Gender in one row -->
          <div v-if="activeTab === 'Passenger' && fullname">
            <h3 class="text-base font-medium text-gray-700 mb-3">
              Passenger Type & Gender
            </h3>
            <div class="grid grid-cols-3 gap-5">
              <button
                @click="isPassengerTypeModalOpen = true"
                :class="[
                  'p-3 text-center rounded-lg text-base border border-gray-300 transition-all duration-300',
                  selectedPassengerTypeDetails
                    ? 'bg-blue-900 text-white font-medium'
                    : 'bg-white hover:shadow-[0_0_0_2px_#3b3b3b]',
                ]"
              >
                {{ selectedPassengerTypeDetails ? selectedPassengerTypeDetails.type : 'Select Type' }}
              </button>
              <button
                @click="selectedGender = 'Male'"
                :class="[
                  'p-3 text-center rounded-lg text-base border border-gray-300 transition-all duration-300',
                  selectedGender === 'Male'
                    ? 'bg-blue-900 text-white font-medium'
                    : 'bg-white hover:shadow-[0_0_0_2px_#3b3b3b]',
                ]"
              >
                Male
              </button>
              <button
                @click="selectedGender = 'Female'"
                :class="[
                  'p-3 text-center rounded-lg text-base border border-gray-300 transition-all duration-300',
                  selectedGender === 'Female'
                    ? 'bg-blue-900 text-white font-medium'
                    : 'bg-white hover:shadow-[0_0_0_2px_#3b3b3b]',
                ]"
              >
                Female
              </button>
            </div>
            
            <!-- Selected Passenger Type Info -->
            <div v-if="selectedPassengerTypeDetails" class="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div class="flex items-center gap-2 text-sm">
                <span class="text-gray-600">Type:</span>
                <span class="font-medium text-blue-900 capitalize">{{ selectedPassengerTypeDetails.type }}</span>
                <span
                  v-if="parseFloat(selectedPassengerTypeDetails.discount) > 0"
                  class="text-xs text-green-600 font-medium ml-2"
                >
                  ({{ (parseFloat(selectedPassengerTypeDetails.discount) * 100).toFixed(0) }}% Discount)
                </span>
                <span
                  v-if="selectedPassengerTypeDetails.waived"
                  class="text-xs text-orange-600 font-medium ml-2"
                >
                  (Fee Waived)
                </span>
              </div>
            </div>
          </div>
          <!-- Discount Selection - Hidden for now -->
          <!-- <div v-if="activeTab === 'Passenger' && selectedGender">
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
                {{ discount.label }} <span v-if="discount.percent !== '0%'" class="font-semibold">({{ discount.percent }})</span>
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
          </div> -->
          <button
            v-if="activeTab === 'Passenger' && selectedGender"
            @click="bookEntry"
            :disabled="isBookingPassenger"
            :class="[
              'w-full p-4 rounded-lg text-base font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed',
              bookingActive
                ? 'bg-white shadow-border-brand-color font-medium'
                : 'bg-orange-500 text-white hover:bg-orange-600',
            ]"
          >
            <svg v-if="isBookingPassenger" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 22 6.477 22 12h-4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {{ isBookingPassenger ? 'Booking...' : 'Book Entry' }}
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
  </div>
</template>
