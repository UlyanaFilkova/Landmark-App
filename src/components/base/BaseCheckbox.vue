<template>
  <div class="checkbox-container">
    <input
      id="checkbox-id"
      type="checkbox"
      :value="modelValue"
      :checked="modelValue"
      @change="handleInput"
    />
    <label for="checkbox-id">{{ text }}</label>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  methods: {
    handleInput(event) {
      this.$emit('update:modelValue', event.target.checked)
    },
  },
}
</script>
<style scoped>
.checkbox-container {
  display: flex;
  align-items: end;
  gap: 6px;
}
.checkbox-container label {
  display: block;
  color: var(--color-tenth);
  margin-bottom: 5px;
  cursor: pointer;
  margin: 0;
}
input[type='checkbox'] {
  margin: 5px 0 0 0;
  height: 20px;
  width: 20px;
  border: 1px solid var(--color-eleventh);
  border-radius: 8px;
  outline: none;
  cursor: pointer;
}
</style>
