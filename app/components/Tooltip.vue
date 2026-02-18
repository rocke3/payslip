<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <UTooltip
    arrow
    :delay-duration="100"
    :content="{
      side: 'left',
      sideOffset: 2,
    }"
  >
    <template #content>
      <div class="bg-white p-2 rounded shadow" v-html="text" />
    </template>
    <slot />
  </UTooltip>
</template>
