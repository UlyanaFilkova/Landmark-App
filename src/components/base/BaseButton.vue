<template>
  <button>{{ props.text }}</button>
</template>

<script setup lang="ts">
const props = defineProps<{
  text: string
}>()
</script>

<style scoped>
.small-button {
  padding: 7px 10px;
  border-radius: 5px;
  background: var(--color-first);
}
.small-button:hover {
  background: var(--color-second-hover);
}
.small-button.grey,
.medium-button.grey {
  background: var(--color-third);
  color: white;
}
.small-button.grey:hover,
.medium-button.grey:hover {
  background: var(--color-third-hover);
}

.small-button.red,
.medium-button.red {
  background: var(--color13);
  color: white;
}
.small-button.red:hover,
.medium-button.red:hover {
  background: var(--color13-hover);
}
.big-button {
  width: 176px;
  padding: 14px 24px;
  background-color: var(--color-main);
  color: var(--color-text-main);
  border-radius: 8px;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.4);
}
.big-button:hover {
  background-color: var(--color-main-hover);
}
.big-button:disabled,
.medium-button:disabled {
  background-color: var(--color-main-disabled);
  cursor: auto;
}
.medium-button {
  width: 100%;
  padding: 10px;
  background-color: var(--color-main);
  color: var(--color-text-main);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  /* margin-bottom: 10px; */
}

.medium-button:hover {
  background-color: var(--color-main-hover);
}

.medium-button:disabled {
  background-color: var(--color-main-disabled);
  cursor: auto;
}
</style>
