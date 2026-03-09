<script setup>
import { Edit, Plus, Search } from "lucide-vue-next";
import { ref, onMounted } from "vue";

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

const handleEditSaved = async () => {
  closeEditModal();
  await fetchInstitutionalAccounts();
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

const handleCreateSaved = async () => {
  closeCreateModal();
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
        iaId: ia.ia_id,
        iaName: ia.ia_name,
        address: ia.address,
        email: ia.email,
        contactPerson: ia.contact_person,
        contactNumber: ia.contact_number,
        area: ia.area,
        paymentMode: ia.payment_mode,
        effectiveDate: ia.effective_date,
        eocDate: ia.eoc_date,
        paymentType: ia.payment_type,
        updatedAt: new Date(ia.updated_at).toLocaleDateString(),
      }),
    );
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    isTableLoading.value = false;
  }
};

onMounted(fetchInstitutionalAccounts);
</script>

<template>
  <!-- LAYOUT -->
  <div class="border border-gray-300 bg-white rounded-lg">
    <nav class="flex space-x-4">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'flex items-center gap-2 py-2 px-3 font-medium text-md transition',
          activeTab === tab.id
            ? 'bg-white text-black border-b-2 border-black'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-bold',
        ]"
      >
        <component :is="tab.icon" class="w-4 h-4" />
        {{ tab.name }}
      </button>
    </nav>
  </div>
</template>
