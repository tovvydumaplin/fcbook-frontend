<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Settings } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const successMsg = ref(null);

const showSuccess = (title, description) => {
  successMsg.value = { title, description };
  setTimeout(() => {
    successMsg.value = null;
  }, 2200);
};

watch(
  () => route.query.loggedIn,
  (val) => {
    if (val) {
      showSuccess(
        "Welcome back!",
        "You’re signed in. Redirecting to your dashboard.",
      );
      router.replace({ path: route.path, query: {} });
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.welcome-card {
  animation: welcome-drop 600ms ease;
}

@keyframes welcome-drop {
  0% {
    opacity: 0;
    transform: translateY(-12px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .welcome-card {
    animation: none;
  }
}
</style>

<template>
  <div class="min-h-full flex items-center justify-center bg-gray-50">
    <div
      class="welcome-card bg-white rounded-xl shadow-lg p-8 w-full max-w-lg text-center"
    >
      <h1 class="text-3xl font-bold text-blue-700 mb-4">
        Welcome to Fastcat Book
      </h1>
      <p class="text-gray-600 mb-6">
        Your dashboard is under construction. Please use the sidebar to navigate
        to other sections.
      </p>
      <router-link
        to="/"
        class="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition flex items-center justify-center gap-2"
      >
        <div class="flex gap-2 items-center">
          <Settings class="w-5 h-5 animate-spin" />
          In Progress
        </div>
      </router-link>
    </div>
    <transition
      name="slide-down"
      enter-active-class="transition-all duration-300"
      leave-active-class="transition-all duration-200"
      enter-from-class="opacity-0 -translate-y-6"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-6"
    >
      <div
        v-if="successMsg"
        class="fixed top-6 right-6 z-50 flex items-start gap-3 rounded-2xl border border-gray-200 bg-white/90 px-4 py-3 text-gray-900 shadow-md shadow-gray-200/60 backdrop-blur"
      >
        <div
          class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100"
        >
          <svg
            class="h-5 w-5 text-green-600"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div class="text-left">
          <div class="font-semibold leading-5 text-green-700">
            {{ successMsg.title }}
          </div>
          <div class="text-xs text-gray-600">
            {{ successMsg.description }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
