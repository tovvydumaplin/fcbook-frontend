<template>
  <div
    class="w-64 flex-shrink-0 bg-white border-r border-gray-200 h-screen flex flex-col overflow-y-auto"
  >
    <!-- Logo/Brand -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center space-x-2">
        <div
          class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center"
        >
          <span class="text-white font-bold text-sm">F</span>
        </div>
        <span class="text-xl font-semibold text-gray-800">FastCat</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 space-y-2">
      <!-- Dashboard -->
      <router-link
        to="/home"
        class="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
        active-class="bg-blue-50 text-blue-600"
        exact-active-class="bg-blue-50 text-blue-600"
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
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span class="font-medium">Dashboard</span>
      </router-link>

      <!-- Modules Section -->
      <div class="pt-4">
        <button
          @click="toggleModules"
          class="flex items-center justify-between w-full px-3 py-2 text-left text-gray-600 hover:text-gray-800 transition-colors"
        >
          <span class="font-medium">Modules</span>
          <svg
            class="w-4 h-4 transition-transform duration-200"
            :class="{ 'rotate-180': isModulesOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <div v-show="isModulesOpen" class="ml-3 mt-2 space-y-1">
          <router-link
            v-for="item in moduleItems"
            :key="item.name"
            :to="item.route"
            class="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
            active-class="bg-blue-50 text-blue-600"
            exact-active-class="bg-blue-50 text-blue-600"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span class="font-medium">{{ item.name }}</span>
          </router-link>
        </div>
      </div>

      <!-- Booking Modules Section -->
      <div class="pt-4">
        <button
          @click="toggleBookingModules"
          class="flex items-center justify-between w-full px-3 py-2 text-left text-gray-600 hover:text-gray-800 transition-colors"
        >
          <span class="font-medium">Booking Modules</span>
          <svg
            class="w-4 h-4 transition-transform duration-200"
            :class="{ 'rotate-180': isBookingModulesOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <div v-show="isBookingModulesOpen" class="ml-3 mt-2 space-y-1">
          <router-link
            v-for="item in bookingItems"
            :key="item.name"
            :to="item.route"
            class="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
            active-class="bg-blue-50 text-blue-600"
            exact-active-class="bg-blue-50 text-blue-600"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span class="font-medium">{{ item.name }}</span>
          </router-link>
        </div>
      </div>

      <!-- Logs and Reports Section -->
      <div class="pt-4">
        <button
          @click="toggleLogsReports"
          class="flex items-center justify-between w-full px-3 py-2 text-left text-gray-600 hover:text-gray-800 transition-colors"
        >
          <span class="font-medium">Logs and Reports</span>
          <svg
            class="w-4 h-4 transition-transform duration-200"
            :class="{ 'rotate-180': isLogsReportsOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <div v-show="isLogsReportsOpen" class="ml-3 mt-2 space-y-1">
          <router-link
            v-for="item in logsItems"
            :key="item.name"
            :to="item.route"
            class="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
            active-class="bg-blue-50 text-blue-600"
            exact-active-class="bg-blue-50 text-blue-600"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span class="font-medium">{{ item.name }}</span>
          </router-link>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Collapsible states
const isModulesOpen = ref(true);
const isBookingModulesOpen = ref(true);
const isLogsReportsOpen = ref(true);

const toggleModules = () => (isModulesOpen.value = !isModulesOpen.value);
const toggleBookingModules = () =>
  (isBookingModulesOpen.value = !isBookingModulesOpen.value);
const toggleLogsReports = () =>
  (isLogsReportsOpen.value = !isLogsReportsOpen.value);

// Icons
const BookingIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>`,
};
const LogIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`,
};

// Sidebar items
const moduleItems = [
  { name: "Ports", route: "/create-port", icon: BookingIcon },
  { name: "Vessels", route: "/vessels", icon: BookingIcon },
  { name: "Routes", route: "/routes", icon: BookingIcon },
  { name: "Schedule", route: "/schedule", icon: BookingIcon },
];

const bookingItems = [
  { name: "Teller Booking", route: "/teller-booking", icon: BookingIcon },
  { name: "Merchant Booking", route: "/merchant-booking", icon: BookingIcon },
  { name: "VIP Booking", route: "/vip-booking", icon: BookingIcon },
  { name: "Cancellations/Refunds", route: "/cancellations", icon: BookingIcon },
];

const logsItems = [
  { name: "Employee Logs", route: "/employee-logs", icon: LogIcon },
];
</script>
