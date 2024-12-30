<template>
  <div class="error-message">
    <p>There was an error loading the data. Please try again later.</p>
  </div>
</template>

<style scoped>
.error-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-seventh);
  color: white;
  padding: 20px;
  border-radius: 8px;
  font-size: 18px;
  text-align: center;
}
</style>
