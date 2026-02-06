<!-- filepath: d:\Fastcat Book 2\fcbook-frontend\src\components\ViewTellerPassenger.vue -->
<template>
  <transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
    >
      <div
        class="modal-card bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden"
      >
      <div class="flex items-center justify-between p-6 border-b">
        <h2 class="text-lg font-semibold text-gray-900">Passenger Details</h2>
        <button
          class="h-8 w-8 p-0 hover:bg-gray-100 rounded-md flex items-center justify-center transition-colors"
          @click="emit('close')"
        >
          <svg
            class="w-5 h-5"
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
      <div class="p-6 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="font-medium text-gray-600">Fullname:</div>
          <div class="text-gray-900">{{ passenger.fullname }}</div>
          <div class="font-medium text-gray-600">Seat:</div>
          <div class="text-gray-900">{{ passenger.seat }}</div>
          <div class="font-medium text-gray-600">Type:</div>
          <div class="text-gray-900">{{ passenger.type }}</div>
          <div class="font-medium text-gray-600">Category:</div>
          <div class="text-gray-900">{{ passenger.category }}</div>
          <div class="font-medium text-gray-600">Accommodation:</div>
          <div class="text-gray-900">{{ passenger.accommodation }}</div>
          <div class="font-medium text-gray-600">Gender:</div>
          <div class="text-gray-900">{{ passenger.gender }}</div>
          <div class="font-medium text-gray-600">Fare:</div>
          <div class="text-gray-900">₱{{ passenger.fare }}</div>
          <div class="font-medium text-gray-600">Discount:</div>
          <div class="text-gray-900">{{ passenger.discount }}</div>
          <div class="font-medium text-gray-600">Admin Fee:</div>
          <div class="text-gray-900">₱{{ passenger.adminFee }}</div>
          <div class="font-medium text-gray-600">Cargo Fare:</div>
          <div class="text-gray-900">₱{{ passenger.cargoFare }}</div>
          <div class="font-medium text-gray-600">Route:</div>
          <div class="text-gray-900">{{ passenger.route }}</div>
          <div class="font-medium text-gray-600">Schedule:</div>
          <div class="text-gray-900">{{ passenger.schedule }}</div>
          <div class="font-medium text-gray-600">Date:</div>
          <div class="text-gray-900">{{ passenger.date }}</div>
        </div>
        <div v-if="passenger.vehicle" class="mt-4">
          <div class="font-medium text-gray-600 mb-1">Vehicle Details:</div>
          <pre class="bg-gray-100 rounded p-2 text-xs text-gray-700">{{
            passenger.vehicle
          }}</pre>
        </div>
      </div>
      </div>
      <div class="flex justify-end mt-6 gap-2">
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          @click="emit('edit', passenger)"
        >
          Edit
        </button>
        <button
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
  passenger: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["close"]);
</script>
