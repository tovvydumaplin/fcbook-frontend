<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  isOpen: { type: Boolean, default: false },
});
const emit = defineEmits(["close"]);

const apiBase = import.meta.env.VITE_API_URL;

// ─── State ────────────────────────────────────────────────────────────────────
const payments        = ref([]);
const loading         = ref(false);
const loadingDetail   = ref(false);
const selectedPayment = ref(null);
const selectedId      = ref(null);

// ─── Search ───────────────────────────────────────────────────────────────────
const search = ref("");
const filteredPayments = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return payments.value;
  return payments.value.filter(p =>
    p.booking_number?.toLowerCase().includes(q) ||
    p.reference_number?.toLowerCase().includes(q) ||
    p.route_snapshot?.toLowerCase().includes(q) ||
    p.vessel_snapshot?.toLowerCase().includes(q)
  );
});

// ─── Fetch list ───────────────────────────────────────────────────────────────
const fetchPayments = async () => {
  loading.value = true;
  payments.value = [];
  selectedPayment.value = null;
  selectedId.value = null;
  try {
    const stored = localStorage.getItem("token");
    if (!stored) return;
    const auth = stored.startsWith("Bearer ") ? stored : `Bearer ${stored}`;
    const res = await fetch(`${apiBase}/teller-booking/completed-bookings`, {
      headers: { "Content-Type": "application/json", Authorization: auth },
    });
    if (res.ok) {
      const json = await res.json();
      payments.value = json.data?.bookings ?? json.bookings ?? [];
      // Auto-select the first one
      if (payments.value.length > 0) selectBooking(payments.value[0]);
    }
  } catch (err) {
    console.error("❌ fetchPayments error:", err);
  } finally {
    loading.value = false;
  }
};

// ─── Fetch detail ─────────────────────────────────────────────────────────────
const selectBooking = async (p) => {
  if (selectedId.value === p.booking_payment_id) return;
  selectedId.value = p.booking_payment_id;
  selectedPayment.value = null;
  loadingDetail.value = true;
  try {
    const stored = localStorage.getItem("token");
    if (!stored) return;
    const auth = stored.startsWith("Bearer ") ? stored : `Bearer ${stored}`;
    const res = await fetch(`${apiBase}/teller-booking/completed-bookings/${p.booking_payment_id}`, {
      headers: { "Content-Type": "application/json", Authorization: auth },
    });
    if (res.ok) {
      const json = await res.json();
      selectedPayment.value = json.payment ?? json.data?.payment ?? null;
    }
  } catch (err) {
    console.error("selectBooking error:", err);
  } finally {
    loadingDetail.value = false;
  }
};

// ─── Generate helpers ─────────────────────────────────────────────────────────
const openGeneratedDoc = async (url) => {
  const stored = localStorage.getItem("token");
  if (!stored) return;
  const auth = stored.startsWith("Bearer ") ? stored : `Bearer ${stored}`;
  const res = await fetch(url, { headers: { Authorization: auth } });
  if (!res.ok) { console.error("generate doc failed:", res.status); return; }
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const json = await res.json();
    const link = json.url ?? json.data?.url ?? null;
    if (link) window.open(link, "_blank");
  } else {
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
  }
};

// ─── Generate e-ticket (booking level) ───────────────────────────────────────
const generatingEticket = ref(false);
const generateEticket = async () => {
  const bookingNumber = selectedPayment.value?.booking?.booking_number;
  if (!bookingNumber) return;
  generatingEticket.value = true;
  try {
    await openGeneratedDoc(`${apiBase}/teller-booking/generate-eticket?booking_number=${encodeURIComponent(bookingNumber)}`);
  } catch (err) {
    console.error("generateEticket error:", err);
  } finally {
    generatingEticket.value = false;
  }
};

