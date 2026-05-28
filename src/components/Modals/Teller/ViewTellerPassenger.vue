<script setup>
const props = defineProps({
  isOpen: Boolean,
  passenger: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["close", "edit"]);
</script>

<template>
  <transition name="modal-fade">
    <div
      v-if="isOpen && passenger"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      @click="emit('close')"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-md border border-gray-200 overflow-hidden"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center gap-4 px-6 py-5 border-b border-gray-100">
          <div class="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-400">Passenger Details</p>
            <h2 class="text-base font-bold text-gray-900 truncate">{{ passenger.fullname }}</h2>
          </div>
          <button
            class="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            @click="emit('close')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Chips row -->
        <div class="flex items-center gap-2 px-6 py-4 border-b border-gray-100 flex-wrap">
          <span class="inline-flex items-center px-3 py-1.5 bg-[#1e3a8a] text-white text-xs font-semibold rounded-lg">
            {{ passenger.accommodation }}
          </span>
          <span class="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Seat {{ passenger.seat }}
          </span>
          <span class="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg capitalize">
            {{ passenger.gender }}
          </span>
          <span class="inline-flex items-center px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold rounded-lg capitalize">
            {{ passenger.passengerTypeDetails?.type || passenger.type || 'Regular' }}
          </span>
        </div>

        <!-- Body -->
        <div class="px-6 py-5 space-y-5">

          <!-- Trip info -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Trip</p>
            <div class="space-y-2 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Route</span>
                <span class="font-medium text-gray-800 text-right max-w-[60%] truncate">{{ passenger.route }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Date</span>
                <span class="font-medium text-gray-800">{{ passenger.date }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Schedule</span>
                <span class="font-medium text-gray-800">{{ passenger.schedule }}</span>
              </div>
            </div>
          </div>

          <!-- Fare breakdown -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Fare Breakdown</p>
            <div class="border border-gray-100 rounded-xl overflow-hidden">
              <div class="divide-y divide-gray-100 text-sm">
                <div class="flex justify-between px-4 py-2.5">
                  <span class="text-gray-500">Base Fare</span>
                  <span class="font-medium text-gray-800">₱{{ passenger.fare }}</span>
                </div>
                <div v-if="parseFloat(passenger.discountAmount) > 0" class="flex justify-between px-4 py-2.5">
                  <span class="text-gray-500">Discount</span>
                  <span class="font-medium text-emerald-600">−₱{{ passenger.discountAmount }}</span>
                </div>
                <div class="flex justify-between px-4 py-2.5">
                  <span class="text-gray-500">Admin Fee</span>
                  <span class="font-medium text-gray-800">₱{{ passenger.adminFee }}</span>
                </div>
                <div class="flex justify-between px-4 py-2.5 bg-gray-50">
                  <span class="font-semibold text-gray-900">Total</span>
                  <span class="font-bold text-gray-900">
                    ₱{{ (parseFloat(passenger.fare || 0) + parseFloat(passenger.adminFee || 0)).toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- IA -->
          <div v-if="passenger.institutionalAccount" class="flex items-center gap-2.5 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
            <svg class="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span class="text-sm font-medium text-blue-800">{{ passenger.institutionalAccount.ia_name || passenger.institutionalAccount.name }}</span>
          </div>

        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button
            class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            @click="emit('close')"
          >
            Close
          </button>
          <button
            class="px-5 py-2 bg-[#1e3a8a] text-white text-sm font-semibold rounded-lg hover:bg-[#162d6e] transition-colors"
            @click="emit('edit', passenger)"
          >
            Edit Passenger
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
