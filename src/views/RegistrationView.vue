<template>
  <AuthContainer
    :linkText="t('registration.question')"
    linkTo="login"
    :linkAction="t('login.link')"
  >
    <RegistrationForm />
  </AuthContainer>
</template>

<script lang="ts" setup>
import RegistrationForm from '@/components/auth/RegistrationForm.vue'
import AuthContainer from '@/components/auth/AuthContainer.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
