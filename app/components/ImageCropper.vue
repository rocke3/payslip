<script setup lang="ts">
import { onMounted, ref } from "vue";

import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";

const props = defineProps<{
  modelValue: string | null;
}>();

const emit = defineEmits(["update:modelValue"]);

const cropper = ref<any>(null);
const inputFile = ref<HTMLInputElement | null>(null);

const imgSrc = ref(props.modelValue);
const cropImg = ref<string | null>(null);

const cropImage = () => {
  if (!cropper.value) return;
  const canvas = cropper.value.getCroppedCanvas();
  cropImg.value = canvas.toDataURL();
  emit("update:modelValue", cropImg.value);
  open.value = false;
};

onMounted(() => {
  if (!props.modelValue) return;
  cropImg.value = props.modelValue;
});

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
    <input ref="inputFile" type="file" name="image" accept="image/*" class="hidden" @change="setImage" />
    <div class="relative inline-block cursor-pointer group" @click.prevent="showFileChooser">
      <img v-if="cropImg" class="w-auto h-12 object-contain mx-auto" :src="cropImg" alt="Cropped Image" />
      <UButton v-else>Upload Image</UButton>
      <div class="no-print absolute -bottom-1 -right-1 size-5 rounded-full bg-blue-600 flex items-center justify-center shadow-sm opacity-70 group-hover:opacity-100 transition-opacity">
        <UIcon name="i-lucide-camera" class="size-3 text-white" />
      </div>
    </div>

    <UModal v-model:open="open" title="Crop Image" description="Upload and crop your company logo">
      <template #body>
        <div class="space-y-4">
          <div class="cropper-container rounded-lg overflow-hidden border border-slate-200">
            <VueCropper ref="cropper" :src="imgSrc" :aspect-ratio="200 / 50" preview=".preview" />
          </div>

          <!-- Toolbar -->
          <div class="flex items-center justify-center gap-2">
            <button class="crop-tool-btn" title="Reset" @click="reset">
              <UIcon name="i-lucide-refresh-cw" class="size-4" />
            </button>
            <button class="crop-tool-btn" title="Rotate Right" @click="rotate(90)">
              <UIcon name="i-lucide-rotate-cw" class="size-4" />
            </button>
            <button class="crop-tool-btn" title="Rotate Left" @click="rotate(-90)">
              <UIcon name="i-lucide-rotate-ccw" class="size-4" />
            </button>
            <div class="w-px h-6 bg-slate-200 mx-1" />
            <button class="crop-tool-btn" title="Zoom In" @click="zoom(0.1)">
              <UIcon name="i-lucide-zoom-in" class="size-4" />
            </button>
            <button class="crop-tool-btn" title="Zoom Out" @click="zoom(-0.1)">
              <UIcon name="i-lucide-zoom-out" class="size-4" />
            </button>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex items-center justify-end w-full gap-3">
          <button
            class="px-4 py-2 text-sm font-medium text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            @click="open = false"
          >
            Cancel
          </button>
          <button
            class="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-2"
            @click="cropImage"
          >
            <UIcon name="i-lucide-crop" class="size-4" />
            Crop & Save
          </button>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
.cropper-container {
  max-height: 350px;
  overflow: hidden;
}

.crop-tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
}

.crop-tool-btn:hover {
  background: #f1f5f9;
  border-color: #93c5fd;
  color: #2563eb;
}
</style>
