<template>
  <AuthContainer linkText="Already have an account?" linkTo="login" linkAction="Login">
    <RegistrationForm />
  </AuthContainer>
</template>

<script lang="ts" setup>
import RegistrationForm from '@/components/auth/RegistrationForm.vue'
import AuthContainer from '@/components/auth/AuthContainer.vue'
</script>
