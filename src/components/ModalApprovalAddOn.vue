<script setup>
import { Edit, Trash2 } from "lucide-vue-next";
import { onMounted, ref, computed } from "vue";
const emit = defineEmits(["close", "saved"]);
const isLoading = ref(false);
const errorMsg = ref("");
const addOns = ref([]);
const isTableLoading = ref(false);
const apiBase = import.meta.env.VITE_API_URL;
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
                    class="px-6 py-4 text-left border-t border-b border-gray-300"
                  >
                    Approval
                  </th>
                  <th
                    class="px-6 py-4 text-left border-t border-b border-gray-300"
                  >
                    Status
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
</template>
