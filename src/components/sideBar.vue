<!-- filepath: d:\Fastcat Book 2\fcbook-frontend\src\components\sideBar.vue -->
<template>
  <div
    class="w-80 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-y-auto"
  >
    <!-- Navigation -->
    <nav class="flex-1 px-4 py-5 space-y-3">
      <!-- Dashboard -->
      <router-link
        to="/"
        class="flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 whitespace-nowrap"
        active-class="bg-blue-50 text-blue-600"
        exact-active-class="bg-blue-50 text-blue-600"
      >
        <svg
          class="w-5 h-5 flex-shrink-0"
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
      <div class="pt-1">
        <button
          @click="toggleModules"
          class="flex items-center justify-between w-full px-3 py-2 text-left text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
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

        <div
          v-show="isModulesOpen"
          class="ml-2 mt-2 space-y-1 border-l border-gray-100 pl-2"
        >
          <router-link
            v-for="item in moduleItems"
            :key="item.name"
            :to="item.route"
            class="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 whitespace-nowrap"
            active-class="bg-blue-50 text-blue-600"
            exact-active-class="bg-blue-50 text-blue-600"
          >
            <img
              :src="item.icon"
              :alt="item.name"
              class="w-5 h-5 flex-shrink-0"
            />
            <span class="font-medium">{{ item.name }}</span>
          </router-link>
        </div>
      </div>

      <!-- Booking Modules Section -->
      <div class="pt-1">
        <button
          @click="toggleBookingModules"
          class="flex items-center justify-between w-full px-3 py-2 text-left text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
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

        <div
          v-show="isBookingModulesOpen"
          class="ml-2 mt-2 space-y-1 border-l border-gray-100 pl-2"
        >
          <router-link
            v-for="item in bookingItems"
            :key="item.name"
            :to="item.route"
            class="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 whitespace-nowrap"
            active-class="bg-blue-50 text-blue-600"
            exact-active-class="bg-blue-50 text-blue-600"
          >
            <img
              :src="item.icon"
              :alt="item.name"
              class="w-5 h-5 flex-shrink-0"
            />
            <span class="font-medium">{{ item.name }}</span>
          </router-link>
        </div>
      </div>

      <!-- Logs and Reports Section -->
      <div class="pt-1">
        <button
          @click="toggleLogsReports"
          class="flex items-center justify-between w-full px-3 py-2 text-left text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
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

        <div
          v-show="isLogsReportsOpen"
          class="ml-2 mt-2 space-y-1 border-l border-gray-100 pl-2"
        >
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

      <!-- System Section -->
      <div class="pt-1">
        <button
          @click="toggleSystem"
          class="flex items-center justify-between w-full px-3 py-2 text-left text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <span class="font-medium">System</span>
          <svg
            class="w-4 h-4 transition-transform duration-200"
            :class="{ 'rotate-180': isSystemOpen }"
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

        <div
          v-show="isSystemOpen"
          class="ml-2 mt-2 space-y-1 border-l border-gray-100 pl-2"
        >
          <router-link
            v-for="item in systemItems"
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
import { Settings, User } from "lucide-vue-next";

// Import icons
import portsIcon from "../assets/sidebar-icons/ports.png";
import vesselsIcon from "../assets/sidebar-icons/vessels.png";
import routesIcon from "../assets/sidebar-icons/routes.png";
import schedulesIcon from "../assets/sidebar-icons/schedules.png";
import seatAllocationIcon from "../assets/sidebar-icons/seat-allocation.png";
import ratesIcon from "../assets/sidebar-icons/rates.png";
import discountsIcon from "../assets/sidebar-icons/discounts.png";
import vehiclesIcon from "../assets/sidebar-icons/vehicles.png";
import tellerBookingIcon from "../assets/sidebar-icons/teller-booking.png";

// Collapsible states
const isModulesOpen = ref(true);
const isBookingModulesOpen = ref(true);
const isLogsReportsOpen = ref(true);
const isSystemOpen = ref(true);

const toggleModules = () => (isModulesOpen.value = !isModulesOpen.value);
const toggleBookingModules = () =>
  (isBookingModulesOpen.value = !isBookingModulesOpen.value);
const toggleLogsReports = () =>
  (isLogsReportsOpen.value = !isLogsReportsOpen.value);
const toggleSystem = () => (isSystemOpen.value = !isSystemOpen.value);

// Sidebar items
const moduleItems = [
  { name: "Ports", route: "/create-port", icon: portsIcon },
  { name: "Vessels", route: "/vessels", icon: vesselsIcon },
  { name: "Routes", route: "/routes", icon: routesIcon },
  { name: "Schedule", route: "/schedule", icon: schedulesIcon },
  {
    name: "Accommodation",
    route: "/passenger-accommodation",
    icon: seatAllocationIcon,
  },
  {
    name: "Rates/Passenger Types",
    route: "/rates-discounts",
    icon: ratesIcon,
  },
  {
    name: "Passenger Monitoring",
    route: "/passenger-monitoring",
    icon: vehiclesIcon,
  },
];

const bookingItems = [
  { name: "Teller Booking", route: "/teller-booking", icon: tellerBookingIcon },
];

const logsItems = [];
const systemItems = [
  { name: "Settings", route: "/settings", icon: Settings },
  { name: "Profile", route: "/profile", icon: User },
];
</script>
