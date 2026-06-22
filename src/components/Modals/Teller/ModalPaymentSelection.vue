<script setup>
import { ref, computed, watch, nextTick } from "vue";
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
const managerPin = ref(["", "", "", "", ""]);
const pinInputs = ref([]);
const MANAGER_KEY = "aaaaa";
const managerKey = computed(() => managerPin.value.join(""));
const isVerifying = ref(false);
const managerKeyVerified = ref(false);
const managerKeyRejected = ref(false);

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
const passengerOriginalFare = computed(() =>
  props.passengers.reduce((sum, p) => sum + parseFloat(p.fare || 0) + parseFloat(p.discountAmount || 0), 0)
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
  passengerFare.value + passengerAdminFee.value + vehicleFare.value
);
const change = computed(() => Math.max(0, cashRendered.value - totalAmount.value));
const hasDiscount = computed(() => passengerDiscount.value > 0);
const printEnabled = computed(() => !hasDiscount.value || managerKeyVerified.value);

const passengerCount = computed(() => props.passengers.length);

const resetPinState = () => {
  managerKeyVerified.value = false;
  managerKeyRejected.value = false;
};

const onPinInput = (index, event) => {
  const val = event.target.value.slice(-1);
  managerPin.value[index] = val;
  resetPinState();

  if (val && index < 4) {
    pinInputs.value[index + 1]?.focus();
  } else if (val && index === 4) {
    isVerifying.value = true;
    setTimeout(() => {
      isVerifying.value = false;
      if (managerKey.value === MANAGER_KEY) {
        managerKeyVerified.value = true;
      } else {
        managerKeyRejected.value = true;
        // Clear boxes and refocus first after a short pause
        setTimeout(() => {
          managerKeyRejected.value = false;
          managerPin.value = ["", "", "", "", ""];
          nextTick(() => pinInputs.value[0]?.focus());
        }, 1200);
      }
    }, 900);
  }
};

const onPinKeydown = (index, event) => {
  if (event.key === "Backspace") {
    if (managerPin.value[index]) {
      managerPin.value[index] = "";
      resetPinState();
    } else if (index > 0) {
      managerPin.value[index - 1] = "";
      resetPinState();
      pinInputs.value[index - 1]?.focus();
    }
  }
};

