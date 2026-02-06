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
            <td class="px-6 py-4 text-sm">{{ p.status }}</td>
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

<script setup>
import { ref, onMounted } from "vue";
import { Plus, Edit } from "lucide-vue-next";
import ModalCreatePassengerType from "../../components/ModalCreatePassengerType.vue";

const apiBase = import.meta.env.VITE_API_URL;

const passengerTypes = ref([]);
const isModalOpen = ref(false);
const editData = ref(null);

// Fetch all passenger types
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

// Handle saved from child modal
const handleSaved = () => {
  // Refetch the table after saving.
  fetchPassengerTypes();
  closeModal();
};

// Open modal for creating new passenger type
const openCreate = () => {
  editData.value = null;
  isModalOpen.value = true;
};

// Open modal for editing existing passenger type
const edit = (p) => {
  editData.value = p;
  isModalOpen.value = true;
};

// Close modal
const closeModal = () => {
  isModalOpen.value = false;
  editData.value = null;
};

// Fetch passenger types on component mount
onMounted(fetchPassengerTypes);
</script>
