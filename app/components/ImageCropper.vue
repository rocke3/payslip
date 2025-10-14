<script setup lang="ts">
import { ref } from "vue";

import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";

const props = defineProps<{
  modelValue: string | null;
}>();

const emit = defineEmits(["update:modelValue"]);

const cropper = ref<any>(null);
const inputFile = ref<HTMLInputElement | null>(null);

const imgSrc = ref("/assets/images/berserk.jpg");
const cropImg = ref<string | null>(null);

const cropImage = () => {
  if (!cropper.value) return;
  const canvas = cropper.value.getCroppedCanvas();
  cropImg.value = canvas.toDataURL();
  emit("update:modelValue", cropImg.value);
  open.value = false;
};

const rotate = (deg: number) => {
  cropper.value?.rotate(deg);
};
const reset = () => {
  cropper.value?.reset();
};
const zoom = (percent: number) => {
  cropper.value?.relativeZoom(percent);
};

const setImage = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select an image file");
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    imgSrc.value = event.target?.result as string;
    cropper.value?.replace(imgSrc.value);
  };
  reader.readAsDataURL(file);
  open.value = true;
};

const showFileChooser = () => {
  inputFile.value?.click();
};
const open = ref(false);
</script>

<template>
  <div>
    <input
      ref="inputFile"
      type="file"
      name="image"
      accept="image/*"
      @change="setImage"
      class="hidden"
    />
    <div @click.prevent="showFileChooser">
      <img
        v-if="cropImg"
        :src="cropImg"
        alt="Cropped Image"
        class="w-auto h-12 object-contain mx-auto"
      />
      <UButton v-else>Upload Image</UButton>
    </div>

    <UModal v-model:open="open" title="Crop Image">
      <template #body>
        <div class="p-4">
          <VueCropper
            ref="cropper"
            :src="imgSrc"
            :aspect-ratio="200 / 50"
            preview=".preview"
          />
          <div class="flex justify-between mt-4">
            <UButton @click="reset" icon="i-lucide-refresh-cw" label="Reset" />
            <UButton @click="rotate(90)" icon="i-lucide-rotate-cw" />
            <UButton @click="rotate(-90)" icon="i-lucide-rotate-ccw" />
            <UButton @click="zoom(0.1)" icon="i-lucide-zoom-in" />
            <UButton @click="zoom(-0.1)" icon="i-lucide-zoom-out" />
            <UButton @click="cropImage" icon="i-lucide-crop" label="Crop" />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped></style>
