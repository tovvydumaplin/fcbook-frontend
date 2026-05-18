<script setup>
import { ref, computed, watch } from "vue";
import cashImg from "../../../assets/payment-method-images/cash.png";
import gcashImg from "../../../assets/payment-method-images/gcash.png";
import paymongoImg from "../../../assets/payment-method-images/paymongo.png";
import checkImg from "../../../assets/payment-method-images/check.png";
import creditImg from "../../../assets/payment-method-images/credit.png";

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  passengers: { type: Array, default: () => [] },
  vehicles: { type: Array, default: () => [] },
  isProcessingPayment: { type: Boolean, default: false },
});

const emit = defineEmits(["close", "paymentSelected", "printingSelected"]);

const selectedPaymentMethod = ref(null);
const referenceNumber = ref("");
const cashRendered = ref(0);

const paymentMethods = ref([
  { id: "cash",     name: "Cash",     logo: cashImg,     color: "green" },
  { id: "gcash",    name: "GCash",    logo: gcashImg,    color: "blue" },
  { id: "paymongo", name: "Paymongo", logo: paymongoImg, color: "purple" },
  { id: "check",    name: "Check",    logo: checkImg,    color: "gray" },
  { id: "prepaid",  name: "Prepaid",  logo: creditImg,   color: "indigo" },
  { id: "credit",   name: "Credit",   logo: creditImg,   color: "red" },
]);

