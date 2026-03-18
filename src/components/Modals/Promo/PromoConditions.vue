<script setup>
import { ref, computed } from "vue";

const emit = defineEmits(["update:modelValue"]);
const apiBase = import.meta.env.VITE_API_URL;

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      vehicles: [],
      passenger: [],
      accommodation: [],
      ports: [],
      schedules: [],
    }),
  },
});

const modal = ref({
  open: false,
  type: null,
  label: "",
  items: [],
  isLoading: false,
  tempSelected: [],
});

const conditionConfig = {
  vehicles: {
    label: "Vehicles",
    endpoint: "/vehicles",
    getId: (item) => item.vehicle_id,
    getName: (item) => item.vehicle_class,
  },
  passenger: {
    label: "Passenger",
    endpoint: "/passenger-types",
    getId: (item) => item.p_id,
    getName: (item) => item.type,
    fromData: (data) => data.data?.types ?? [],
    hasPax: true,
  },
  accommodation: {
    label: "Accommodation",
    endpoint: "/passenger-accommodations",
    getId: (item) => item.accommodation_id,
    getName: (item) => item.accommodation_name,
  },
  ports: {
    label: "Ports",
    endpoint: "/ports",
    getId: (item) => item.port_id,
    getName: (item) => item.port_name,
    fromData: (data) => data.data?.ports ?? [],
  },
  schedules: {
    label: "Schedules",
    endpoint: "/schedules",
    getId: (item) => item.sched_id,
    getName: (item) => item.departure_time,
    fromData: (data) => data.data?.schedules ?? [],
    grouped: true,
    getPort: (item) => item.port,
  },
};

const groupedItems = computed(() => {
  if (!conditionConfig[modal.value.type]?.grouped) return null;
  const config = conditionConfig[modal.value.type];
  const groups = {};
  for (const item of modal.value.items) {
    const port = config.getPort(item);
    const key = port.id;
    if (!groups[key]) groups[key] = { portName: port.name, items: [] };
    groups[key].items.push(item);
  }
  return Object.values(groups);
});

const isPaxChecked = (id) => modal.value.tempSelected.some((s) => s.id === id);

const getPax = (id) =>
  modal.value.tempSelected.find((s) => s.id === id)?.pax ?? 1;

const togglePaxItem = (id) => {
  const list = modal.value.tempSelected;
  const idx = list.findIndex((s) => s.id === id);
  if (idx === -1) list.push({ id, pax: 1 });
  else list.splice(idx, 1);
};

const updatePax = (id, pax) => {
  const entry = modal.value.tempSelected.find((s) => s.id === id);
  if (entry) entry.pax = Math.max(1, Number(pax) || 1);
};

const toggleItem = (id) => {
  const list = modal.value.tempSelected;
  const idx = list.indexOf(id);
  if (idx === -1) list.push(id);
  else list.splice(idx, 1);
};

const closeModal = () => (modal.value.open = false);

