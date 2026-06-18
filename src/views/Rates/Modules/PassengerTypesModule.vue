<script setup>
import { ref, onMounted } from "vue";
import { Plus, Edit } from "lucide-vue-next";
import ModalCreatePassengerType from "../../../components/Modals/Passenger/PassengerType/ModalCreatePassengerType.vue";

const apiBase = import.meta.env.VITE_API_URL;

const passengerTypes = ref([]);
const isModalOpen = ref(false);
const editData = ref(null);

const status = {
  0: { label: "Pending", class: "text-yellow-600 bg-yellow-100" },
  1: { label: "Active", class: "text-green-600 bg-green-100" },
  2: { label: "Inactive", class: "text-gray-600 bg-gray-100" },
  3: { label: "Cancelled", class: "text-red-600 bg-red-100" },
};

const fetchPassengerTypes = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${apiBase}/passenger-types`, {
      headers: { Authorization: token },
    });
    const data = await res.json();
    if (res.ok && data.success) {
      passengerTypes.value = data.data.types;
    }
  } catch (err) {
    console.error("Failed to fetch passenger types:", err);
  }
};

const handleSaved = () => {
  fetchPassengerTypes();
  closeModal();
};

const openCreate = () => {
  editData.value = null;
  isModalOpen.value = true;
};

const edit = (p) => {
  editData.value = p;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editData.value = null;
};

onMounted(fetchPassengerTypes);
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium text-gray-900">Passenger Type Lists</h2>

        <button
          @click="openCreate"
          class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus class="w-4 h-4" />
          Create
        </button>
      </div>

      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs text-gray-500">#</th>
            <th class="px-6 py-3 text-left text-xs text-gray-500">Type</th>
            <th class="px-6 py-3 text-left text-xs text-gray-500">Discount</th>
            <th class="px-6 py-3 text-left text-xs text-gray-500">Waived</th>
            <th class="px-6 py-3 text-left text-xs text-gray-500">Has Seat</th>
            <th class="px-6 py-3 text-left text-xs text-gray-500">Status</th>
            <th class="px-6 py-3 text-left text-xs text-gray-500">Action</th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="p in passengerTypes"
            :key="p.p_id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 text-sm">{{ p.p_id }}</td>
            <td class="px-6 py-4 text-sm">{{ p.type }}</td>
            <td class="px-6 py-4 text-sm">{{ Number(p.discount) * 100 }}%</td>
            <td class="px-6 py-4 text-sm">{{ p.waived ? "✅" : "❌" }}</td>
            <td class="px-6 py-4 text-sm">{{ p.has_seat !== false ? "✅" : "❌" }}</td>
            <td class="px-6 py-4 text-sm">
              <span
                :class="[
                  'px-2 py-1 rounded text-sm font-medium',
                  status[p.status].class,
                ]"
              >
                {{ status[p.status].label }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm">
              <button
                @click="edit(p)"
                class="text-blue-600 hover:text-blue-900 flex items-center"
              >
                <Edit class="w-4 h-4 mr-1" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <transition name="modal-fade">
      <ModalCreatePassengerType
        v-if="isModalOpen"
        :editData="editData"
        @close="closeModal"
        @saved="handleSaved"
      />
    </transition>
  </div>
</template>
