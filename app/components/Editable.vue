<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

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

const formatNumber = (num: number) => {
  if (num === undefined) return "";
  if (isNaN(num) || num === 0) return num;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

const updateElement = (val: string | number | undefined) => {
  if (!el.value) return;
  if (props.type === "number") {
    const n = Number(val);
    el.value.textContent = !isNaN(n) ? formatNumber(n) : "";
  } else {
    el.value.textContent = val ?? props.displayValue ?? "";
  }
};

const onBlur = (event: FocusEvent) => {
  if (!el.value) return;

  let value: string | number = el.value.textContent?.trim() ?? "";

  if (props.type === "number") {
    if (value === "") return;
    const parsedValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
    value = isNaN(parsedValue) ? 0 : parsedValue;
    el.value.textContent = formatNumber(value); // format displayed text
  }

  emit("update:modelValue", value);
};

// Update element on mount
onMounted(() => {
  updateElement(props.modelValue);
});

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newVal) => {
    updateElement(newVal);
  }
);
</script>

<template>
  <component
    :is="as"
    ref="el"
    class="editable-field px-1 -mx-1 transition-colors duration-200 outline-none leading-6"
    contenteditable
    @blur="onBlur"
  />
</template>
