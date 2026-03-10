<script setup>
import { User, Tag, LockKeyhole } from "lucide-vue-next";
import { ref } from "vue";
import MerchantDetailsComponent from "./Components/Merchant/MerchantDetailsComponent.vue";
import MerchantDiscountsComponent from "./Components/Merchant/MerchantDiscountsComponent.vue";
import MerchantPasswordsComponent from "./Components/Merchant/MerchantPasswordsComponent.vue";

const activeTab = ref("merchant-details");

const tabs = [
  { id: "merchant-details", name: "Details", icon: User },
  { id: "merchant-discounts", name: "Discounts", icon: Tag },
  { id: "merchant-passwords", name: "Password", icon: LockKeyhole },
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
    <MerchantDetailsComponent v-if="activeTab === 'merchant-details'" />
    <MerchantDiscountsComponent
      v-else-if="activeTab === 'merchant-discounts'"
    />
    <MerchantPasswordsComponent
      v-else-if="activeTab === 'merchant-passwords'"
    />
  </div>
</template>