// ─── Generate ticket ─────────────────────────────────────────────────────────
const generatingTicket = ref(false);
const generateTicket = async () => {
  const bookingNumber = selectedPayment.value?.booking?.booking_number;
  if (!bookingNumber) return;
  generatingTicket.value = true;
  try {
    await openGeneratedDoc(`${apiBase}/teller-booking/generate-ticket?booking_number=${encodeURIComponent(bookingNumber)}`);
  } catch (err) {
    console.error("generateTicket error:", err);
  } finally {
    generatingTicket.value = false;
  }
};

const generatingWaybill = ref(false);
const generateWaybill = async () => {
  const bookingNumber = selectedPayment.value?.booking?.booking_number;
  if (!bookingNumber) return;
  generatingWaybill.value = true;
  try {
    await openGeneratedDoc(`${apiBase}/teller-booking/generate-waybill?booking_number=${encodeURIComponent(bookingNumber)}`);
  } catch (err) {
    console.error("generateWaybill error:", err);
  } finally {
    generatingWaybill.value = false;
  }
};

// ─── Close ────────────────────────────────────────────────────────────────────
const closeModal = () => {
  search.value = "";
  emit("close");
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const creatorName = (c) => {
  if (!c) return "—";
  if (c.first_name || c.last_name)
    return [c.first_name, c.middle_name, c.last_name].filter(Boolean).join(" ");
  return c.full_name || c.name || c.username || "—";
};

const resolvedCreator = computed(() => {
  const p = selectedPayment.value;
  if (!p) return null;
  return p.creator ?? p.booking?.creator ?? p.agent ?? p.booking?.agent ?? null;
});

const fmtDate = (val) => {
  if (!val) return "—";
  try { return new Date(val).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return val; }
};

const fmtTime = (val) => {
  if (!val) return null;
  try {
    const [h, m] = val.split(":");
    const hour = parseInt(h, 10);
    return `${((hour % 12) || 12)}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  } catch { return val; }
};

const fmtMoney = (val) => `₱${parseFloat(val || 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

const modeColor = (mode) => {
  const m = (mode || "").toLowerCase();
  if (m === "cash")    return "bg-emerald-100 text-emerald-700";
  if (m === "gcash")   return "bg-blue-100 text-blue-700";
  if (m === "check")   return "bg-amber-100 text-amber-700";
  if (m === "credit")  return "bg-purple-100 text-purple-700";
  if (m === "prepaid") return "bg-orange-100 text-orange-700";
  return "bg-gray-100 text-gray-600";
};

// ─── Watch open ───────────────────────────────────────────────────────────────
watch(() => props.isOpen, (open) => { if (open) fetchPayments(); });
</script>

<template>
  <transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      @click="closeModal"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col"
        style="height: 88vh;"
        @click.stop
      >

        <!-- ── Header ──────────────────────────────────────────────────────── -->
        <div class="bg-[#1e3a8a] px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 class="text-white text-lg font-bold leading-tight">Completed Bookings</h2>
            <p class="text-blue-300 text-xs mt-0.5">{{ payments.length }} record{{ payments.length !== 1 ? "s" : "" }}</p>
          </div>
          <div class="flex items-center gap-3">
            <!-- Search -->
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="search"
                type="text"
                placeholder="Search bookings…"
                class="pl-9 pr-4 py-1.5 text-sm bg-[#162d6e] text-white placeholder-blue-400 border border-blue-600 rounded-lg focus:outline-none focus:border-blue-400 w-52"
              />
            </div>
            <button @click="closeModal" class="text-blue-300 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- ── Body: split panel ───────────────────────────────────────────── -->
        <div class="flex flex-1 min-h-0">

          <!-- ── LEFT: Booking list ────────────────────────────────────────── -->
          <div class="w-80 flex-shrink-0 border-r border-gray-200 flex flex-col min-h-0">

            <!-- Loading -->
            <div v-if="loading" class="flex-1 flex items-center justify-center">
              <div class="text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p class="text-xs text-gray-400">Loading…</p>
              </div>
            </div>

            <!-- Empty -->
            <div v-else-if="filteredPayments.length === 0" class="flex-1 flex flex-col items-center justify-center p-6 text-gray-400">
              <svg class="w-12 h-12 mb-2 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-sm">{{ search ? "No results" : "No bookings yet" }}</p>
            </div>

            <!-- List -->
            <div v-else class="flex-1 overflow-y-auto divide-y divide-gray-100">
              <button
                v-for="p in filteredPayments"
                :key="p.booking_payment_id"
                @click="selectBooking(p)"
                :class="[
                  'w-full text-left px-4 py-3.5 transition-all relative',
                  selectedId === p.booking_payment_id
                    ? 'bg-blue-50 border-l-[3px] border-l-blue-600'
                    : 'border-l-[3px] border-l-transparent hover:bg-gray-50'
                ]"
              >
                <!-- Booking number + payment badge -->
                <div class="flex items-center justify-between mb-1.5">
                  <span class="font-mono text-xs font-bold text-blue-700">{{ p.booking_number || `#${p.booking_payment_id}` }}</span>
                  <span :class="['text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize', modeColor(p.payment_method)]">
                    {{ p.payment_method || "—" }}
                  </span>
                </div>
                <!-- Route -->
                <p class="text-sm font-medium text-gray-800 truncate leading-snug">{{ p.route_snapshot || "—" }}</p>
                <!-- Vessel + time -->
                <p class="text-xs text-gray-400 mt-0.5 truncate">
                  {{ p.vessel_snapshot }}
                  <span v-if="p.schedule?.departure_time"> · {{ fmtTime(p.schedule.departure_time) }}</span>
                </p>
                <!-- Date + amount -->
                <div class="flex items-center justify-between mt-2">
                  <span class="text-xs text-gray-400">{{ fmtDate(p.travel_date) }}</span>
                  <span class="text-sm font-bold text-gray-800">{{ fmtMoney(p.grand_total) }}</span>
                </div>
              </button>
            </div>
          </div>

          <!-- ── RIGHT: Detail panel ───────────────────────────────────────── -->
          <div class="flex-1 min-h-0 overflow-y-auto bg-gray-50">

            <!-- Nothing selected -->
            <div v-if="!selectedId" class="h-full flex flex-col items-center justify-center text-gray-400 p-10">
              <svg class="w-16 h-16 mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p class="text-sm font-medium">Select a booking to view details</p>
            </div>

            <!-- Loading detail -->
            <div v-else-if="loadingDetail" class="h-full flex items-center justify-center">
              <div class="text-center">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <p class="text-sm text-gray-400">Loading details…</p>
              </div>
            </div>

            <!-- Detail content -->
            <div v-else-if="selectedPayment" class="p-6 space-y-5">

              <!-- Booking number hero -->
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Booking Number</p>
                  <p class="text-2xl font-bold font-mono text-[#1e3a8a]">{{ selectedPayment.booking?.booking_number || "—" }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <span :class="['px-3 py-1 rounded-full text-sm font-semibold capitalize', modeColor(selectedPayment.payment_method)]">
                    {{ selectedPayment.payment_method || "—" }}
                  </span>
                  <!-- Generate E-Ticket -->
                  <button
                    @click="generateEticket"
                    :disabled="generatingEticket || !selectedPayment.booking?.booking_number"
                    class="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg v-if="generatingEticket" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    {{ generatingEticket ? "Generating…" : "Generate E-Ticket" }}
                  </button>
                  <button
                    @click="generateTicket"
                    :disabled="generatingTicket || !selectedPayment.booking?.booking_number"
                    class="flex items-center gap-1.5 px-4 py-1.5 bg-[#1e3a8a] text-white text-sm font-semibold rounded-lg hover:bg-[#162d6e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg v-if="generatingTicket" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    {{ generatingTicket ? "Generating…" : "Generate Ticket" }}
                  </button>
                  <!-- Waybill: only for bookings with vehicles -->
                  <button
                    v-if="selectedPayment.booking?.vehicles?.length"
                    @click="generateWaybill"
                    :disabled="generatingWaybill || !selectedPayment.booking?.booking_number"
                    class="flex items-center gap-1.5 px-4 py-1.5 bg-amber-600 text-white text-sm font-semibold rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg v-if="generatingWaybill" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {{ generatingWaybill ? "Generating…" : "Bill of Lading" }}
                  </button>
                </div>
              </div>

              <!-- Stats row -->
              <div class="grid grid-cols-4 gap-3">
                <div class="bg-white border border-gray-200 rounded-xl px-4 py-3 text-center">
                  <p class="text-2xl font-bold text-blue-700">{{ selectedPayment.booking?.passengers?.length ?? 0 }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">Passengers</p>
                </div>
                <div class="bg-white border border-gray-200 rounded-xl px-4 py-3 text-center">
                  <p class="text-2xl font-bold text-purple-700">{{ selectedPayment.booking?.vehicles?.length ?? 0 }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">Vehicles</p>
                </div>
                <div class="bg-white border border-gray-200 rounded-xl px-4 py-3 text-center col-span-2">
                  <p class="text-2xl font-bold text-emerald-600">{{ fmtMoney(selectedPayment.grand_total) }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">Total Paid</p>
                </div>
              </div>

              <!-- Trip + Payment info row -->
              <div class="grid grid-cols-2 gap-4">

                <!-- Trip info -->
                <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div class="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                    <p class="text-xs font-semibold uppercase tracking-widest text-gray-400">Trip Info</p>
                  </div>
                  <div class="divide-y divide-gray-100 text-sm">
                    <div class="flex justify-between items-center px-4 py-2.5">
                      <span class="text-gray-500">Route</span>
                      <span class="font-medium text-gray-800 text-right text-xs max-w-[55%] truncate">{{ selectedPayment.booking?.route_snapshot || "—" }}</span>
                    </div>
                    <div class="flex justify-between items-center px-4 py-2.5">
                      <span class="text-gray-500">Vessel</span>
                      <span class="font-medium text-gray-800">{{ selectedPayment.booking?.vessel_snapshot || "—" }}</span>
                    </div>
                    <div class="flex justify-between items-center px-4 py-2.5">
                      <span class="text-gray-500">Schedule</span>
                      <span class="font-medium text-gray-800">{{ selectedPayment.booking?.schedule_snapshot || "—" }}</span>
                    </div>
                    <div class="flex justify-between items-center px-4 py-2.5">
                      <span class="text-gray-500">Travel Date</span>
                      <span class="font-medium text-gray-800">{{ fmtDate(selectedPayment.booking?.travel_date) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Payment info -->
                <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div class="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                    <p class="text-xs font-semibold uppercase tracking-widest text-gray-400">Payment Info</p>
                  </div>
                  <div class="divide-y divide-gray-100 text-sm">
                    <div class="flex justify-between items-center px-4 py-2.5">
                      <span class="text-gray-500">Reference</span>
                      <span class="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {{ selectedPayment.reference_number || "—" }}
                      </span>
                    </div>
                    <div class="flex justify-between items-center px-4 py-2.5">
                      <span class="text-gray-500">Method</span>
                      <span :class="['px-2 py-0.5 rounded-full text-xs font-semibold capitalize', modeColor(selectedPayment.payment_method)]">
                        {{ selectedPayment.payment_method || "—" }}
                      </span>
                    </div>
                    <div class="flex justify-between items-center px-4 py-2.5">
                      <span class="text-gray-500">Processed</span>
                      <span class="font-medium text-gray-800">{{ fmtDate(selectedPayment.created_at) }}</span>
                    </div>
                    <div class="flex items-center gap-2 px-4 py-2.5">
                      <span class="text-gray-500 text-sm flex-shrink-0">Issued By</span>
                      <div v-if="resolvedCreator" class="flex items-center gap-1.5 ml-auto">
                        <div class="w-6 h-6 rounded-full bg-[#1e3a8a] flex items-center justify-center flex-shrink-0">
                          <span class="text-white text-[10px] font-bold">{{ creatorName(resolvedCreator).charAt(0) }}</span>
                        </div>
                        <span class="text-xs font-medium text-gray-700 truncate max-w-[100px]">{{ creatorName(resolvedCreator) }}</span>
                      </div>
                      <span v-else class="text-gray-400 text-xs ml-auto">—</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Passengers table -->
              <div v-if="selectedPayment.booking?.passengers?.length" class="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div class="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                  <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p class="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Passengers <span class="normal-case text-gray-500 font-normal">({{ selectedPayment.booking.passengers.length }})</span>
                  </p>
                </div>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead class="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                        <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</th>
                        <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                        <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
                        <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Seat</th>
                        <th class="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Fare</th>
                        <th class="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                      <tr
                        v-for="p in selectedPayment.booking.passengers"
                        :key="p.booked_passenger_id ?? p.temp_booked_passenger_id"
                        class="hover:bg-blue-50/40 transition-colors"
                      >
                        <td class="px-4 py-3 font-semibold text-gray-900">{{ p.fullname }}</td>
                        <td class="px-4 py-3">
                          <span :class="p.gender === 'male' ? 'text-blue-600' : 'text-pink-500'" class="capitalize text-xs font-medium">{{ p.gender }}</span>
                        </td>
                        <td class="px-4 py-3">
                          <span class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">{{ p.passenger_type_snapshot || "—" }}</span>
                        </td>
                        <td class="px-4 py-3 text-gray-500 text-xs">{{ p.passenger_category_snapshot || "—" }}</td>
                        <td class="px-4 py-3 font-mono text-gray-600 text-xs">{{ p.seat_number_snapshot || "—" }}</td>
                        <td class="px-4 py-3 text-right font-semibold text-gray-800">{{ fmtMoney(p.fare) }}</td>
                        <td class="px-4 py-3 text-right text-red-500 font-semibold text-xs">
                          {{ parseFloat(p.discount_amount || 0) > 0 ? `-${fmtMoney(p.discount_amount)}` : "—" }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Vehicles table -->
              <div v-if="selectedPayment.booking?.vehicles?.length" class="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div class="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                  <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <p class="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Vehicles <span class="normal-case text-gray-500 font-normal">({{ selectedPayment.booking.vehicles.length }})</span>
                  </p>
                </div>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead class="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                        <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plate</th>
                        <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Driver</th>
                        <th class="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Fare</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                      <tr
                        v-for="v in selectedPayment.booking.vehicles"
                        :key="v.booked_vehicle_id ?? v.temp_booked_vehicle_id"
                        class="hover:bg-purple-50/40 transition-colors"
                      >
                        <td class="px-4 py-3">
                          <span class="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                            {{ v.vehicle_type ?? v.vehicle_type_snapshot ?? "—" }}
                          </span>
                        </td>
                        <td class="px-4 py-3 font-mono font-bold text-gray-800 text-xs">{{ v.plate_no || "—" }}</td>
                        <td class="px-4 py-3">
                          <div v-if="v.driver" class="flex items-center gap-2">
                            <div class="w-7 h-7 rounded-full bg-[#1e3a8a] flex items-center justify-center flex-shrink-0">
                              <span class="text-white text-[10px] font-bold">{{ v.driver.fullname?.charAt(0) }}</span>
                            </div>
                            <div>
                              <p class="font-medium text-gray-800 text-xs">{{ v.driver.fullname }}</p>
                              <p class="text-[10px] text-gray-400 capitalize">{{ v.driver.gender }}</p>
                            </div>
                          </div>
                          <span v-else class="text-gray-400 text-xs italic">No driver</span>
                        </td>
                        <td class="px-4 py-3 text-right font-semibold text-gray-800">{{ fmtMoney(v.fare) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
