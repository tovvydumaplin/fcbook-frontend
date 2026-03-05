<script setup>
import { User, Tag, LockKeyhole } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import IADetailsComponent from "./Components/InstitutionalAccount/IADetailsComponent.vue";
import IADiscountsComponent from "./Components/InstitutionalAccount/IADiscountsComponent.vue";

const activeTab = ref("ia-details");

const tabs = [
  { id: "ia-details", name: "Account Details", icon: User },
  { id: "ia-discounts", name: "Discounts", icon: Tag },
  { id: "ia-passwords", name: "Password", icon: LockKeyhole },
];
</script>

<template>
  <!-- LAYOUT -->
  <div class="border border-gray-300 bg-white rounded-lg">
    <nav class="flex space-x-4 p-2">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'flex items-center gap-2 py-2 px-3 font-medium text-md transition duration-500',
          activeTab === tab.id
            ? 'bg-white text-black border-b-2 border-black'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-bold',
        ]"
      >
        <component :is="tab.icon" class="w-4 h-4" />
        {{ tab.name }}
      </button>
    </nav>
    <IADetailsComponent v-if="activeTab === 'ia-details'" />
    <IADiscountsComponent v-else-if="activeTab === 'ia-discounts'" />
  </div>
</template>
