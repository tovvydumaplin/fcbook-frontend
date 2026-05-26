<script setup>
import { ref, computed } from "vue";
import cashImg from "../../../assets/payment-method-images/cash.png";
import gcashImg from "../../../assets/payment-method-images/gcash.png";
import paymongoImg from "../../../assets/payment-method-images/paymongo.png";
import checkImg from "../../../assets/payment-method-images/check.png";
import creditImg from "../../../assets/payment-method-images/credit.png";

// Icon components
const CashIcon = {
  template: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
};
const GcashIcon = {
  template: `<div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">G</div>`,
};
const PaymongoIcon = {
  template: `<div class="w-6 h-6 bg-purple-600 rounded-full"></div>`,
};
const CheckIcon = {
  template: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`,
};
const CardIcon = {
  template: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>`,
};
const TicketIcon = {
  template: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M22 10V6c0-1.11-.89-2-2-2H4c-1.11 0-2 .89-2 2v4c1.11 0 2 .89 2 2s-.89 2-2 2v4c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2v-4c-1.11 0-2-.89-2-2s.89-2 2-2z"/></svg>`,
};
const QrCodeIcon = {
  template: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM19 13h2v2h-2zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM15 19h2v2h-2zM17 17h2v2h-2zM17 19h2v2h-2zM19 17h2v2h-2z"/></svg>`,
};
const BothIcon = {
  template: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>`,
};
const DocumentIcon = {
  template: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>`,
};

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  passengers: {
    type: Array,
    default: () => [],
  },
  vehicles: {
    type: Array,
    default: () => [],
  },
});

// Emits
const emit = defineEmits(["close", "paymentSelected", "printingSelected"]);

// Reactive data
const searchQuery = ref("");
const selectedPaymentMethod = ref(null);
const referenceNumber = ref("");
const cashRendered = ref(0);

// Payment methods data
// Payment methods data
const paymentMethods = ref([
  {
    id: "cash",
    name: "Cash",
    logo: cashImg,
    iconColor: "text-green-600",
  },
  {
    id: "gcash",
    name: "Gcash",
    logo: gcashImg,
    iconColor: "text-blue-600",
  },
  {
    id: "paymongo",
    name: "Paymongo",
    logo: paymongoImg,
    iconColor: "text-purple-600",
  },
  {
    id: "check",
    name: "Check",
    logo: checkImg,
    iconColor: "text-gray-600",
  },
  {
    id: "prepaid",
    name: "Prepaid",
    logo: creditImg,
    iconColor: "text-blue-600",
  },
  {
    id: "credit",
    name: "Credit",
    logo: creditImg,
    iconColor: "text-red-600",
  },
]);

// Printing options data
const printingOptions = ref([
  {
    id: "eticket",
    name: "E-ticket",
    icon: TicketIcon,
    bgColor: "bg-orange-500",
  },
  {
    id: "qrcode",
    name: "QR Code",
    icon: QrCodeIcon,
    bgColor: "bg-blue-500",
  },
  {
    id: "both",
    name: "E-ticket & QR Code",
    icon: BothIcon,
    bgColor: "bg-green-500",
  },
  {
    id: "bill",
    name: "Bill of Lading",
    icon: DocumentIcon,
    bgColor: "bg-teal-500",
  },
]);

