<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const update = (field, value) => {
  emit("update:modelValue", { ...props.modelValue, [field]: value });
};
</script>

<template>
  <div
    class="flex flex-col gap-6 border-r border-gray-300 py-4 px-6 overflow-y-auto"
  >
    <div class="flex gap-4">
      <div class="flex flex-col w-full gap-2">
        <label class="text-sm font-medium text-gray-700">Business Class</label>
        <input
          type="number"
          required
          placeholder="0"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex flex-col w-full gap-2">
        <label class="text-sm font-medium text-gray-700">Premium Economy</label>
        <input
          type="number"
          required
          placeholder="0"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex flex-col w-full gap-2">
        <label class="text-sm font-medium text-gray-700">Economy</label>
        <input
          type="number"
          required
          placeholder="0"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <div class="flex gap-4">
      <div class="flex flex-col w-full gap-2">
        <label class="text-sm font-medium text-gray-700">Student</label>
        <input
          type="number"
          required
          placeholder="0"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex flex-col w-full gap-2">
        <label class="text-sm font-medium text-gray-700">Senior/PWD</label>
        <input
          type="number"
          required
          placeholder="0"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex flex-col w-full gap-2">
        <label class="text-sm font-medium text-gray-700">Infant</label>
        <input
          type="number"
          required
          placeholder="0"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
    <div class="flex gap-4">
      <div class="flex flex-col w-full gap-2">
        <label class="text-sm font-medium text-gray-700">Children (3-7)</label>
        <input
          type="number"
          required
          placeholder="0"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex flex-col w-full gap-2">
        <label class="text-sm font-medium text-gray-700">Driver</label>
        <input
          type="number"
          required
          placeholder="0"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex flex-col w-full gap-2">
        <label class="text-sm font-medium text-gray-700">Helper</label>
        <input
          type="number"
          required
          placeholder="0"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  </div>
</template>
