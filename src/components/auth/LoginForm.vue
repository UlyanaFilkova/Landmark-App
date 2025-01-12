<template>
  <form @submit.prevent="handleSubmit">
    <h1>{{ $t('login.header') }}</h1>
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
      :text="$t('login.button')"
    />
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import useVuelidate from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n'

import FormInput from '@/components/base/FormInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

import { checkUser } from '@/services/user.ts'

import type { InputField } from '@/types/interfaces.ts'

const router = useRouter()
const { t } = useI18n()

const inputFields = reactive<InputField[]>([
  {
    model: '',
    type: 'email',
    placeholder: t('login.placeholders.email'),
    name: 'username',
    autocomplete: 'username',
    required: true,
    errorMessage: '',
  },
  {
    model: '',
    type: 'password',
    placeholder: t('login.placeholders.password'),
    name: 'password',
    autocomplete: 'current-password',
    required: true,
    errorMessage: '',
  },
])
const errorMessage = ref<string>('')
const requestIsProcessing = ref<boolean>(false)

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

const getValidateMessage = (): string => {
  const validationErrors = {
    'username.required': t('common.validation.emailRequired'),
    'username.email': t('common.validation.emailInvalid'),
    'password.required': t('common.validation.passwordRequired'),
    'password.minLength': t('common.validation.passwordMinLength'),
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
    if (result === '') {
      router.push({ name: 'generalMap' })
      clearForm()
    } else {
      errorMessage.value = t(`errors.${result}`)
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

.medium-button {
  margin-bottom: 10px;
}
</style>
