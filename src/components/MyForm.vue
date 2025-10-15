<template>
  <div class="form-container">
    <h2>Simple Form</h2>

    <form @submit.prevent="handleSubmit">
      <div>
        <label for="name">Name:</label>
        <input id="name" v-model="form.name" type="text" required />
      </div>

      <div>
        <label for="email">Email:</label>
        <input id="email" v-model="form.email" type="email" required />
      </div>

      <button type="submit">Submit</button>
    </form>

    <!-- Show submitted data -->
    <div v-if="submitted">
      <h3>Submitted Data:</h3>
      <p><strong>Name:</strong> {{ form.name }}</p>
      <p><strong>Email:</strong> {{ form.email }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// state for form
const form = ref({
  name: "",
  email: "",
});

// track if form is submitted
const submitted = ref(false);

function handleSubmit() {
  submitted.value = true;
}
</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: 20px auto;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.form-container div {
  margin-bottom: 10px;
}
</style>
