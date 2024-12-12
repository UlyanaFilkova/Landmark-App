<template>
  <div class="todo__indicator" :class="{ todo__indicator_done: checked }">
    <DoneIcon v-if="checked" />
  </div>
</template>
<script>
import DoneIcon from '@/components/icons/DoneIcon.vue'

export default {
  components: {
    DoneIcon,
  },
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>
.todo__indicator {
  width: 24px;
  height: 24px;
  border: 1.5px solid var(--color-main);
  border-radius: 12px;
  cursor: pointer;
  background-color: var(--color-text-main);
}
.todo__indicator_done {
  background-color: var(--color-main);
}
</style>
