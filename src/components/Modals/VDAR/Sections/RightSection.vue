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
    <div class="flex flex-col w-full gap-2">
      <label class="text-sm font-medium text-gray-700">Name</label>
      <input
        type="text"
        required
        :value="modelValue.name"
        @input="update('name', $event.target.value)"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div class="flex gap-4">
      <div class="flex flex-col w-full gap-2">
        <label class="text-sm font-medium text-gray-700">Vessel</label>
        <input
          type="text"
          required
          :value="modelValue.vessel"
          @input="update('vessel', $event.target.value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex flex-col w-full gap-2">
        <label class="text-sm font-medium text-gray-700">Schedule</label>
        <input
          type="text"
          required
          :value="modelValue.schedule"
          @input="update('schedule', $event.target.value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <div class="flex flex-col w-full gap-2">
      <label class="text-sm font-medium text-gray-700">Vessel Master</label>
      <select
        required
        :value="modelValue.vesselMaster"
        @change="update('vesselMaster', $event.target.value)"
        class="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>Select Vessel Master</option>
        <option :value="1">Name 1</option>
        <option :value="2">Name 2</option>
      </select>
    </div>

    <div class="flex gap-4">
      <div class="flex flex-col w-full gap-2">
        <label class="text-sm font-medium text-gray-700">Origin</label>
        <select
          :value="modelValue.origin"
          @change="update('origin', $event.target.value)"
          class="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Select Origin</option>
          <option :value="1">Port 1</option>
        </select>
      </div>
      <div class="flex flex-col w-full gap-2">
        <label class="text-sm font-medium text-gray-700">Destination</label>
        <select
          :value="modelValue.destination"
          @change="update('destination', $event.target.value)"
          class="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Select Destination</option>
          <option :value="1">Port 1</option>
        </select>
      </div>
    </div>

    <div class="flex gap-4">
      <div class="flex flex-col w-full gap-2">
        <label class="text-sm font-medium text-gray-700">Voyage Number</label>
        <input
          type="text"
          required
          :value="modelValue.voyageNumber"
          @input="update('voyageNumber', $event.target.value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex flex-col w-full gap-2">
        <label class="text-sm font-medium text-gray-700"
          >Sailing Speed (Knots)</label
        >
        <input
          type="text"
          required
          :value="modelValue.sailingSpeed"
          @input="update('sailingSpeed', $event.target.value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <div class="flex gap-4">
      <div class="flex flex-col w-full gap-2">
        <label class="text-sm font-medium text-gray-700"
          >Water Consumption (Tons)</label
        >
        <input
          type="text"
          required
          :value="modelValue.waterConsumption"
          @input="update('waterConsumption', $event.target.value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex flex-col w-full gap-2">
        <label class="text-sm font-medium text-gray-700">Fuel ROB (KL)</label>
        <input
          type="text"
          required
          :value="modelValue.fuelRob"
          @input="update('fuelRob', $event.target.value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700">Reason For Delay</label>
      <textarea
        rows="3"
        placeholder="Enter reason for delay..."
        :value="modelValue.reasonForDelay"
        @input="update('reasonForDelay', $event.target.value)"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>
    </div>

    <div class="flex gap-4">
      <div class="flex flex-col w-full gap-2">
        <label class="text-sm font-medium text-gray-700"
          >Actual Departure Time</label
        >
        <input
          type="time"
          required
          :value="modelValue.actualDepartureTime"
          @input="update('actualDepartureTime', $event.target.value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex flex-col w-full gap-2">
        <label class="text-sm font-medium text-gray-700"
          >Actual Arrival Time</label
        >
        <input
          type="time"
          required
          :value="modelValue.actualArrivalTime"
          @input="update('actualArrivalTime', $event.target.value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex flex-col w-full gap-2">
        <label class="text-sm font-medium text-gray-700"
          >Maneuver/Undock (mins)</label
        >
        <input
          type="number"
          required
          :value="modelValue.maneuverUndock"
          @input="update('maneuverUndock', $event.target.value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  </div>
</template>
