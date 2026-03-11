<script setup>
import { ref } from "vue";
import RatesModule from "./Modules/RatesModule.vue";
import PassengerTypesModule from "./Modules/PassengerTypesModule.vue";

const activeTab = ref("rate");
const tabs = [
  { id: "rate", name: "Rates" },
  { id: "discount", name: "Passenger Type" },
];
</script>

<template>
  <div class="min-h-full bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-6">
      <nav class="text-sm text-gray-500 mb-2">
        <span>Dashboard</span> <span class="mx-2">></span>
        <span class="text-gray-900">Rates/Passenger Types</span>
      </nav>
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">
          Rates/Passenger Types
        </h1>
      </div>
    </div>
    <!-- TABS -->
    <div
      class="border border-gray-300 mb-2 rounded-lg bg-gray-200 inline-block"
    >
      <nav class="flex space-x-4 p-1">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'py-2 px-2 font-medium text-sm rounded-md',
            activeTab === tab.id
              ? 'bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-bold',
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>
    <!-- TAB CONTENT -->
    <div class="mt-6">
      <RatesModule v-if="activeTab === 'rate'" />
      <PassengerTypesModule v-else-if="activeTab === 'discount'" />
    </div>
  </div>
</template>
