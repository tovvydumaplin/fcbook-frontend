<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-fit mx-4" @click.stop>
      <!-- HEADER -->
      <div class="flex items-center justify-between p-6 border-b">
        <h2 class="text-lg font-semibold text-gray-900">Create Seatmap</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- BODY -->
      <form class="p-6 space-y-6">
        <div class="flex gap-8 justify-between">
          <!-- LEFT SIDE -->
          <div class="seatmap_tools h-[410px] overflow-y-auto">
            <!-- CLASS LIST -->
            <div class="mb-4">
              <p class="text-sm font-medium text-gray-700 mb-3">
                List of Class
              </p>
              <div class="mb-2 space-y-2">
                <div
                  v-for="(item, i) in addedClasses"
                  :key="i"
                  @click="selectClass(item)"
                  class="flex justify-between p-1 rounded cursor-pointer"
                  :class="
                    currentSelectedClass?.name === item.name
                      ? 'bg-blue-200'
                      : 'hover:bg-gray-200'
                  "
                >
                  <span class="text-sm font-medium">{{ item.name }}</span>
                  <span
                    class="text-sm font-medium text-red-500 cursor-pointer"
                    @click.stop="removeClass(i)"
                    >DEL</span
                  >
                </div>
              </div>

              <!-- Add class dropdown -->
              <div class="w-full">
                <select
                  v-if="isOpen"
                  v-model="selectedClassIndex"
                  class="mb-4 w-full px-3 py-2 border rounded-md"
                >
                  <option value="" disabled>Select accommodation</option>
                  <option
                    v-for="(seat, index) in availableClasses"
                    :key="seat.name"
                    :value="seat.name"
                  >
                    {{ seat.name }}
                  </option>
                </select>

                <button
                  v-if="!isOpen"
                  @click="isOpen = true"
                  type="button"
                  class="w-full px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-400"
                >
                  + Add Class
                </button>

                <div v-if="isOpen" class="grid grid-cols-2 gap-4 w-full">
                  <button
                    @click="cancelAction"
                    type="button"
                    class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    @click="saveChanges"
                    type="button"
                    class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-400"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>

            <!-- GENERATE SEATS -->
            <div v-if="currentSelectedClass">
              <div class="flex gap-4 w-80 mb-4">
                <div>
                  <label class="block text-sm mb-2 text-gray-700"
                    >Row Seats</label
                  >
                  <input
                    type="number"
                    v-model.number="tempRows"
                    class="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label class="block text-sm mb-2 text-gray-700"
                    >Column Seats</label
                  >
                  <input
                    type="number"
                    v-model.number="tempColumns"
                    class="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              <button
                type="button"
                @click="generateSeats"
                class="w-full px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-400 mb-4"
                :class="
                  !currentSelectedClass ? 'opacity-50 cursor-not-allowed' : ''
                "
              >
                Generate Seats
              </button>
            </div>

            <!-- MODE BUTTONS -->
            <div class="grid grid-cols-2 gap-4">
              <!-- RENAME -->
              <button
                type="button"
                @click="toggleRenameMode"
                :disabled="!currentSelectedClass"
                :class="[
                  'px-4 py-2 rounded-md',
                  !currentSelectedClass
                    ? 'opacity-40 cursor-not-allowed'
                    : renameMode
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200',
                ]"
              >
                Rename Seat
              </button>
              <!-- BLOCK -->
              <button
                type="button"
                @click="toggleBlockMode"
                :disabled="!currentSelectedClass"
                :class="[
                  'px-4 py-2 rounded-md',
                  !currentSelectedClass
                    ? 'opacity-40 cursor-not-allowed'
                    : blockMode
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200',
                ]"
              >
                Block/Unblock
              </button>
              <!-- PATH -->
              <button
                type="button"
                @click="togglePathMode"
                :disabled="!currentSelectedClass"
                :class="[
                  'px-4 py-2 rounded-md',
                  !currentSelectedClass
                    ? 'opacity-40 cursor-not-allowed'
                    : pathMode
                    ? 'bg-yellow-400 text-white'
                    : 'bg-gray-200',
                ]"
              >
                Walk Path
              </button>
              <!-- RESET -->
              <button
                type="button"
                @click="resetSeats"
                :disabled="!currentSelectedClass"
                :class="[
                  'px-4 py-2 rounded-md',
                  !currentSelectedClass
                    ? 'opacity-40 cursor-not-allowed'
                    : 'bg-gray-200',
                ]"
              >
                Reset Changes
              </button>
            </div>
          </div>

          <!-- RIGHT SIDE - SEATMAP PREVIEW -->
          <div class="seatmap_preview border p-3 rounded-lg w-96">
            <p class="text-sm text-center font-medium text-gray-700 mb-3">
              Seatmap Preview
            </p>

            <div v-if="!currentSelectedClass" class="text-center text-gray-500">
              Select a class to preview
            </div>
            <div
              v-else-if="!currentSelectedClass.seats.length"
              class="text-center text-gray-500"
            >
              No seats generated yet.
            </div>
            <div
              v-else
              class="grid gap-1"
              :style="{
                gridTemplateColumns: `repeat(${currentSelectedClass.columns}, 1fr)`,
              }"
            >
              <div
                v-for="(seat, index) in currentSelectedClass.seats"
                :key="index"
                @click="onSeatClick(seat)"
                class="relative h-10 flex items-center justify-center border rounded-md text-xs font-medium cursor-pointer select-none overflow-hidden"
                :class="{
                  'bg-gray-300': seat.path, // walk path
                  'bg-red-700 text-white': seat.blocked, // blocked
                  'bg-gray-100': !seat.path && !seat.blocked, // normal
                  'ring-2 ring-blue-400': renameMode,
                }"
              >
                <!-- Seat number is hidden on block or walk path -->
                <span v-if="!seat.blocked && !seat.path">
                  {{ seat.seat_no }}
                </span>

                <!-- Block X -->
                <span
                  v-if="seat.blocked"
                  class="absolute inset-0 flex items-center justify-center text-white text-xl font-bold pointer-events-none"
                >
                  ✕
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- FOOTER -->
        <div class="flex justify-end gap-3 pt-6 border-t">
          <button type="button" @click="$emit('close')">Cancel</button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            :disabled="isLoading"
            @click="saveSeatmap"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              <span
                class="inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
              ></span>
              Saving...
            </span>
            <span v-else> Save Seatmap</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  accomodations: Array,
  seatmap: Object, // <--- new prop
});
const emit = defineEmits(["save", "close"]);

