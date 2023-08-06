<template>
  <div class="flex flex-column md:flex-row gap-5 mx-5">
    <div class="flex-grow-1">
      <slot name="main"></slot>
    </div>
    <div class="md:w-3">
      <slot name="sidebar"></slot>
    </div>
  </div>
</template>
