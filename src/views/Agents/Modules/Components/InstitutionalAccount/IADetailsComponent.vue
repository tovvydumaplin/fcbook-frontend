<script setup>
import { Edit, Plus, Search } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import ModalEditIA from "../../../../../components/ModalEditIA.vue";
import ModalCreateIA from "../../../../../components/ModalCreateIA.vue";
import Swal from "sweetalert2";

const apiBase = import.meta.env.VITE_API_URL;

const isTableLoading = ref(false);
const isEditModalOpen = ref(false);
const isCreateModalOpen = ref(false);
const selectedInstitutionalAccount = ref({});
const institutionalAccounts = ref([]);
const search = ref("");

const openEditIA = (ia) => {
  selectedInstitutionalAccount.value = ia;
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
};

const openCreateIA = () => {
  isCreateModalOpen.value = true;
};

const closeCreateModal = () => {
  isCreateModalOpen.value = false;
};

const handleEditSaved = async () => {
  closeEditModal();
  await Swal.fire({
    icon: "success",
    title: "Updated!",
    text: `${selectedInstitutionalAccount.value.iaName} has been updated.`,
    timer: 2000,
    showConfirmButton: false,
  });

  await fetchInstitutionalAccounts();
};

const handleCreateSaved = async () => {
  closeCreateModal();
  await Swal.fire({
    icon: "success",
    title: "Created!",
    text: `New institutional account has been created.`,
    timer: 2000,
    showConfirmButton: false,
  });

  await fetchInstitutionalAccounts();
};

const fetchInstitutionalAccounts = async () => {
  try {
    isTableLoading.value = true;

    const res = await fetch(`${apiBase}/institutional-accounts`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch institutional accounts");

    const data = await res.json();

    institutionalAccounts.value = data.data.institutional_accounts.map(
      (ia) => ({
        iaId: ia.ia_id ?? "-",
        iaName: ia.ia_name ?? "-",
        address: ia.address ?? "-",
        email: ia.email ?? "-",
        contactPerson: ia.contact_person ?? "-",
        contactNumber: ia.contact_number ?? "-",
        area: ia.area ?? "-",
        paymentMode: ia.payment_mode ?? "-",
        effectiveDate: ia.effective_date
          ? new Date(ia.effective_date).toLocaleDateString()
          : "-",
        eocDate: ia.eoc_date ? new Date(ia.eoc_date).toLocaleDateString() : "-",
        paymentType: ia.payment_type ?? "-",
        updatedAt: ia.updated_at
          ? new Date(ia.updated_at).toLocaleDateString()
          : "-",
      }),
    );
  } catch (err) {
    console.error("Fetch error:", err);
    Swal.fire("Error", "Failed to fetch institutional accounts.", "error");
  } finally {
    isTableLoading.value = false;
  }
};

onMounted(fetchInstitutionalAccounts);
</script>

<template>
  <!-- TABLE -->
  <div class="px-4 py-3 border-b border-gray-200 flex flex-col gap-2">
    <div class="flex justify-between items-center">
      <div class="relative">
        <Search
          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
        />
        <input
          v-model="search"
          @input="currentPage = 1"
          type="text"
          placeholder="Search"
          class="pl-10 pr-4 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div class="flex justify-end">
        <button
          @click="openCreateIA"
          type="button"
          class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          Create
        </button>
      </div>
    </div>
  </div>

  <div class="p-4">
    <table class="min-w-full table-fixed divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="w-16 px-6 py-3 text-left text-xs text-gray-500">#</th>

          <th class="w-64 px-6 py-3 text-left text-xs text-gray-500">
            Account Name
          </th>
          <th class="w-40 px-6 py-3 text-left text-xs text-gray-500">Area</th>
          <th class="w-40 px-6 py-3 text-left text-xs text-gray-500">
            Address
          </th>
          <th class="w-40 px-6 py-3 text-left text-xs text-gray-500">
            Contact Person
          </th>
          <th class="w-40 px-6 py-3 text-left text-xs text-gray-500">
            Contact Number
          </th>
          <th class="w-40 px-6 py-3 text-left text-xs text-gray-500">
            Effective Date
          </th>

          <th class="w-40 px-6 py-3 text-left text-xs text-gray-500">
            EOC Date
          </th>

          <th class="w-40 px-6 py-3 text-left text-xs text-gray-500">Action</th>
        </tr>
      </thead>

      <tbody class="bg-white divide-y divide-gray-200">
        <!-- Loading -->
        <tr v-if="isTableLoading">
          <td colspan="7" class="text-center py-6 text-gray-500">
            Loading institutional accounts...
          </td>
        </tr>

        <tr
          v-else-if="institutionalAccounts.length > 0"
          v-for="(ia, index) in institutionalAccounts"
          :key="ia.iaId"
          class="hover:bg-gray-50"
        >
          <td class="px-6 py-4 text-sm">{{ index + 1 }}</td>
          <td class="px-6 py-4 text-sm">{{ ia.iaName }}</td>
          <td class="px-6 py-4 text-sm">{{ ia.area }}</td>
          <td class="px-6 py-4 text-sm">{{ ia.address }}</td>
          <td class="px-6 py-4 text-sm">{{ ia.contactPerson }}</td>
          <td class="px-6 py-4 text-sm">{{ ia.contactNumber }}</td>
          <td class="px-6 py-4 text-sm">{{ ia.effectiveDate }}</td>
          <td class="px-6 py-4 text-sm">{{ ia.eocDate }}</td>

          <td class="px-6 py-4 text-sm">
            <button
              @click="openEditIA(ia)"
              class="font-medium text-blue-600 hover:text-blue-900 flex items-center gap-2"
            >
              <Edit class="w-5 h-5" />
              Edit
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <transition name="modal-fade">
    <ModalEditIA
      v-if="isEditModalOpen"
      :ia="selectedInstitutionalAccount"
      @close="closeEditModal"
      @save="handleEditSaved"
    />
  </transition>
  <transition name="modal-fade">
    <ModalCreateIA
      v-if="isCreateModalOpen"
      :ia="selectedInstitutionalAccount"
      @close="closeCreateModal"
      @save="handleCreateSaved"
    />
  </transition>
</template>