const currentSelectedClass = ref(null);
const addedClasses = ref([]);
const isOpen = ref(false);
const selectedClassIndex = ref(null);
const isLoading = ref(false);
const tempRows = ref(null);
const tempColumns = ref(null);
const renameMode = ref(false);
const blockMode = ref(false);
const pathMode = ref(false);
const availableClasses = computed(() =>
  props.accomodations.filter(
    (a) => !addedClasses.value.some((c) => c.name === a.name)
  )
);

const selectClass = (item) => {
  currentSelectedClass.value = item;
  tempRows.value = item.rows || null;
  tempColumns.value = item.columns || null;
};

const localSeatmap = ref({
  classes: props.accomodations.map((a) => ({
    name: a.name,
    seats: [], // default empty
  })),
});

// If editing existing seatmap, load it
watch(
  () => props.seatmap,
  (newVal) => {
    if (newVal) {
      addedClasses.value = JSON.parse(JSON.stringify(newVal.classes || []));
      currentSelectedClass.value = addedClasses.value[0] || null;
    }
  },
  { immediate: true }
);
const removeClass = (index) => {
  if (addedClasses.value[index] === currentSelectedClass.value)
    currentSelectedClass.value = null;
  addedClasses.value.splice(index, 1);
};

const addClass = () => {
  if (!selectedClassIndex.value) return;
  addedClasses.value.push({
    name: selectedClassIndex.value,
    rows: null,
    columns: null,
    seats: [],
  });
  selectedClassIndex.value = null;
  isOpen.value = false;
};
const cancelAction = () => (isOpen.value = false);
const saveChanges = () => addClass();

const generateSeats = () => {
  const cls = currentSelectedClass.value;
  if (!cls || !tempRows.value || !tempColumns.value)
    return alert("Enter rows and columns first.");
  cls.rows = Number(tempRows.value);
  cls.columns = Number(tempColumns.value);
  cls.seats = [];
  for (let r = 1; r <= cls.rows; r++) {
    for (let c = 1; c <= cls.columns; c++) {
      cls.seats.push({
        seat_no: `${r}${String.fromCharCode(64 + c)}`,
        blocked: false,
        path: false,
      });
    }
  }
};

const toggleRenameMode = () => (renameMode.value = !renameMode.value);
const onSeatClick = (seat) => {
  if (renameMode.value) {
    renameSeat(seat);
    return;
  }

  if (blockMode.value) {
    seat.blocked = !seat.blocked;
    seat.path = false; // cannot be both blocked & path
    return;
  }

  if (pathMode.value) {
    seat.path = !seat.path;
    seat.blocked = false; // cannot be both path & blocked
    return;
  }
};
const renameSeat = (seat) => {
  const newName = prompt("Rename seat:", seat.seat_no);
  if (newName?.trim()) seat.seat_no = newName.trim();
};
const toggleBlockMode = () => {
  blockMode.value = !blockMode.value;
  renameMode.value = false;
  pathMode.value = false;
};

const togglePathMode = () => {
  pathMode.value = !pathMode.value;
  renameMode.value = false;
  blockMode.value = false;
};

const resetSeats = () => {
  if (!currentSelectedClass.value) return;
  currentSelectedClass.value.seats.forEach((seat) => {
    seat.blocked = false;
    seat.path = false;
  });
};

const saveSeatmap = () => {
  if (!addedClasses.value.length) {
    alert("Add at least one class before saving!");
    return;
  }
  isLoading.value = true;
  try {
    const payload = {
      classes: addedClasses.value.map((c) => ({
        name: c.name,
        rows: c.rows || 0,
        columns: c.columns || 0,
        seats: c.seats || [],
      })),
    };
    console.log("Seatmap payload:", payload);
    emit("save", payload);
  } finally {
    isLoading.value = false;
  }
};
</script>