// Computed properties
const filteredPaymentMethods = computed(() => {
  if (!searchQuery.value) return paymentMethods.value;
  return paymentMethods.value.filter((method) =>
    method.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

// Calculate totals from passengers and vehicles
const passengerFare = computed(() => {
  return props.passengers.reduce((sum, p) => sum + parseFloat(p.fare || 0), 0);
});

const passengerAdminFee = computed(() => {
  // Admin fee: 2 pesos per passenger, 25 pesos per vehicle
  return (props.passengers.length * 2) + (props.vehicles.length * 25);
});

const passengerDiscount = computed(() => {
  return props.passengers.reduce((sum, p) => sum + parseFloat(p.discountAmount || 0), 0);
});

const vehicleFare = computed(() => {
  return props.vehicles.reduce((sum, v) => sum + parseFloat(v.vehicle?.rate || 0), 0);
});

const totalAmount = computed(() => {
  return passengerFare.value + passengerAdminFee.value + vehicleFare.value - passengerDiscount.value;
});

const change = computed(() => {
  return Math.max(0, cashRendered.value - totalAmount.value);
});

// Methods
const closeModal = () => {
  emit("close");
};

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
    >
      <div
        class="modal-card bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh]"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="text-lg font-semibold text-gray-900">
            Select Payment Method
          </h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
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

        <div class="p-4 space-y-6 max-h-[70vh] overflow-y-scroll">
          <!-- Search -->
          <div class="relative">
            <svg
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search payment method..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Payment Methods -->
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-3">
              Payment Methods
            </h3>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="method in filteredPaymentMethods"
                :key="method.id"
                type="button"
                @click="selectPaymentMethod(method)"
                :class="[
                  'flex flex-col items-center p-3 border rounded-lg transition-colors',
                  selectedPaymentMethod?.id === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300',
                ]"
              >
                <div class="w-8 h-8 mb-2 flex items-center justify-center">
                  <img
                    v-if="method.logo"
                    :src="method.logo"
                    :alt="method.name + ' logo'"
                    class="w-6 h-6 object-contain"
                  />
                  <component
                    v-else
                    :is="method.icon"
                    class="w-6 h-6"
                    :class="method.iconColor"
                  />
                </div>
                <span class="text-xs font-medium text-gray-700">{{
                  method.name
                }}</span>
              </button>
            </div>
          </div>

          <!-- Payment Breakdown -->
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-3">
              Payment Breakdown
            </h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Passenger Count</span>
                <span class="font-medium">{{ passengers.length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Passenger Fare</span>
                <span class="font-medium">₱{{ passengerFare.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between" v-if="vehicles.length > 0">
                <span class="text-gray-600">Vehicle Count</span>
                <span class="font-medium">{{ vehicles.length }}</span>
              </div>
              <div class="flex justify-between" v-if="vehicles.length > 0">
                <span class="text-gray-600">Vehicle Fare</span>
                <span class="font-medium">₱{{ vehicleFare.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Admin Fee</span>
                <span class="font-medium">₱{{ passengerAdminFee.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between" v-if="passengerDiscount > 0">
                <span class="text-gray-600">Discount</span>
                <span class="text-red-600">-₱{{ passengerDiscount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between pt-2 border-t font-semibold">
                <span class="text-gray-900">Amount To Be Paid</span>
                <span class="text-gray-900">₱{{ totalAmount.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Payment -->
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-3">Payment</h3>
            <div class="space-y-3">
              <!-- Reference Number: show unless cash is selected -->
              <div
                v-if="
                  selectedPaymentMethod && selectedPaymentMethod.id !== 'cash'
                "
              >
                <label class="block text-xs text-gray-600 mb-1"
                  >Reference Number</label
                >
                <input
                  v-model="referenceNumber"
                  type="text"
                  placeholder="00.00"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1"
                  >Cash Rendered</label
                >
                <div class="flex gap-2">
                  <input
                    v-model="cashRendered"
                    type="number"
                    placeholder="00.00"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-gray-600">Change</span>
                    <span
                      class="px-2 py-1 bg-gray-100 rounded text-sm font-medium"
                      >{{ change.toFixed(2) }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Printing Options -->
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-3">
              Printing Options
            </h3>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="option in printingOptions"
                :key="option.id"
                @click="selectPrintingOption(option)"
                :class="[
                  'flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-medium transition-colors',
                  option.bgColor,
                  'hover:opacity-90',
                ]"
              >
                <component :is="option.icon" class="w-4 h-4" />
                {{ option.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
