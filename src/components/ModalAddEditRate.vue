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
  }
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
      }
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
      class="modal-card bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
      @click.stop
    >
      <h2 class="text-lg font-semibold mb-2">
        Edit Rate: {{ accommodation.class_name }}
      </h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Base Rate</label
          >
          <input
            type="number"
            v-model="form.rate"
            class="mt-1 w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">W/O AC</label>
          <input
            type="number"
            v-model="form.withoutAC"
            class="mt-1 w-full border rounded-md p-2"
          />
        </div>
        <div class="flex justify-end space-x-2">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
