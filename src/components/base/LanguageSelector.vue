<template>
  <div class="language-selector">
    <select v-model="selectedLanguage" @change="changeLanguage" ref="select">
      <option value="en">English</option>
      <option value="ru">Русский</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const selectedLanguage = ref(locale.value)
const select = ref<HTMLSelectElement | null>(null)

watch(locale, (newLocale) => {
  selectedLanguage.value = newLocale
})

const changeLanguage = () => {
  locale.value = selectedLanguage.value
  localStorage.setItem('app-language', selectedLanguage.value)
  select.value?.blur()
}
</script>

<style scoped>
.language-selector {
  display: flex;
  align-items: center;
}

select {
  padding: 5px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
