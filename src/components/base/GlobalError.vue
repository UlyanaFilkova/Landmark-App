<template>
  <div class="error-message">
    <p>{{ t('errors.loading_error') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style scoped>
.error-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-seventh);
  color: white;
  padding: 20px;
  border-radius: 8px;
  font-size: 18px;
  text-align: center;
}
</style>
