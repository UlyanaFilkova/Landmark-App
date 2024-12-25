<template>
  <AuthContainer linkText="Don't have an account yet?" linkTo="registration" linkAction="Create">
    <LoginForm />
  </AuthContainer>
</template>

<script lang="ts" setup>
import LoginForm from '@/components/auth/LoginForm.vue';
import AuthContainer from '@/components/auth/AuthContainer.vue';

</script>