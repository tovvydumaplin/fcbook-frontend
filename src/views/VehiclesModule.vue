<script setup>
import { Plus, Search } from "lucide-vue-next";
import { ref, watch, onMounted } from "vue";
import ModalCreateVehicle from "../components/ModalCreateVehicle.vue";
const isModalOpen = ref(false);
const openCreateVehicle = () => {
  isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<template>
  <div class="min-h-full bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-6">
      <nav class="text-sm text-gray-500 mb-2">
        <span>Dashboard</span> <span class="mx-2">></span>
        <span class="text-gray-900">Vehicles</span>
      </nav>
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">
          Vehicles Management
        </h1>
        <button
          @click="isModalOpen = true"
          type="button"
          class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          Create
        </button>
      </div>
    </div>
    <!-- TABLE -->
    <div class="border border-gray-300 bg-white rounded-lg">
      <div
        class="px-4 py-3 border-b border-gray-200 flex justify-between items-center"
      >
        <h2 class="text-lg font-medium text-gray-900">List of Vehicles</h2>

        <!-- Search -->
        <div class="relative">
          <Search
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
          />
          <input
            v-model="search"
            @input="currentPage = 1"
            type="text"
            placeholder="Search"
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div class="p-4">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs text-gray-500">#</th>
              <th class="px-6 py-3 text-left text-xs text-gray-500">
                Vehicle Name
              </th>
              <th class="px-6 py-3 text-left text-xs text-gray-500">
                Vehicle Type
              </th>

              <th class="px-6 py-3 text-left text-xs text-gray-500">
                Vehicle Class
              </th>

              <th class="px-6 py-3 text-left text-xs text-gray-500">
                Rolling Cargo
              </th>
              <th class="px-6 py-3 text-left text-xs text-gray-500">Updated</th>
              <th class="px-6 py-3 text-left text-xs text-gray-500">User</th>
              <th class="px-6 py-3 text-left text-xs text-gray-500">Action</th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Loading -->
            <tr v-if="loading">
              <td colspan="10" class="text-center py-6 text-gray-500">
                Loading passengers...
              </td>
            </tr>

            <!-- Data -->
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm">-</td>
              <td class="px-6 py-4 text-sm">-</td>
              <td class="px-6 py-4 text-sm">-</td>
              <td class="px-6 py-4 text-sm">-</td>
              <td class="px-6 py-4 text-sm">-</td>
              <td class="px-6 py-4 text-sm">-</td>
              <td class="px-6 py-4 text-sm">-</td>
              <td class="px-6 py-4 text-sm">-</td>
            </tr>

            <!-- Empty -->
            <!-- <tr v-if="!loading && passengers.length === 0">
              <td colspan="10" class="text-center py-6 text-gray-500">
                No passengers found.
              </td>
            </tr> -->
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <transition name="modal-fade">
    <ModalCreateVehicle
      v-if="isModalOpen"
      @close="closeModal"
      @saved="handleSaved"
    />
  </transition>
</template>