const printingOptions = [
  { id: "eticket", name: "E-Ticket",         bg: "bg-orange-500", icon: "M15 5H9a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2zM9 7h6v2H9V7zm0 4h6v2H9v-2zm0 4h4v2H9v-2z" },
  { id: "qrcode",  name: "QR Code",          bg: "bg-blue-500",   icon: "M3 3h7v7H3V3zm2 2v3h3V5H5zm7-2h7v7h-7V3zm2 2v3h3V5h-3zM3 13h7v7H3v-7zm2 2v3h3v-3H5zm9 0h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm4-4h2v2h-2v-2zm-2 4h2v2h-2v-2z" },
  { id: "both",    name: "E-Ticket + QR",    bg: "bg-teal-500",   icon: "M4 6h16M4 10h16M4 14h10M4 18h6" },
  { id: "bill",    name: "Bill of Lading",   bg: "bg-slate-600",  icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
];

const passengerFare = computed(() =>
  props.passengers.reduce((s, p) => s + parseFloat(p.fare || 0), 0)
);
const vehicleFare = computed(() =>
  props.vehicles.reduce((s, v) => s + parseFloat(v.vehicle?.rate || 0), 0)
);
const adminFee = computed(() =>
  props.passengers.length * 2 + props.vehicles.length * 25
);
const discount = computed(() =>
  props.passengers.reduce((s, p) => s + parseFloat(p.discountAmount || 0), 0)
);
const totalAmount = computed(() =>
  passengerFare.value + vehicleFare.value + adminFee.value - discount.value
);
const change = computed(() =>
  Math.max(0, cashRendered.value - totalAmount.value)
);

const processingOptionId = ref(null);

watch(() => props.isProcessingPayment, (val) => {
  if (!val) processingOptionId.value = null;
});

const selectPaymentMethod = (method) => {
  selectedPaymentMethod.value = method;
  emit("paymentSelected", method);
};

const handlePrintingClick = (option) => {
  processingOptionId.value = option.id;
  emit("printingSelected", option);
};
</script>

<template>
  <transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden"
        style="max-height: 92vh;"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 bg-blue-900 text-white">
          <div>
            <h2 class="text-lg font-bold tracking-tight">Complete Payment</h2>
            <p class="text-blue-300 text-xs mt-0.5">Select payment method and confirm the transaction</p>
          </div>
          <button
            @click="emit('close')"
            class="p-2 rounded-lg hover:bg-blue-800 text-blue-200 hover:text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body: two columns -->
        <div class="flex overflow-hidden" style="max-height: calc(92vh - 64px)">

          <!-- LEFT: Payment method selection + input -->
          <div class="w-2/5 border-r border-gray-200 p-6 overflow-y-auto space-y-6">

            <!-- Payment Methods -->
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Payment Method</p>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="method in paymentMethods"
                  :key="method.id"
                  @click="selectPaymentMethod(method)"
                  :class="[
                    'relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all',
                    selectedPaymentMethod?.id === method.id
                      ? 'border-blue-600 bg-blue-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  ]"
                >
                  <!-- Selected indicator — absolute top-right -->
                  <div
                    class="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center transition-opacity duration-150"
                    :class="selectedPaymentMethod?.id === method.id ? 'opacity-100' : 'opacity-0'"
                  >
                    <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100">
                    <img :src="method.logo" :alt="method.name" class="w-7 h-7 object-contain" />
                  </div>
                  <span class="text-xs font-medium text-gray-700 leading-tight text-center">{{ method.name }}</span>
                </button>
              </div>
            </div>

            <!-- Payment Input -->
            <div class="space-y-4">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Details</p>

              <!-- Reference Number (non-cash) — always in DOM to prevent shift -->
              <div :class="selectedPaymentMethod && selectedPaymentMethod.id !== 'cash' ? '' : 'invisible'">
                <label class="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                <input
                  v-model="referenceNumber"
                  type="text"
                  placeholder="Enter reference number"
                  class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <!-- Cash Rendered -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cash Rendered</label>
                <input
                  v-model="cashRendered"
                  type="number"
                  placeholder="0.00"
                  class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <!-- Change -->
              <div class="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                <span class="text-sm text-gray-600 font-medium">Change</span>
                <span class="text-lg font-bold" :class="change > 0 ? 'text-green-600' : 'text-gray-700'">
                  ₱{{ change.toFixed(2) }}
                </span>
              </div>
            </div>
          </div>

          <!-- RIGHT: Breakdown + Printing -->
          <div class="w-3/5 p-6 overflow-y-auto bg-gray-50 space-y-6 flex flex-col">

            <!-- Summary Banner -->
            <div class="bg-blue-900 rounded-xl px-6 py-4 text-white flex items-center justify-between">
              <div>
                <p class="text-blue-300 text-xs font-medium uppercase tracking-wider">Total Amount Due</p>
                <p class="text-3xl font-bold mt-1">₱{{ totalAmount.toFixed(2) }}</p>
              </div>
              <div class="text-right text-sm text-blue-200 space-y-1">
                <p>{{ passengers.length }} Passenger{{ passengers.length !== 1 ? 's' : '' }}</p>
                <p v-if="vehicles.length">{{ vehicles.length }} Vehicle{{ vehicles.length !== 1 ? 's' : '' }}</p>
              </div>
            </div>

            <!-- Breakdown Table -->
            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div class="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Breakdown</p>
              </div>
              <div class="divide-y divide-gray-100 text-sm">
                <div class="flex justify-between px-4 py-2.5">
                  <span class="text-gray-600">Passenger Fare</span>
                  <span class="font-medium text-gray-900">₱{{ passengerFare.toFixed(2) }}</span>
                </div>
                <div v-if="vehicles.length" class="flex justify-between px-4 py-2.5">
                  <span class="text-gray-600">Vehicle Fare</span>
                  <span class="font-medium text-gray-900">₱{{ vehicleFare.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between px-4 py-2.5">
                  <span class="text-gray-600">Admin Fee</span>
                  <span class="font-medium text-gray-900">₱{{ adminFee.toFixed(2) }}</span>
                </div>
                <div v-if="discount > 0" class="flex justify-between px-4 py-2.5">
                  <span class="text-gray-600">Discount</span>
                  <span class="font-medium text-green-600">-₱{{ discount.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between px-4 py-3 bg-blue-50 font-semibold">
                  <span class="text-blue-900">Total</span>
                  <span class="text-blue-900">₱{{ totalAmount.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <!-- Printing Options -->
            <div class="flex-1">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Print & Confirm</p>
              <div class="grid grid-cols-2 gap-3">
                <button
                  v-for="option in printingOptions"
                  :key="option.id"
                  @click="handlePrintingClick(option)"
                  :disabled="isProcessingPayment"
                  :class="[option.bg, 'flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-white font-medium text-sm transition-all hover:opacity-90 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed']"
                >
                  <svg
                    v-if="processingOptionId === option.id"
                    class="animate-spin w-4 h-4 flex-shrink-0"
                    fill="none" viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 22 6.477 22 12h-4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <svg
                    v-else
                    class="w-5 h-5 flex-shrink-0"
                    fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" :d="option.icon" />
                  </svg>
                  <span>{{ processingOptionId === option.id ? 'Processing...' : option.name }}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
