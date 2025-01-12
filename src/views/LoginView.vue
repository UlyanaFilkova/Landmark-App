<template>
  <AuthContainer
    :linkText="t('login.question')"
    linkTo="registration"
    :linkAction="t('registration.link')"
  >
    <LoginForm />
  </AuthContainer>
</template>

<script lang="ts" setup>
import LoginForm from '@/components/auth/LoginForm.vue'
import AuthContainer from '@/components/auth/AuthContainer.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
