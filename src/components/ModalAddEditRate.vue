<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  accommodation: Object,
  route: Object,
});

const emit = defineEmits(["close", "save"]);

const form = reactive({
  rate: props.accommodation?.rate ?? 0,
  withoutAC: props.accommodation?.withoutAC ?? 0,
});

watch(
  () => props.accommodation,
  (newVal) => {
    if (newVal) {
      form.rate = newVal.rate ?? 0;
      form.withoutAC = newVal.withoutAC ?? 0;
    }
  },
);

const handleSubmit = async () => {
  try {
    const payload = {
      seat_class: props.accommodation.class_name,
      base_rate: form.rate,
      without_ac: form.withoutAC,
      status: "Active",
      updated_by: localStorage.getItem("username") || "unknown",
    };

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/routes/${props.route.id}/rates`,
      {
        method: "POST", // or PUT if your API distinguishes create/update
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await res.json();
    if (res.ok) {
      emit("save", data); // send saved data back to parent
      emit("close");
    } else {
      console.error("Error saving rate:", data);
    }
  } catch (err) {
    console.error("Network error:", err);
  }
};
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    @click="$emit('close')"
  >
    <div
      class="modal-card bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
      @click.stop
    >
      <div
        class="flex items-center justify-between border-b p-6 border-gray-200"
      >
        <h2 class="text-lg font-semibold text-gray-900">
          Edit Rate: {{ accommodation.class_name }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
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
      <form @submit.prevent="handleSubmit" class="space-y-6 p-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Base Rate
          </label>
          <input
            type="number"
            v-model="form.rate"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >W/O AC</label
          >
          <input
            type="number"
            v-model="form.withoutAC"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <!-- MODAL FOOTER -->
        <div
          class="flex items-center justify-end gap-3 pt-6 border-t border-gray-200"
        >
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
