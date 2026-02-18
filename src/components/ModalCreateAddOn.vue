<script setup>
import { Edit, Trash2 } from "lucide-vue-next";
import { onMounted, ref, computed } from "vue";
const emit = defineEmits("close");
const isLoading = ref(false);
const errorMsg = ref("");
const isTableLoading = ref(false);
const isPercentageDisabled = computed(() => value_type.value === 1);
const isFixedDisabled = computed(() => value_type.value === 0);
const apiBase = import.meta.env.VITE_API_URL;
const percentageValue = ref("");
const fixedValue = ref("");
const value_type = ref(null);
const addOnName = ref("");
const isEditMode = ref(false);
const editingId = ref(null);
const addOns = ref([]);

const setValue = (type, newValue) => {
  if (newValue === "" || newValue === null) {
    value_type.value = null;
    percentageValue.value = "";
    fixedValue.value = "";
    return;
  }
  value_type.value = type;
  if (type === 0) {
    percentageValue.value = newValue;
    fixedValue.value = "";
  } else {
    fixedValue.value = newValue;
    percentageValue.value = "";
  }
};

const handleEdit = (item) => {
  isEditMode.value = true;
  editingId.value = item.id;
  addOnName.value = item.add_on_name;
  value_type.value = Number(item.value_type);
  if (value_type.value === 0) {
    percentageValue.value = item.value;
    fixedValue.value = "";
  } else {
    fixedValue.value = item.value;
    percentageValue.value = "";
  }
};

const handleDelete = (item) => {
  addOns.value = addOns.value.filter((a) => a.id !== item.id);
};

const resetForm = () => {
  addOnName.value = "";
  percentageValue.value = "";
  fixedValue.value = "";
  value_type.value = null;
  errorMsg.value = "";
};

const submitAddOn = async () => {
  if (!addOnName.value.trim()) {
    errorMsg.value = "Add name is required";
    return;
  }

  errorMsg.value = "";
  isLoading.value = true;

  try {
    const rawValue =
      value_type.value === 0 ? percentageValue.value : fixedValue.value;

    const num = Number(rawValue);

    let operator = null;
    if (!isNaN(num)) {
      if (num < 0) operator = 0;
      if (num > 0) operator = 1;
    }

    const payload = {
      add_on_name: addOnName.value,
      value: Math.abs(num),
      value_type: value_type.value,
      operator: operator,
    };

    const url = isEditMode.value
      ? `${apiBase}/add-ons/${editingId.value}`
      : `${apiBase}/add-ons`;

    const method = isEditMode.value ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to save add on");
    }

    resetForm();
    isEditMode.value = false;
    editingId.value = null;
    await fetchAddOns();
  } catch (err) {
    console.error(err);
    errorMsg.value = "Failed to save add on.";
  } finally {
    isLoading.value = false;
  }
};

const fetchAddOns = async () => {
  try {
    isTableLoading.value = true;
    const res = await fetch(`${apiBase}/add-ons`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch add ons");
    }
    const data = await res.json();
    addOns.value = data.data.addOns.map((a) => ({
      id: a.add_on_id,
      add_on_name: a.add_on_name,
      value: a.value,
      operator: a.operator,
      value_type: a.value_type,
    }));
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    isTableLoading.value = false;
  }
};

