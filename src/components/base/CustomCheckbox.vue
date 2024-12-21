<template>
  <div class="indicator" :class="{ indicator_done: checked }">
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
.indicator {
  width: 20px;
  height: 20px;
  border: 1.5px solid var(--color-main);
  border-radius: 12px;
  cursor: pointer;
  background-color: var(--color-text-main);
}
.indicator_done {
  background-color: var(--color-main);
}
</style>
