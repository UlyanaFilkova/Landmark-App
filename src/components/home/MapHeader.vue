<template>
  <div class="map-header">
    <div class="map-header-container">
      <LanguageSelector />
      <RouterLink v-if="userHasAddPermission" :to="{ name: 'addPlace' }">
        <BaseButton class="medium-button" :text="t('common.buttons.addNewPlace')" />
      </RouterLink>
    </div>
    <div class="map-header-container single">
      <h2 class="map-header__h2">{{ t('common.titles.topPlaces') }}</h2>
      <BaseButton
        class="medium-button grey"
        :text="t('common.buttons.logout')"
        @click="handleLogoutClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import BaseButton from '@/components/base/BaseButton.vue'
import LanguageSelector from '@/components/home/LanguageSelector.vue'
import { useUserStore } from '@/stores/userStore.ts'

const { t } = useI18n()

const userStore = useUserStore()

const userHasAddPermission = ref(true)

const handleLogoutClick = () => {
  userStore.logout()
}

watch(
  () => userStore.getUser,
  () => {
    if (userStore.getUser) {
      userHasAddPermission.value = userStore.getUser?.role === 2
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.map-header {
  padding: 20px 0 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4%;
}
.map-header-container {
  display: flex;
  justify-content: space-between;
  width: 50%;
  align-items: center;
}
.map-header__h1 {
  color: var(--color-14);
}

.map-header__h2 {
  color: var(--color-14);
  flex-grow: 1;
  text-align: center;
  padding: 0;
  line-height: normal;
}

@media (max-width: 992px) {
  .map-header__h2 {
    display: none;
  }
  .map-header-container {
    display: flex;
    justify-content: space-between;
    width: auto;
    flex-grow: 1;
    align-items: center;
    gap: 10px;
  }
  .map-header-container.single {
    width: fit-content;
    flex-grow: 0;
  }
}

@media (max-width: 410px) {
  .map-header__h1 {
    display: none;
  }
}

.medium-button {
  max-width: 200px;
  width: fit-content;
}
</style>
