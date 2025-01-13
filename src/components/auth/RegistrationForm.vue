<template>
  <form @submit.prevent="handleSubmit">
    <h1>{{ t('registration.header') }}</h1>
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
      :text="t('registration.button')"
    />
  </form>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import useVuelidate from '@vuelidate/core'
import { required, email, minLength, sameAs } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n'

import FormInput from '@/components/base/FormInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

import { registerUser, checkUsernameExists } from '@/services/user.ts'

import type { InputField } from '@/types/interfaces.ts'

const errorMessage = ref<string>('')
const requestIsProcessing = ref<boolean>(false)
const router = useRouter()
const { t } = useI18n()

const inputFields = reactive<InputField[]>([
  {
    model: '',
    type: 'text',
    placeholder: t('registration.placeholders.email'),
    name: 'username',
    autocomplete: 'username',
    required: true,
    errorMessage: '',
  },
  {
    model: '',
    type: 'password',
    placeholder: t('registration.placeholders.password'),
    name: 'password',
    autocomplete: 'new-password',
    required: true,
    errorMessage: '',
  },
  {
    model: '',
    type: 'password',
    placeholder: t('registration.placeholders.repeatPassword'),
    name: 'repeat-password',
    autocomplete: 'new-password',
    required: true,
    errorMessage: '',
  },
])

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

const validationFields = computed(() => ({
  username: inputFields[0].model,
  password: inputFields[1].model,
  repeatPassword: inputFields[2].model,
}))

const v$ = useVuelidate(rules, {
  validationFields,
})

const submitButtonDisabled = computed<boolean>(
  () =>
    !validationFields.value.username ||
    !validationFields.value.password ||
    !validationFields.value.repeatPassword,
)

const getValidateMessage = (): string => {
  const validationErrors = {
    'username.required': t('inputs.validation.emailRequired'),
    'username.email': t('inputs.validation.emailInvalid'),
    'password.required': t('inputs.validation.passwordRequired'),
    'password.minLength': t('inputs.validation.passwordMinLength'),
    'repeatPassword.required': t('inputs.validation.repeatPasswordRequired'),
    'repeatPassword.sameAsPassword': t('inputs.validation.passwordsMustMatch'),
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
  errorMessage.value = ''
  v$.value.$touch()

  if (v$.value.$invalid) {
    errorMessage.value = getValidateMessage()
  } else {
    requestIsProcessing.value = true
    const userExists = await checkUsernameExists(inputFields[0].model)
    if (userExists) {
      errorMessage.value = t('errors.usernameTaken')
      requestIsProcessing.value = false
      return
    }

    const result = await registerUser(inputFields[0].model, inputFields[1].model)
    if (result === true) {
      router.push({ name: 'generalMap' })
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

.medium-button {
  margin-bottom: 10px;
}
</style>
