<template>
  <AuthContainer linkText="Already have an account?" linkTo="login" linkAction="Login">
    <RegistrationForm />
  </AuthContainer>
</template>

<script>
import RegistrationForm from '@/components/auth/RegistrationForm.vue'
import AuthContainer from '@/components/auth/AuthContainer.vue'

export default {
  components: {
    RegistrationForm,
    AuthContainer,
  },
}
</script>
