<script setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
const step = ref(1);
const username = ref("");
const password = ref("");
const staySignedIn = ref(false);
const showPassword = ref(false);
const router = useRouter();
const route = useRoute();
const errorMsg = ref("");
const successMsg = ref(null);
const isLoading = ref(false);
const apiBase = import.meta.env.VITE_API_URL;
const handleNext = () => {
  if (username.value) step.value = 2;
};

const handleSignIn = async () => {
  errorMsg.value = "";
  isLoading.value = true;
  try {
    const response = await fetch(`${apiBase}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: username.value,
        password: password.value,
      }),
    });
    const data = await response.json();
    console.log("Login response:", data);
    console.log("apiBase:", apiBase);
    if (response.ok && data.success) {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      router.push({ path: "/dashboard", query: { loggedIn: "1" } });
    } else {
      if (data.errors) {
        if (data.errors.email && data.errors.email.length > 0) {
          errorMsg.value = data.errors.email[0];
        } else if (data.errors.password && data.errors.password.length > 0) {
          errorMsg.value = data.errors.password[0];
        } else {
          errorMsg.value = data.message || "Login failed";
        }
      } else if (
        data.message === "Unauthenticated" ||
        data.error_code === "UNAUTHENTICATED"
      ) {
        errorMsg.value = "Incorrect username or password.";
      } else {
        errorMsg.value = data.message || "Login failed";
      }
    }
  } catch (err) {
    errorMsg.value = "Network error";
  } finally {
    isLoading.value = false;
  }
};

const showSuccess = (title, description) => {
  successMsg.value = { title, description };
  setTimeout(() => {
    successMsg.value = null;
  }, 2200);
};

watch(
  () => route.query.loggedOut,
  (val) => {
    if (val) {
      showSuccess(
        "Signed out",
        "You’ve been logged out safely. See you next time.",
      );
      router.replace({ path: route.path, query: {} });
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.login-card {
  transition:
    transform 200ms ease,
    box-shadow 200ms ease;
  animation: welcome-drop 600ms ease;
}

.login-card:focus-within {
  transform: translateY(-2px);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.18);
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
  .login-card {
    animation: none;
  }
}
</style>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="login-card bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
      <div class="flex flex-col items-center">
        <img src="/assets/fastcat-logo.png" alt="FastCat" class="h-12 mb-8" />
      </div>
      <form @submit.prevent="step === 1 ? handleNext() : handleSignIn()">
        <div v-if="step === 1">
          <h2 class="text-xl font-bold text-gray-700 text-center">Sign in</h2>
          <p class="text-gray-600 text-sm mb-6 text-center">
            Enter your username to continue
          </p>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            v-model="username"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username"
            required
            :class="{ invisible: isLoading }"
          />
          <div
            class="flex items-center justify-between mb-8"
            :class="{ invisible: isLoading }"
          >
            <label class="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" v-model="staySignedIn" class="rounded" />
              Stay signed in
            </label>
            <a href="#" class="text-blue-600 text-sm hover:underline">
              Forgot email?
            </a>
          </div>
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
            :class="{ invisible: isLoading }"
            :disabled="isLoading"
          >
            Next
          </button>
          <div
            class="mt-6 text-center text-gray-500 text-sm"
            :class="{ invisible: isLoading }"
          ></div>
          <div
            class="mt-2 flex justify-center"
            :class="{ invisible: isLoading }"
          ></div>
        </div>
        <div v-else>
          <div class="mb-6 text-center flex flex-col items-center">
            <span class="text-gray-700 mb-2">Signing in as</span>
            <span
              class="inline-flex items-center justify-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium ml-2 border border-blue-600 max-w-xs truncate"
            >
              {{ username }}
            </span>
          </div>
          <label
            class="block text-sm font-medium text-gray-700 mb-1"
            :class="{ invisible: isLoading }"
          >
            Password
          </label>
          <div class="relative mb-3" :class="{ invisible: isLoading }">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              class="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-transform duration-150 hover:scale-110"
              @click="showPassword = !showPassword"
              tabindex="-1"
            >
              <Eye v-if="!showPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button>
          </div>
          <div
            class="flex items-center justify-between mb-6"
            :class="{ invisible: isLoading }"
          >
            <a href="#" class="text-blue-600 text-sm hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="button"
            class="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
            @click="handleSignIn"
            :disabled="isLoading"
            :class="{ invisible: isLoading }"
          >
            Proceed
          </button>
          <div class="mt-6 text-center" :class="{ invisible: isLoading }">
            <button
              type="button"
              class="text-gray-600 text-sm hover:underline transition-colors hover:text-blue-600"
              @click="step = 1"
              :disabled="isLoading"
            >
              Sign in with a different account
            </button>
          </div>
        </div>

        <div v-if="isLoading" class="mt-4 flex flex-col items-center">
          <div class="flex justify-center items-center w-full">
            <span
              class="inline-block w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
            ></span>
          </div>
          <span class="text-blue-600 text-sm font-medium mt-3"
            >Logging in...</span
          >
        </div>
      </form>
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
        v-if="errorMsg"
        class="flex items-center gap-2 text-red-500 absolute top-[50px] left-1/2 -translate-x-1/2 p-3 bg-red-100 rounded-xl shadow-lg"
      >
        <AlertCircle class="w-5 h-5 flex-shrink-0" />
        <span>{{ errorMsg }}</span>
      </div>
    </transition>
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
