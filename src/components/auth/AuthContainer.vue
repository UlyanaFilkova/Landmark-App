<template>
  <div class="login-container">
    <slot></slot>
    <div class="form-link">
      {{ linkText }}
      <router-link :to="linkTo" class="login__link">{{ linkAction }}</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface Props {
  linkText: string
  linkTo: string
  linkAction: string
}

defineProps<Props>()
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid var(--color-border-one);
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-link {
  margin: 0 auto;
  width: fit-content;
}

.login__link {
  color: var(--color-login-link);
  text-decoration: underline;
}

.login__link:hover {
  cursor: pointer;
  text-decoration: none;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: var(--color-main);
  color: var(--color-text-main);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
}

button:hover {
  background-color: var(--color-main-hover);
}

button:disabled {
  background-color: var(--color-main-disabled);
  cursor: auto;
}

.invalid-input {
  font-size: 12px;
  line-height: 12px;
  color: var(--color-invalid-input);
  margin-top: 5px;
  margin-bottom: 10px;
}
</style>