onMounted(async () => {
  await fetchAddOns();
});
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    @click="$emit('close')"
  >
    <div
      class="modal-card bg-white rounded-lg shadow-xl w-full max-w-7xl min-h-[40vh]"
      @click.stop
    >
      <div class="grid grid-cols-[35%_65%] justify border-gray-200">
        <!-- LEFT COLUMN // CREATE ADD ON -->
        <div class="flex flex-col items-start gap-6 p-6">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ isEditMode ? "Update Add On" : "Create Add On" }}
          </h2>
          <form
            @submit.prevent="submitAddOn"
            class="flex flex-col gap-6 w-full"
          >
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Add On Name
              </label>
              <input
                v-model="addOnName"
                type="text"
                required
                placeholder="Input Name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Value</label
              >
              <div class="flex justify-between gap-5">
                <div class="flex flex-col gap-1">
                  <label class="text-xs text-gray-700">
                    Percentage Amount
                  </label>
                  <div class="relative w-full">
                    <input
                      v-model="percentageValue"
                      @input="(e) => setValue(0, e.target.value)"
                      :disabled="isPercentageDisabled"
                      type="number"
                      placeholder="00.00"
                      required
                      class="w-full px-3 py-2 pr-10 text-right border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />

                    <span
                      class="absolute inset-y-0 right-0 p-3 border-l border-gray-300 flex items-center text-gray-500 text-sm"
                    >
                      %
                    </span>
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-xs text-gray-700"> Fixed Amount </label>
                  <div class="relative w-full">
                    <input
                      v-model="fixedValue"
                      @input="(e) => setValue(1, e.target.value)"
                      :disabled="isFixedDisabled"
                      type="number"
                      required
                      placeholder="00.00"
                      class="w-full px-3 py-2 pr-14 text-right border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />

                    <span
                      class="border-l border-gray-300 p-3 absolute inset-y-0 right-0 flex items-center text-gray-500 text-sm"
                    >
                      PHP
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <!-- MODAL FOOTER -->
            <div
              class="flex items-center justify-end gap-3 pt-6 border-t border-gray-200"
            >
              <button
                v-if="isEditMode"
                type="button"
                @click="
                  resetForm();
                  isEditMode = false;
                "
                class="px-4 py-2 text-sm bg-gray-200 rounded-md"
              >
                Cancel Edit
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                :disabled="isLoading"
              >
                <span
                  v-if="isLoading"
                  class="flex items-center gap-2"
                  :disabled="isLoading"
                >
                  <span
                    class="inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
                  ></span>
                  Creating Add On ...
                </span>
                <span v-else>
                  {{ isEditMode ? "Update Add On" : "Create Add On" }}
                </span>
              </button>
            </div>
            <div v-if="errorMsg" class="text-red-500 text-sm mt-2 text-center">
              {{ errorMsg }}
            </div>
          </form>
        </div>
        <!-- RIGHT COLUMN // ADD ONS LIST // TABLE -->
        <div class="flex flex-col p-6 border-l border-gray-200">
          <div class="flex flex-col items-center gap-6">
            <div class="flex justify-between w-full">
              <h2 class="text-lg font-semibold text-gray-900">Add Ons List</h2>
              <button
                @click="$emit('close')"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <!-- ADD ONS LIST TABLE -->
            <div
              v-if="isTableLoading"
              class="flex justify-center items-center py-8 min-h-[40vh]"
            >
              <div
                class="flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg"
              >
                <span
                  class="inline-block w-6 h-6 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
                ></span>
                <span class="font-semibold text-blue-700 text-base"
                  >Loading Add Ons...</span
                >
              </div>
            </div>
            <div v-else class="w-full overflow-auto min-h-[40vh] max-h-[40vh]">
              <table class="min-w-full border-separate border-spacing-0">
                <thead class="sticky top-0 bg-gray-100 text-sm text-gray-600">
                  <tr>
                    <th
                      class="px-6 py-4 text-left border-l border-t border-b border-gray-300 rounded-tl-md rounded-bl-md"
                    >
                      #
                    </th>
                    <th
                      class="px-6 py-4 text-left border-t border-b border-gray-300"
                    >
                      Add On Name
                    </th>
                    <th
                      class="px-6 py-4 text-left border-t border-b border-gray-300"
                    >
                      Value
                    </th>

                    <th
                      class="px-6 py-4 text-left border-t border-b border-r border-gray-300 rounded-tr-md rounded-br-md"
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody class="text-gray-900">
                  <tr v-for="item in addOns" :key="item.id">
                    <!-- ID -->
                    <td class="px-6 py-4 border-gray-200">
                      {{ item.id }}
                    </td>

                    <!-- NAME -->
                    <td class="px-6 py-4 font-medium border-gray-200">
                      {{ item.add_on_name }}
                    </td>

                    <!-- PERCENTAGE -->

                    <td class="px-6 py-4 border-gray-200">
                      {{ item.operator === "0" ? "-" : "" }}
                      {{
                        item.value_type === "0"
                          ? item.value + " %"
                          : item.value + " ₱"
                      }}
                    </td>

                    <!-- ACTIONS -->
                    <td class="px-6 py-4 text-sm flex items-start gap-1">
                      <button
                        @click="handleEdit(item)"
                        class="font-medium text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <Edit class="w-4 h-4 mr-1" />
                      </button>

                      <button
                        @click="handleDelete(item)"
                        class="font-medium text-red-600 hover:text-red-900 flex items-center"
                      >
                        <Trash2 class="w-4 h-4 mr-1" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