const openModal = async (type) => {
  const config = conditionConfig[type];
  modal.value = {
    open: true,
    type,
    label: config.label,
    items: [],
    isLoading: true,
    tempSelected: config.hasPax
      ? props.modelValue[type].map((s) => ({ ...s }))
      : [...(props.modelValue[type] ?? [])],
  };

  try {
    const response = await fetch(`${apiBase}${config.endpoint}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await response.json();
    modal.value.items = config.fromData
      ? config.fromData(data)
      : (data.data?.[type] ?? data.data ?? []);
  } catch (err) {
    console.error(`Failed to fetch ${type}:`, err);
  } finally {
    modal.value.isLoading = false;
  }
};

const applyModal = () => {
  emit("update:modelValue", {
    ...props.modelValue,
    [modal.value.type]: [...modal.value.tempSelected],
  });
  modal.value.open = false;
};
</script>

<template>
  <div>
    <div class="flex flex-col gap-2">
      <p class="text-xs text-gray-500 mb-1">
        Click a condition to select applicable items.
      </p>
      <button
        v-for="(config, type) in conditionConfig"
        :key="type"
        type="button"
        @click="openModal(type)"
        class="flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <span>{{ config.label }}</span>
        <span
          v-if="modelValue[type]?.length"
          class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-white bg-blue-600 rounded-full"
        >
          {{ modelValue[type].length }}
        </span>
        <svg
          v-else
          class="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>

    <!-- Selection Modal -->

    <teleport to="body">
      <transition name="modal-fade">
        <div
          v-if="modal.open"
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]"
          @click="closeModal"
        >
          <div
            class="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4"
            @click.stop
          >
            <!-- Header -->
            <div
              class="flex items-center justify-between px-5 py-4 border-b border-gray-200"
            >
              <h3 class="text-base font-semibold text-gray-900">
                Select {{ modal.label }}
              </h3>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg
                  class="w-5 h-5"
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
            <!-- Body -->
            <div class="px-5 py-4 min-h-[160px] max-h-72 overflow-y-auto">
              <!-- Loading -->
              <div
                v-if="modal.isLoading"
                class="flex items-center justify-center h-32 gap-2 text-gray-500 text-sm"
              >
                <span
                  class="inline-block w-5 h-5 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
                ></span>
                Loading...
              </div>
              <!-- Empty -->
              <div
                v-else-if="!modal.items.length"
                class="flex items-center justify-center h-32 text-gray-400 text-sm"
              >
                No items found.
              </div>
              <!-- Pax layout (passenger) -->
              <div
                v-else-if="conditionConfig[modal.type].hasPax"
                class="flex flex-col gap-1"
              >
                <label
                  v-for="item in modal.items"
                  :key="conditionConfig[modal.type].getId(item)"
                  class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :checked="
                      isPaxChecked(conditionConfig[modal.type].getId(item))
                    "
                    @change="
                      togglePaxItem(conditionConfig[modal.type].getId(item))
                    "
                    class="h-4 w-4 text-blue-600 border-gray-300 rounded shrink-0"
                  />
                  <span class="text-sm text-gray-700 flex-1">
                    {{ conditionConfig[modal.type].getName(item) }}
                  </span>
                  <!-- Pax input — only visible when checked -->
                  <div
                    class="flex items-center gap-1.5 text-gray-700"
                    @click.stop
                  >
                    <input
                      type="number"
                      min="1"
                      :value="getPax(conditionConfig[modal.type].getId(item))"
                      :disabled="
                        !isPaxChecked(conditionConfig[modal.type].getId(item))
                      "
                      @input="
                        (e) =>
                          updatePax(
                            conditionConfig[modal.type].getId(item),
                            e.target.value,
                          )
                      "
                      class="w-16 px-2 py-1 text-sm text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span class="text-xs text-gray-500 shrink-0">pax</span>
                  </div>
                </label>
              </div>

              <!-- Grouped layout (schedules) -->
              <div v-else-if="groupedItems" class="flex flex-col gap-4">
                <div v-for="group in groupedItems" :key="group.portName">
                  <p
                    class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5"
                  >
                    {{ group.portName }}
                  </p>
                  <div class="flex flex-col gap-1">
                    <label
                      v-for="item in group.items"
                      :key="conditionConfig[modal.type].getId(item)"
                      class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        :value="conditionConfig[modal.type].getId(item)"
                        :checked="
                          modal.tempSelected.includes(
                            conditionConfig[modal.type].getId(item),
                          )
                        "
                        @change="
                          toggleItem(conditionConfig[modal.type].getId(item))
                        "
                        class="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span class="text-sm text-gray-700">
                        {{ conditionConfig[modal.type].getName(item) }}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Flat layout (all other types) -->
              <div v-else class="flex flex-col gap-2">
                <label
                  v-for="item in modal.items"
                  :key="conditionConfig[modal.type].getId(item)"
                  class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :value="conditionConfig[modal.type].getId(item)"
                    :checked="
                      modal.tempSelected.includes(
                        conditionConfig[modal.type].getId(item),
                      )
                    "
                    @change="
                      toggleItem(conditionConfig[modal.type].getId(item))
                    "
                    class="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span class="text-sm text-gray-700">
                    {{ conditionConfig[modal.type].getName(item) }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Footer -->
            <div
              class="flex items-center justify-between px-5 py-4 border-t border-gray-200"
            >
              <span class="text-xs text-gray-500"
                >{{ modal.tempSelected.length }} selected</span
              >
              <div class="flex gap-2">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  @click="applyModal"
                  class="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-4px);
}
</style>
