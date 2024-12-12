<template>
  <div class="loader-overlay">
    <img src="@/assets/200w.webp" alt="Loading..." class="loader" />
  </div>
</template>

<style scoped>
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-text-main);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.loader {
  width: 100px;
  height: 100px;
}
</style>
