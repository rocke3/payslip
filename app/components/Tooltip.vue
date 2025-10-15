<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <UTooltip
    arrow
    :delayDuration="100"
    :text="text"
    :content="{
      side: 'left',
      sideOffset: 2,
    }"
  >
    <slot />
  </UTooltip>
</template>
