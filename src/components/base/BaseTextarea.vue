<template>
  <div class="input-group">
    <label v-if="label" :for="name">{{ label }}:</label>
    <textarea :name="name" :value="modelValue" @input="handleInput"></textarea>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: [String, Boolean],
      default: '',
    },
    label: {
      type: String,
    },
    name: {
      type: String,
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
.input-group label {
  display: block;
  color: var(--color-tenth);
  margin-bottom: 5px;
}
.input-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--color-eleventh);
  border-radius: 8px;
  display: block;
  margin-bottom: 20px;
  outline: none;
}
.input-group textarea:focus {
  outline: 1.5px solid var(--color-eleventh);
}
</style>
