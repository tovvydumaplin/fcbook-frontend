<script setup>
import { ref, watch, onMounted } from "vue";
import { Search, Edit, Plus } from "lucide-vue-next";
import ModalCreateAccommodation from "../components/ModalCreateAccommodation.vue";
import ModalEditAccommodation from "../components/ModalEditAccommodation.vue";
const isModalOpen = ref(false);
const isEditModalOpen = ref(false);

const apiBase = import.meta.env.VITE_API_URL;

const accommodations = ref([]);
const selectedAccommodation = ref(null);
const search = ref("");
const loading = ref(false);

const fetchAccommodations = async () => {
  loading.value = true;

  try {
    const response = await fetch(
      `${apiBase}/passenger-accommodations?search=${search.value}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch accommodations");
    }

    const result = await response.json();
    accommodations.value = result.data ?? [];
  } catch (error) {
    console.error(error);
    accommodations.value = [];
  } finally {
    loading.value = false;
  }
};

const openEditModal = (accommodation) => {
  selectedAccommodation.value = accommodation;
  isEditModalOpen.value = true;
};

const handleSave = () => {
  fetchAccommodations();
};
watch(search, fetchAccommodations);
onMounted(fetchAccommodations);
</script>

<template>
  <div class="min-h-full bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-6">
      <nav class="text-sm text-gray-500 mb-2">
        <span>Dashboard</span> <span class="mx-2">></span>
        <span class="text-gray-900">Passenger Accommodation</span>
      </nav>
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">
          Passenger Accommodation
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
        <h2 class="text-lg font-medium text-gray-900">
          List of Accommodations
        </h2>

        <!-- Search -->
        <div class="relative">
          <Search
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
          />
          <input
            v-model="search"
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
                Accommodation Name
              </th>
              <th class="px-6 py-3 text-left text-xs text-gray-500">Status</th>
              <th class="px-6 py-3 text-left text-xs text-gray-500">
                Last Updated
              </th>
              <th class="px-6 py-3 text-left text-xs text-gray-500">
                Updated By
              </th>
              <th class="px-6 py-3 text-left text-xs text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="10" class="text-center py-6 text-gray-500">
                Loading accommodations...
              </td>
            </tr>
            <tr
              v-for="(a, index) in accommodations"
              :key="a.accommodation_id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 text-sm">
                {{ index + 1 }}
              </td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                {{ a.accommodation_name }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">Active</td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ new Date(a.updated_at).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">Yoshinoya</td>
              <td class="px-6 py-4 text-sm">
                <button
                  @click="openEditModal(a)"
                  type="button"
                  class="font-medium text-blue-600 hover:text-blue-900 flex items-center cursor-pointer"
                >
                  <Edit class="w-4 h-4" />
                </button>
              </td>
            </tr>
            <tr v-if="!loading && accommodations.length === 0">
              <td colspan="10" class="text-center py-6 text-gray-500">
                No accommodations found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <transition name="modal-fade">
    <ModalCreateAccommodation
      v-if="isModalOpen"
      @close="isModalOpen = false"
      @save="handleSave"
    />
  </transition>
  <transition name="modal-fade">
    <ModalEditAccommodation
      :accommodation="selectedAccommodation"
      v-if="isEditModalOpen"
      @close="isEditModalOpen = false"
      @save="handleSave"
    />
  </transition>
</template>
