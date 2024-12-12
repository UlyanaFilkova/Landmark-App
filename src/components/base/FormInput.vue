<template>
  <div class="input-group">
    <input :type="type" :value="modelValue" @input="handleInput" :placeholder="placeholder" />
    <div class="invalid-input">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  methods: {
    handleInput(event) {
      this.$emit('update:modelValue', event.target.value)
    },
  },
}
</script>

<style scoped>
.input-group {
  margin: 15px 0 20px 0;
}
input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--color-border-one);
  border-radius: 5px;
}
.invalid-input {
  font-size: 12px;
  line-height: 12px;
  color: var(--color-invalid-input);
  margin-top: 5px;
}
</style>
