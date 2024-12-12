<template>
  <form @submit.prevent="handleSubmit">
    <h1>Create an account</h1>
    <FormInput
      v-for="(field, index) in inputFields"
      :key="index"
      :modelValue="field.model"
      :type="field.type"
      :placeholder="field.placeholder"
      :name="field.name"
      :autocomplete="field.autocomplete"
      :required="field.required"
      :errorMessage="field.errorMessage"
      @update:modelValue="(value) => (field.model = value)"
    />
    <div class="invalid-input">
      {{ errorMessage }}
    </div>
    <BaseButton
      :disabled="submitButtonDisabled || requestIsProcessing"
      class="medium-button"
      text="Register"
    />
  </form>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { required, email, minLength, sameAs } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import FormInput from '@/components/base/FormInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { registerUser, checkUsernameExists } from '@/services/auth.js'

const inputFields = reactive([
  {
    model: '',
    type: 'email',
    placeholder: 'Email',
    name: 'username',
    autocomplete: 'username',
    required: true,
    errorMessage: '',
  },
  {
    model: '',
    type: 'password',
    placeholder: 'Password',
    name: 'password',
    autocomplete: 'new-password',
    required: true,
    errorMessage: '',
  },
  {
    model: '',
    type: 'password',
    placeholder: 'Repeat Password',
    name: 'repeat-password',
    autocomplete: 'new-password',
    required: true,
    errorMessage: '',
  },
])

const errorMessage = ref('')
const requestIsProcessing = ref(false)
const router = useRouter()

const validationFields = computed(() => ({
  username: inputFields[0].model,
  password: inputFields[1].model,
  repeatPassword: inputFields[2].model,
}))

const rules = {
  validationFields: {
    username: { required, email },
    password: { required, minLength: minLength(6) },
    repeatPassword: {
      required,
      sameAsPassword: sameAs(computed(() => inputFields[1].model)),
    },
  },
}

const v$ = useVuelidate(rules, {
  validationFields,
})

const submitButtonDisabled = computed(
  () =>
    !validationFields.value.username ||
    !validationFields.value.password ||
    !validationFields.value.repeatPassword,
)

const getValidateMessage = () => {
  const validationErrors = {
    'username.required': 'Email is required',
    'username.email': 'Invalid email',
    'password.required': 'Password is required',
    'password.minLength': 'Password must be at least 6 characters long',
    'repeatPassword.required': 'Please, repeat the password',
    'repeatPassword.sameAsPassword': 'Passwords must match',
  }

  console.log(validationFields.value.password)
  console.log(validationFields.value.repeatPassword)

  if (v$.value.validationFields.$invalid) {
    const errors = Object.values(v$.value.validationFields.$errors)
    const firstError = errors.find((error) => error.$message !== '')
    if (firstError) {
      const key = `${firstError.$property}.${firstError.$validator}`
      return validationErrors[key] || firstError.$message
    }
  }
  return ''
}

const clearForm = () => {
  inputFields.forEach((field) => (field.model = ''))
}

const handleSubmit = async () => {
  errorMessage.value = ''
  v$.value.$touch()

  if (v$.value.$invalid) {
    errorMessage.value = getValidateMessage()
  } else {
    requestIsProcessing.value = true
    const userExists = await checkUsernameExists(inputFields[0].model)
    if (userExists) {
      errorMessage.value = 'This username is already taken'
      requestIsProcessing.value = false
      return
    }
    console.log('registered')
    const result = await registerUser(inputFields[0].model, inputFields[1].model)
    if (result === true) {
      router.push({ name: 'home' })
      clearForm()
    }
    requestIsProcessing.value = false
  }
}
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}

.invalid-input {
  font-size: 12px;
  line-height: 12px;
  color: var(--color-invalid-input);
  margin-top: 5px;
  margin-bottom: 10px;
}
</style>
