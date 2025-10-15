<!-- filepath: d:\Fastcat Book 2\fcbook-frontend\src\views\Login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
      <div class="flex flex-col items-center">
        <img src="/assets/fastcat-logo.png" alt="FastCat" class="h-12 mb-8" />
      </div>
      <form @submit.prevent="step === 1 ? handleNext() : handleSignIn()">
        <div v-if="step === 1">
          <h2 class="text-xl font-bold text-gray-700 mb-2 text-center">
            Sign in
          </h2>
          <p class="text-gray-600 text-sm mb-4 text-center">
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
            class="flex items-center justify-between mb-4"
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
            class="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
            :class="{ invisible: isLoading }"
            :disabled="isLoading"
          >
            Next
          </button>
          <div
            class="mt-6 text-center text-gray-500 text-sm"
            :class="{ invisible: isLoading }"
          >
            or
          </div>
          <div
            class="mt-2 flex justify-center"
            :class="{ invisible: isLoading }"
          >
            <button
              type="button"
              class="flex items-center gap-2 px-4 py-2 text-gray-500 rounded hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <img src="/assets/google-icon.png" alt="Google" class="h-5 w-5" />
              Sign in with Google
            </button>
          </div>
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
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
              @click="showPassword = !showPassword"
              tabindex="-1"
            >
              <svg
                v-if="!showPassword"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9 0c0 5 9 5 9 0s-9-5-9 0z"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7a9.97 9.97 0 013.22-5.79M6.7 6.7A9.97 9.97 0 0112 5c5 0 9 4 9 7 0 1.61-.62 3.11-1.67 4.33M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9 0c0 5 9 5 9 0s-9-5-9 0z"
                />
              </svg>
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
            class="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
            @click="handleSignIn"
            :disabled="isLoading"
            :class="{ invisible: isLoading }"
          >
            Proceed
          </button>
          <div class="mt-6 text-center" :class="{ invisible: isLoading }">
            <button
              type="button"
              class="text-gray-600 text-sm hover:underline"
              @click="step = 1"
              :disabled="isLoading"
            >
              Sign in with a different account
            </button>
          </div>
        </div>
        <div v-if="errorMsg" class="text-red-500 mt-2">{{ errorMsg }}</div>
        <!-- Replace the loading bar section with this spinner -->
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
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const step = ref(1);
const username = ref("");
const password = ref("");
const staySignedIn = ref(false);
const showPassword = ref(false);
const router = useRouter();
const errorMsg = ref("");
const isLoading = ref(false);

const handleNext = () => {
  if (username.value) step.value = 2;
};

const handleSignIn = async () => {
  errorMsg.value = "";
  isLoading.value = true;
  try {
    const response = await fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: username.value,
        password: password.value,
      }),
    });
    const data = await response.json();
    console.log("Login response:", data);

    if (response.ok && data.success) {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      router.push("/dashboard");
    } else {
      errorMsg.value = data.message || "Login failed";
      alert(errorMsg.value);
      if (errorMsg.value === "Unauthenticated") {
        alert("Incorrect username/password.");
      }
    }
  } catch (err) {
    errorMsg.value = "Network error";
    alert(errorMsg.value);
  } finally {
    isLoading.value = false;
  }
};
</script>
