<template>
  <form @submit.prevent="handleSubmit">
    <h1>Login</h1>
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
      @update:modelValue="(value: string) => (field.model = value)"
    />
    <div class="invalid-input">
      {{ errorMessage }}
    </div>
    <BaseButton
      :disabled="submitButtonDisabled || requestIsProcessing"
      class="medium-button"
      text="Login"
    />
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import FormInput from '@/components/base/FormInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { required, email, minLength } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { checkUser } from '@/services/auth.ts'
import { useRouter } from 'vue-router'

interface InputField {
  model: string
  type: string
  placeholder: string
  name: string
  autocomplete: string
  required: boolean
  errorMessage: string
}

const inputFields = reactive<InputField[]>([
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
    autocomplete: 'current-password',
    required: true,
    errorMessage: '',
  },
])
const errorMessage = ref<string>('')
const requestIsProcessing = ref<boolean>(false)
const router = useRouter()

const rules = {
  validationFields: {
    username: { required, email },
    password: { required, minLength: minLength(6) },
  },
}

const validationFields = computed(() => ({
  username: inputFields[0].model,
  password: inputFields[1].model,
}))

const v$ = useVuelidate(rules, { validationFields })

const submitButtonDisabled = computed<boolean>(
  () => !validationFields.value.username || !validationFields.value.password,
)

const myObject: { a: number; b: boolean } = {
  a: 12,
  b: false,
}

;(Object.keys(myObject) as Array<keyof typeof myObject>).forEach((key) => {
  // some logic for the key
})

const updateValue = (field: InputField, value: string): void => {
  errorMessage.value = ''
  field.model = value
}
const getValidateMessage = (): string => {
  const validationErrors = {
    'username.required': 'Email is required',
    'username.email': 'Invalid email',
    'password.required': 'Password is required',
    'password.minLength': 'Password must be at least 6 characters long',
  }

  if (v$.value.validationFields.$invalid) {
    const errors = Object.values(v$.value.validationFields.$errors)
    const firstError = errors.find((error) => error.$message !== '')
    if (firstError) {
      const key =
        `${firstError.$property}.${firstError.$validator}` as keyof typeof validationErrors
      return validationErrors[key] || (firstError.$message as string)
    }
  }
  return ''
}
const clearForm = (): void => {
  inputFields.forEach((field) => (field.model = ''))
}
const handleSubmit = async (): Promise<void> => {
  v$.value.validationFields.$touch()

  if (v$.value.validationFields.$invalid) {
    errorMessage.value = getValidateMessage()
  } else {
    requestIsProcessing.value = true
    const result = await checkUser(inputFields[0].model, inputFields[1].model)
    if (result === true) {
      router.push({ name: 'home' })
      clearForm()
    } else {
      errorMessage.value = result
    }
    requestIsProcessing.value = false
    return
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
