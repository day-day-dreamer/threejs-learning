<template>
  <div class="bac">
    <slot></slot>
  </div>
</template>
<style scoped>
  .bac {
    position: absolute;
    padding: 10px;
    background-color: rgba(0, 0, 0, .4);
    z-index: 1000;
    right: 0;
    color: #fff;
    border-radius: 5px;
    min-width: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>