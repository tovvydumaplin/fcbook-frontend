<script setup>
import { ref, computed } from "vue";
import cashImg from "../../../assets/payment-method-images/cash.png";
import gcashImg from "../../../assets/payment-method-images/gcash.png";
import paymongoImg from "../../../assets/payment-method-images/paymongo.png";
import checkImg from "../../../assets/payment-method-images/check.png";
import creditImg from "../../../assets/payment-method-images/credit.png";

const TicketIcon = {
  template: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 10V6c0-1.11-.89-2-2-2H4c-1.11 0-2 .89-2 2v4c1.11 0 2 .89 2 2s-.89 2-2 2v4c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2v-4c-1.11 0-2-.89-2-2s.89-2 2-2z"/></svg>`,
};
const QrCodeIcon = {
  template: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM19 13h2v2h-2zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM15 19h2v2h-2zM17 17h2v2h-2zM17 19h2v2h-2zM19 17h2v2h-2z"/></svg>`,
};
const BothIcon = {
  template: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"/></svg>`,
};
const DocumentIcon = {
  template: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>`,
};

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  passengers: { type: Array, default: () => [] },
  vehicles: { type: Array, default: () => [] },
});

const emit = defineEmits(["close", "paymentSelected", "printingSelected"]);

const selectedPaymentMethod = ref(null);
const referenceNumber = ref("");
const cashRendered = ref(0);

const paymentMethods = ref([
  { id: "cash",     name: "Cash",     logo: cashImg },
  { id: "gcash",    name: "GCash",    logo: gcashImg },
  { id: "paymongo", name: "Paymongo", logo: paymongoImg },
  { id: "check",    name: "Check",    logo: checkImg },
  { id: "prepaid",  name: "Prepaid",  logo: creditImg },
  { id: "credit",   name: "Credit",   logo: creditImg },
]);

const printingOptions = ref([
  { id: "eticket", name: "E-Ticket",       icon: TicketIcon,   bg: "bg-orange-500 hover:bg-orange-600" },
  { id: "qrcode",  name: "QR Code",        icon: QrCodeIcon,   bg: "bg-[#1e3a8a] hover:bg-[#162d6e]" },
  { id: "both",    name: "E-Ticket + QR",  icon: BothIcon,     bg: "bg-teal-500 hover:bg-teal-600" },
  { id: "bill",    name: "Bill of Lading", icon: DocumentIcon, bg: "bg-gray-700 hover:bg-gray-800" },
]);

const passengerFare = computed(() =>
  props.passengers.reduce((sum, p) => sum + parseFloat(p.fare || 0), 0)
);
const passengerAdminFee = computed(() =>
  props.passengers.length * 2 + props.vehicles.length * 25
);
const passengerDiscount = computed(() =>
  props.passengers.reduce((sum, p) => sum + parseFloat(p.discountAmount || 0), 0)
);
const vehicleFare = computed(() =>
  props.vehicles.reduce((sum, v) => sum + parseFloat(v.vehicle?.rate || 0), 0)
);
const totalAmount = computed(() =>
  passengerFare.value + passengerAdminFee.value + vehicleFare.value - passengerDiscount.value
);
const change = computed(() => Math.max(0, cashRendered.value - totalAmount.value));

const passengerCount = computed(() => props.passengers.length);

const closeModal = () => emit("close");
const selectPaymentMethod = (method) => {
  selectedPaymentMethod.value = method;
  emit("paymentSelected", method);
};
const selectPrintingOption = (option) => {
  emit("printingSelected", option, referenceNumber.value);
};
</script>

<template>
  <transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="closeModal"
    >
      <div
        class="bg-white rounded-xl w-full max-w-5xl mx-4 shadow-2xl overflow-hidden"
        @click.stop
      >
        <!-- Header -->
        <div class="bg-[#1e3a8a] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 class="text-white text-lg font-bold leading-tight">Complete Payment</h2>
            <p class="text-blue-200 text-sm mt-0.5">Select payment method and confirm the transaction</p>
          </div>
          <button
            @click="closeModal"
            class="text-blue-200 hover:text-white transition-colors p-1 rounded"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body: two columns -->
        <div class="flex">
          <!-- Left column -->
          <div class="w-[42%] border-r border-gray-200 p-6 space-y-6">
            <!-- Payment Method -->
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Payment Method</p>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="method in paymentMethods"
                  :key="method.id"
                  type="button"
                  @click="selectPaymentMethod(method)"
                  :class="[
                    'flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-lg border-2 transition-all',
                    selectedPaymentMethod?.id === method.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white',
                  ]"
                >
                  <img :src="method.logo" :alt="method.name" class="w-7 h-7 object-contain" />
                  <span class="text-xs font-medium text-gray-700">{{ method.name }}</span>
                </button>
              </div>
            </div>

            <!-- Payment Details -->
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Payment Details</p>
              <div class="space-y-3">
                <!-- Reference number (non-cash only) -->
                <div v-if="selectedPaymentMethod && selectedPaymentMethod.id !== 'cash'">
                  <label class="block text-xs text-gray-500 mb-1">Reference Number</label>
                  <input
                    v-model="referenceNumber"
                    type="text"
                    placeholder="Enter reference number"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <!-- Cash Rendered -->
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Cash Rendered</label>
                  <input
                    v-model="cashRendered"
                    type="number"
                    placeholder="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <!-- Change -->
                <div class="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                  <span class="text-sm text-gray-500">Change</span>
                  <span class="text-sm font-semibold text-gray-800">₱{{ change.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right column -->
          <div class="flex-1 p-6 flex flex-col gap-5">
            <!-- Total Amount Due card -->
            <div class="bg-[#1e3a8a] rounded-xl px-5 py-4 flex items-center justify-between">
              <div>
                <p class="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">Total Amount Due</p>
                <p class="text-white text-3xl font-bold">₱{{ totalAmount.toFixed(2) }}</p>
              </div>
              <div class="text-right">
                <p class="text-blue-200 text-sm">
                  {{ passengerCount }} Passenger{{ passengerCount !== 1 ? 's' : '' }}
                  <span v-if="vehicles.length > 0"> · {{ vehicles.length }} Vehicle{{ vehicles.length !== 1 ? 's' : '' }}</span>
                </p>
              </div>
            </div>

            <!-- Breakdown -->
            <div class="border border-gray-200 rounded-xl overflow-hidden">
              <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <p class="text-xs font-semibold uppercase tracking-widest text-gray-400">Breakdown</p>
              </div>
              <div class="divide-y divide-gray-100 text-sm">
                <div class="flex justify-between items-center px-4 py-3">
                  <span class="text-gray-500">Passenger Fare</span>
                  <span class="font-medium text-gray-800">₱{{ passengerFare.toFixed(2) }}</span>
                </div>
                <div v-if="vehicles.length > 0" class="flex justify-between items-center px-4 py-3">
                  <span class="text-gray-500">Vehicle Fare</span>
                  <span class="font-medium text-gray-800">₱{{ vehicleFare.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between items-center px-4 py-3">
                  <span class="text-gray-500">Admin Fee</span>
                  <span class="font-medium text-gray-800">₱{{ passengerAdminFee.toFixed(2) }}</span>
                </div>
                <div v-if="passengerDiscount > 0" class="flex justify-between items-center px-4 py-3">
                  <span class="text-gray-500">Discount</span>
                  <span class="font-medium text-red-500">-₱{{ passengerDiscount.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between items-center px-4 py-3 bg-blue-50">
                  <span class="font-semibold text-blue-900">Total</span>
                  <span class="font-bold text-blue-900 text-base">₱{{ totalAmount.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <!-- Print & Confirm -->
            <div class="mt-auto">
              <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Print & Confirm</p>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="option in printingOptions"
                  :key="option.id"
                  @click="selectPrintingOption(option)"
                  :class="[
                    'flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-white text-sm font-semibold transition-colors',
                    option.bg,
                  ]"
                >
                  <component :is="option.icon" />
                  {{ option.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
