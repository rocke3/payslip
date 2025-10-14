<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: string | number | undefined;
    as?: string;
    type?: "text" | "number";
    displayValue?: string;
  }>(),
  {
    as: "p",
    type: "text",
  }
);

const emit = defineEmits(["update:modelValue"]);
const el = ref<HTMLElement | null>(null);

const onBlur = (event: FocusEvent) => {
  const target = event.target as HTMLElement;
  let value: string | number = target.textContent ?? "";

  if (props.type === "number") {
    const parsedValue = parseFloat(String(value).replace(/[^0-9.-]+/g, ""));
    value = isNaN(parsedValue) ? 0 : parsedValue;
  }

  emit("update:modelValue", value);

  // Force re-render with formatted value if displayValue is provided
  if (props.displayValue && target) {
    target.textContent = props.displayValue;
  }
};

onMounted(() => {
  if (el.value) {
    el.value.textContent = props.displayValue ?? String(props.modelValue ?? "");
  }
});
</script>

<template>
  <component
    :is="as"
    ref="el"
    contenteditable
    @blur="onBlur"
    class="editable-field rounded px-1 -mx-1 transition-colors duration-200 outline-none leading-5"
  />
</template>
