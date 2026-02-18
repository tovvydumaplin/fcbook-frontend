<template>
  <div class="min-h-full bg-gray-50 p-6">
    <!-- HEADER -->
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
    <div class="flex items-center gap-5">
      <div class="border border-gray-300 rounded-lg bg-gray-200 inline-block">
        <nav class="flex space-x-4 px-2 py-2">
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
      <!-- OPEN APPROVAL ADD ON MODAL -->
      <button
        @click="openModalApprovalAddOn"
        class="px-4 py-4 text-sm font-medium text-gray-500 bg-gray-200 border border-gray-300 rounded-md hover:bg-white hover:text-gray-700 transition-colors duration-300"
      >
        <span> Add Ons </span>
      </button>
    </div>
    <!-- TAB CONTENT -->
    <div class="mt-6">
      <RateDiscountsModule v-if="activeTab === 'rate'" />
      <PassengerTypesModule v-else-if="activeTab === 'discount'" />
    </div>
  </div>
  <transition name="modal-fade">
    <ModalApprovalAddOn
      v-if="isModalOpen"
      @close="closeModal"
      @saved="handleSaved"
    />
  </transition>
</template>
<script setup>
import { ref } from "vue";
import RateDiscountsModule from "./ratePassengerTemplates/RateDiscountsModule.vue";
import PassengerTypesModule from "./ratePassengerTemplates/PassengerTypesModule.vue";
import ModalApprovalAddOn from "../components/ModalApprovalAddOn.vue";
const isModalOpen = ref(false);
const closeModal = () => {
  isModalOpen.value = false;
};
const openModalApprovalAddOn = () => {
  isModalOpen.value = true;
};
const handleSaved = () => {
  isModalOpen.value = false;
};
const activeTab = ref("rate");
const tabs = [
  { id: "rate", name: "Rates" },
  { id: "discount", name: "Passenger Type" },
];
</script>
