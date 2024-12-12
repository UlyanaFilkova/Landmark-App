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

<script>
import FormInput from '@/components/base/FormInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { required, email, minLength, sameAs } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { registerUser, checkUsernameExists } from '@/services/auth.js'

export default {
  components: {
    FormInput,
    BaseButton,
  },
  data() {
    return {
      v$: useVuelidate(),
      errorMessage: '',
      requestIsProcessing: false,
      inputFields: [
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
      ],
    }
  },
  validations() {
    return {
      validationFields: {
        username: { required, email },
        password: { required, minLength: minLength(6) },
        repeatPassword: { required, sameAsPassword: sameAs(this.inputFields[1].model) },
      },
    }
  },
  computed: {
    validationFields() {
      return {
        username: this.inputFields[0].model,
        password: this.inputFields[1].model,
        repeatPassword: this.inputFields[2].model,
      }
    },
    submitButtonDisabled() {
      return (
        this.v$.validationFields.username.required.$invalid ||
        this.v$.validationFields.password.required.$invalid ||
        this.v$.validationFields.repeatPassword.required.$invalid
      )
    },
  },
  methods: {
    getValidateMessage() {
      const validationErrors = {
        'username.required': 'Email is required',
        'username.email': 'Invalid email',
        'password.required': 'Password is required',
        'password.minLength': 'Password must be at least 6 characters long',
        'repeatPassword.required': 'Please, repeat the password',
        'repeatPassword.sameAsPassword': 'Passwords must match',
      }

      if (this.v$.validationFields.$invalid) {
        const firstInvalidField = Object.keys(this.v$.validationFields.$errors).find(
          (key) => this.v$.validationFields.$errors[key].$message !== '',
        )
        const validator = this.v$.validationFields.$errors[firstInvalidField].$validator
        const property = this.v$.validationFields.$errors[firstInvalidField].$property
        const key = `${property}.${validator}`
        return validationErrors[key] || this.v$.validationFields.$errors[firstInvalidField].$message
      }
      return ''
    },
    clearForm() {
      this.inputFields[0].model = ''
      this.inputFields[1].model = ''
      this.inputFields[2].model = ''
    },
    async handleSubmit() {
      this.errorMessage = ''
      this.v$.validationFields.$touch()

      if (this.v$.validationFields.$invalid) {
        this.errorMessage = this.getValidateMessage()
      } else {
        this.requestIsProcessing = true
        const userExists = await checkUsernameExists(this.inputFields[0].model)
        if (userExists) {
          this.errorMessage = 'This username is already taken'
          this.requestIsProcessing = false
          return
        }
        const result = await registerUser(this.inputFields[0].model, this.inputFields[1].model)
        if (result === true) {
          this.$router.push({ name: 'home' })
          this.clearForm()
          this.requestIsProcessing = false
          return
        }
      }
    },
  },
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
