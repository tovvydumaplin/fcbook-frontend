<script setup>
import { Edit, Plus, Search } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import ModalCreatePromo from "../../../components/Modals/Promo/ModalCreatePromo.vue";
import ModalEditPromo from "../../../components/Modals/Promo/ModalEditPromo.vue";

const apiBase = import.meta.env.VITE_API_URL;
const isTableLoading = ref(false);
const isEditModalOpen = ref(false);
const isCreateModalOpen = ref(false);
const promos = ref([]);
const search = ref("");
const selectedPromo = ref([]);

const openEditPromo = (promo) => {
  selectedPromo.value = promo;
  console.log(selectedPromo.value);
  isEditModalOpen.value = true;
};

const createdPromo = async () => {
  isCreateModalOpen.value = false;
  await fetchPromos();
};

const editedPromo = async () => {
  isEditModalOpen.value = false;
  await fetchPromos();
};

const fetchPromos = async () => {
  try {
    isTableLoading.value = true;

    const res = await fetch(`${apiBase}/promos`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch promos");

    const data = await res.json();

    promos.value = data.data.promos.map((promo) => ({
      promo_id: promo.promo_id,
      promoName: promo.promo_name,
      promoCode: promo.promo_code,
      promoValue: promo.promo_value,
      promoType: promo.promo_type,
      status: promo.status,
      effectiveDate: promo.effective_date
        ? new Date(promo.effective_date).toLocaleDateString()
        : "-",
      endDate: promo.end_date
        ? new Date(promo.end_date).toLocaleDateString()
        : "-",

      updatedAt: new Date(promo.updated_at).toLocaleDateString(),
    }));
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    isTableLoading.value = false;
  }
};

onMounted(fetchPromos);
</script>

<template>
  <!-- TABLE -->
  <div class="border border-gray-300 bg-white rounded-lg">
    <div class="px-4 py-3 border-b border-gray-200 gap-3 flex flex-col">
      <div class="flex justify-between">
        <h2 class="text-lg font-medium text-gray-900">List of Promos</h2>
        <button
          @click="isCreateModalOpen = true"
          type="button"
          class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          Create
        </button>
      </div>
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
      <table class="min-w-full table-fixed divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="w-16 px-6 py-3 text-left text-xs text-gray-500">#</th>
            <th class="w-64 px-6 py-3 text-left text-xs text-gray-500">
              Promo Name
            </th>
            <th class="w-64 px-6 py-3 text-left text-xs text-gray-500">
              Promo Code
            </th>
            <th class="w-64 px-6 py-3 text-left text-xs text-gray-500">
              Promo Value
            </th>
            <th class="w-64 px-6 py-3 text-left text-xs text-gray-500">
              Effective Date
            </th>
            <th class="w-64 px-6 py-3 text-left text-xs text-gray-500">
              End Date
            </th>
            <th class="w-40 px-6 py-3 text-left text-xs text-gray-500">
              Updated
            </th>
            <th class="w-40 px-6 py-3 text-left text-xs text-gray-500">User</th>
            <th class="w-40 px-6 py-3 text-left text-xs text-gray-500">
              Action
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- Loading -->
          <tr v-if="isTableLoading">
            <td colspan="6" class="text-center py-6 text-gray-500">
              Loading promos...
            </td>
          </tr>
          <!-- Data -->
          <tr
            v-else-if="promos.length > 0"
            v-for="(promo, index) in promos"
            :key="promo.promo_id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 text-sm">
              {{ index + 1 }}
            </td>
            <td class="px-6 py-4 text-sm">
              {{ promo.promoName }}
            </td>
            <td class="px-6 py-4 text-sm">
              {{ promo.promoCode }}
            </td>
            <td clss="px-6 py-4 text-sm">
              {{
                promo.promoType === "percentage"
                  ? promo.promoValue + " %"
                  : "₱ " + promo.promoValue
              }}
            </td>
            <td class="px-6 py-4 text-sm">
              {{ promo.effectiveDate }}
            </td>
            <td class="px-6 py-4 text-sm">
              {{ promo.endDate }}
            </td>
            <td class="px-6 py-4 text-sm">
              {{ promo.updatedAt }}
            </td>
            <td class="px-6 py-4 text-sm">-</td>
            <td class="px-6 py-4 text-sm flex items-start gap-1">
              <button
                @click="openEditPromo(promo)"
                class="font-medium text-blue-600 hover:text-blue-900 flex items-center"
              >
                <Edit class="w-4 h-4 mr-1" />
              </button>
            </td>
          </tr>
          <!-- Empty -->
          <tr v-else>
            <td colspan="6" class="text-center py-6 text-gray-500">
              No promos found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <transition name="modal-fade">
    <ModalCreatePromo
      v-if="isCreateModalOpen"
      @close="isCreateModalOpen = false"
      @save="createdPromo"
    />
  </transition>
  <transition name="modal-fade">
    <ModalEditPromo
      v-if="isEditModalOpen"
      :promo="selectedPromo"
      @close="isEditModalOpen = false"
      @save="editedPromo"
    />
  </transition>
</template>