watch(() => props.isOpen, (open) => {
  if (!open) {
    managerPin.value = ["", "", "", "", ""];
    managerKeyVerified.value = false;
    managerKeyRejected.value = false;
    isVerifying.value = false;
    selectedPaymentMethod.value = null;
    referenceNumber.value = "";
    cashRendered.value = 0;
  }
});

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

                <!-- Port Manager Authorization (only when discount is applied) -->
                <div v-if="hasDiscount" class="mt-1">
                  <div
                    :class="[
                      'rounded-xl border p-3.5 transition-colors duration-300',
                      isVerifying
                        ? 'border-blue-200 bg-blue-50'
                        : managerKeyVerified
                          ? 'border-emerald-300 bg-emerald-50'
                          : managerKeyRejected
                            ? 'border-red-300 bg-red-50'
                            : 'border-amber-300 bg-amber-50',
                    ]"
                  >
                    <div class="flex items-center gap-2 mb-2.5">
                      <div
                        :class="[
                          'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300',
                          isVerifying ? 'bg-blue-400' : managerKeyVerified ? 'bg-emerald-500' : managerKeyRejected ? 'bg-red-400' : 'bg-amber-400',
                        ]"
                      >
                        <svg v-if="isVerifying" class="w-3.5 h-3.5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                        </svg>
                        <svg v-else-if="managerKeyRejected" class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                        <svg v-else-if="managerKeyVerified" class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                        </svg>
                        <svg v-else class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 1C8.676 1 6 3.676 6 7v1H4v14h16V8h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 110 4 2 2 0 010-4z"/>
                        </svg>
                      </div>
                      <div>
                        <p :class="['text-xs font-bold transition-colors duration-300', isVerifying ? 'text-blue-700' : managerKeyVerified ? 'text-emerald-800' : managerKeyRejected ? 'text-red-700' : 'text-amber-800']">
                          {{ isVerifying ? 'Authenticating…' : managerKeyVerified ? 'Authorization Granted' : managerKeyRejected ? 'Incorrect Key' : 'Port Manager Authorization Required' }}
                        </p>
                        <p :class="['text-xs transition-colors duration-300', isVerifying ? 'text-blue-500' : managerKeyVerified ? 'text-emerald-600' : managerKeyRejected ? 'text-red-500' : 'text-amber-600']">
                          {{ isVerifying ? 'Please wait while we verify the key.' : managerKeyVerified ? 'Discount has been approved.' : managerKeyRejected ? 'The key you entered is invalid. Please try again.' : 'A discount is applied. Enter the Port Manager key to proceed.' }}
                        </p>
                      </div>
                    </div>
                    <div class="flex gap-1.5">
                      <input
                        v-for="(_, i) in managerPin"
                        :key="i"
                        :ref="el => pinInputs[i] = el"
                        :value="managerPin[i]"
                        type="password"
                        maxlength="1"
                        inputmode="text"
                        :disabled="isVerifying || managerKeyRejected"
                        @input="onPinInput(i, $event)"
                        @keydown="onPinKeydown(i, $event)"
                        :class="[
                          'w-8 h-9 text-center text-sm font-bold rounded-md border outline-none transition-all duration-300',
                          isVerifying
                            ? 'border-blue-200 bg-blue-50 text-blue-400 cursor-not-allowed'
                            : managerKeyVerified
                              ? 'border-emerald-400 bg-emerald-50 text-emerald-800 focus:ring-1 focus:ring-emerald-300'
                              : managerKeyRejected
                                ? 'border-red-300 bg-red-50 text-red-400 cursor-not-allowed'
                                : 'border-amber-300 bg-white text-gray-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-200',
                        ]"
                      />
                    </div>
                  </div>
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
                  <div class="text-right">
                    <span v-if="passengerDiscount > 0" class="line-through text-gray-400 text-xs mr-1.5">₱{{ passengerOriginalFare.toFixed(2) }}</span>
                    <span class="font-medium text-gray-800">₱{{ passengerFare.toFixed(2) }}</span>
                  </div>
                </div>
                <div v-if="passengerDiscount > 0" class="flex justify-between items-center px-4 py-2 bg-emerald-50">
                  <span class="text-emerald-700 text-xs font-medium">Discount applied</span>
                  <span class="font-semibold text-emerald-600 text-xs">-₱{{ passengerDiscount.toFixed(2) }}</span>
                </div>
                <div v-if="vehicles.length > 0" class="flex justify-between items-center px-4 py-3">
                  <span class="text-gray-500">Vehicle Fare</span>
                  <span class="font-medium text-gray-800">₱{{ vehicleFare.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between items-center px-4 py-3">
                  <span class="text-gray-500">Admin Fee</span>
                  <span class="font-medium text-gray-800">₱{{ passengerAdminFee.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between items-center px-4 py-3 bg-blue-50">
                  <span class="font-semibold text-blue-900">Total</span>
                  <span class="font-bold text-blue-900 text-base">₱{{ totalAmount.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <!-- Print & Confirm -->
            <div class="mt-auto">
              <div class="flex items-center justify-between mb-3">
                <p class="text-xs font-semibold uppercase tracking-widest text-gray-400">Print & Confirm</p>
                <span v-if="hasDiscount && !managerKeyVerified" class="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1C8.676 1 6 3.676 6 7v1H4v14h16V8h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 110 4 2 2 0 010-4z"/>
                  </svg>
                  Locked
                </span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="option in printingOptions"
                  :key="option.id"
                  @click="printEnabled && selectPrintingOption(option)"
                  :disabled="!printEnabled"
                  :class="[
                    'flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-white text-sm font-semibold transition-all relative',
                    printEnabled ? option.bg : 'bg-gray-300 cursor-not-allowed opacity-60',
                  ]"
                >
                  <component :is="option.icon" />
                  {{ option.name }}
                </button>
              </div>
              <p v-if="hasDiscount && !managerKeyVerified" class="text-center text-xs text-amber-600 mt-2">
                Enter the Port Manager key on the left to unlock printing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
