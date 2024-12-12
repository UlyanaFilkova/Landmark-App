<template>
  <div class="todo__delete">
    <svg
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 490 490"
      xml:space="preserve"
      stroke-width="25"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0" />
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <polygon
          points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490 489.292,457.678 277.331,245.004 489.292,32.337 "
        />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.todo__delete {
  width: 16px;
  height: 16px;
}
.todo__delete svg {
  width: 16px;
  height: 16px;
  fill: var(--color-delete);
  stroke: var(--color-delete);
}
.todo__delete:hover svg {
  fill: var(--color-delete-hover);
  stroke: var(--color-delete-hover);
}
</style>
