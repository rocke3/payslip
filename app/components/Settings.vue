<script setup lang="ts">
import { ref } from "vue";
import { useSetting, useInfo, resetAllData, exportData, importData } from "../composables/usePayslipData";
const colorMode = useColorMode();
const setting = useSetting();
const info = useInfo();
const open = ref(false);
const print = () => window.print();
const confirmReset = () => {
  if (window.confirm("Reset all data to defaults? This cannot be undone.")) resetAllData();
};

const fonts = ref([
  {
    label: "Open Sans",
    id: "fontOpenSans",
  },
  {
    label: "Roboto",
    id: "fontRoboto",
  },
  {
    label: "Poppins",
    id: "fontPoppins",
  },
  {
    label: "Inter",
    id: "fontInter",
  },
  {
    label: "Lato",
    id: "fontLato",
  },
  {
    label: "Spectral",
    id: "fontSpectral",
  },
  {
    label: "Merriweather",
    id: "fontMerriweather",
  },
]);

const currencys = ref([
  "USD",
  "EUR",
  "GBP",
  "AUD",
  "CAD",
  "NZD",
  "CHF",
  "JPY",
  "CNY",
]);
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  },
});
</script>

<template>
  <div :class="setting.fontFamily">
    <div class="no-print">
      <div class="fixed bottom-5 right-5 flex flex-col items-center gap-3 z-10">
        <!-- Color pickers group -->
        <div class="flex flex-col items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-xl p-1.5 shadow-lg border border-slate-200/80">
          <Tooltip text="Primary Color">
            <label class="block size-8 rounded-lg overflow-hidden cursor-pointer hover:scale-110 transition-transform duration-200 ring-1 ring-slate-200">
              <input
                v-model="setting.primaryColor"
                type="color"
                class="size-10 scale-125 -mt-0.5 -ml-0.5 cursor-pointer"
              >
            </label>
          </Tooltip>
          <Tooltip text="Secondary Color">
            <label class="block size-8 rounded-lg overflow-hidden cursor-pointer hover:scale-110 transition-transform duration-200 ring-1 ring-slate-200">
              <input
                v-model="setting.secondaryColor"
                type="color"
                class="size-10 scale-125 -mt-0.5 -ml-0.5 cursor-pointer"
              >
            </label>
          </Tooltip>
          <Tooltip text="Border Color">
            <label class="block size-8 rounded-lg overflow-hidden cursor-pointer hover:scale-110 transition-transform duration-200 ring-1 ring-slate-200">
              <input
                v-model="setting.border"
                type="color"
                class="size-10 scale-125 -mt-0.5 -ml-0.5 cursor-pointer"
              >
            </label>
          </Tooltip>
        </div>

        <!-- Action buttons group -->
        <div class="flex flex-col items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-xl p-1.5 shadow-lg border border-slate-200/80">
          <Tooltip text="Toggle Dark Mode">
            <button
              class="fab-btn bg-slate-700 hover:bg-slate-800"
              @click="isDark = !isDark"
            >
              <ClientOnly>
                <UIcon
                  :name="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
                  class="size-4"
                />
                <template #fallback>
                  <UIcon name="i-lucide-moon" class="size-4" />
                </template>
              </ClientOnly>
            </button>
          </Tooltip>
          <Tooltip text="Quick Guide">
            <button
              class="fab-btn bg-slate-500 hover:bg-slate-600"
              @click="info.showInfo = !info.showInfo"
            >
              <UIcon name="i-lucide-help-circle" class="size-4" />
            </button>
          </Tooltip>
          <Tooltip text="Export JSON">
            <button
              class="fab-btn bg-green-600 hover:bg-green-700"
              @click="exportData"
            >
              <UIcon name="i-lucide-download" class="size-4" />
            </button>
          </Tooltip>
          <Tooltip text="Print / Save as PDF">
            <button
              class="fab-btn bg-blue-600 hover:bg-blue-700"
              @click="print"
            >
              <UIcon name="i-lucide-printer" class="size-4" />
            </button>
          </Tooltip>
          <Tooltip text="Settings">
            <button
              class="fab-btn bg-blue-600 hover:bg-blue-700"
              @click="open = true"
            >
              <UIcon name="i-lucide-settings" class="size-4" />
            </button>
          </Tooltip>
        </div>
      </div>
      <USlideover v-model:open="open" title="Settings" description="Customize your payslip appearance" :overlay="false">
        <template #body>
          <div class="space-y-6 no-print">
            <!-- Theme Colors Section -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <UIcon name="i-lucide-palette" class="size-4 text-slate-500" />
                <h4 class="text-sm font-semibold text-slate-700 uppercase tracking-wider">Theme Colors</h4>
              </div>
              <div class="grid grid-cols-3 gap-3">
                <div class="setting-card">
                  <label class="block cursor-pointer rounded-xl overflow-hidden w-full h-10 ring-1 ring-slate-200 hover:ring-blue-400 transition-all">
                    <input
                      v-model="setting.primaryColor"
                      type="color"
                      class="w-full h-12 scale-110 -mt-1 cursor-pointer"
                    >
                  </label>
                  <span class="setting-label">Primary</span>
                </div>
                <div class="setting-card">
                  <label class="block cursor-pointer rounded-xl overflow-hidden w-full h-10 ring-1 ring-slate-200 hover:ring-blue-400 transition-all">
                    <input
                      v-model="setting.secondaryColor"
                      type="color"
                      class="w-full h-12 scale-110 -mt-1 cursor-pointer"
                    >
                  </label>
                  <span class="setting-label">Secondary</span>
                </div>
                <div class="setting-card">
                  <label class="block cursor-pointer rounded-xl overflow-hidden w-full h-10 ring-1 ring-slate-200 hover:ring-blue-400 transition-all">
                    <input
                      v-model="setting.border"
                      type="color"
                      class="w-full h-12 scale-110 -mt-1 cursor-pointer"
                    >
                  </label>
                  <span class="setting-label">Border</span>
                </div>
              </div>
            </div>

            <hr class="border-slate-100">

            <!-- Typography Section -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <UIcon name="i-lucide-type" class="size-4 text-slate-500" />
                <h4 class="text-sm font-semibold text-slate-700 uppercase tracking-wider">Typography</h4>
              </div>
              <UFormField label="Font Family">
                <USelect
                  v-model="setting.fontFamily"
                  value-key="id"
                  :items="fonts"
                  class="w-full"
                />
              </UFormField>
            </div>

            <hr class="border-slate-100">

            <!-- Currency Section -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <UIcon name="i-lucide-circle-dollar-sign" class="size-4 text-slate-500" />
                <h4 class="text-sm font-semibold text-slate-700 uppercase tracking-wider">Currency</h4>
              </div>
              <UFormField label="Currency Symbol">
                <USelect
                  v-model="setting.currency"
                  value-key="id"
                  :items="currencys"
                  class="w-full"
                />
              </UFormField>
            </div>

            <hr class="border-slate-100">

            <!-- Appearance Section -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <UIcon name="i-lucide-moon" class="size-4 text-slate-500" />
                <h4 class="text-sm font-semibold text-slate-700 uppercase tracking-wider">Appearance</h4>
              </div>
              <button
                class="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer"
                @click="isDark = !isDark"
              >
                <div class="flex items-center gap-3">
                  <ClientOnly>
                    <UIcon
                      :name="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
                      class="size-5 text-slate-600"
                    />
                    <template #fallback>
                      <UIcon name="i-lucide-moon" class="size-5 text-slate-600" />
                    </template>
                  </ClientOnly>
                  <ClientOnly>
                    <span class="text-sm font-medium text-slate-700">{{ isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</span>
                    <template #fallback>
                      <span class="text-sm font-medium text-slate-700">Switch to Dark Mode</span>
                    </template>
                  </ClientOnly>
                </div>
                <ClientOnly>
                  <div class="size-5 rounded-full" :class="isDark ? 'bg-slate-700' : 'bg-amber-400'" />
                  <template #fallback>
                    <div class="size-5 rounded-full bg-amber-400" />
                  </template>
                </ClientOnly>
              </button>
            </div>

            <hr class="border-slate-100">

            <!-- Quick Actions Section -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <UIcon name="i-lucide-zap" class="size-4 text-slate-500" />
                <h4 class="text-sm font-semibold text-slate-700 uppercase tracking-wider">Quick Actions</h4>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <button
                  class="flex items-center gap-2 px-4 py-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer"
                  @click="print(); open = false"
                >
                  <UIcon name="i-lucide-printer" class="size-4 text-blue-600" />
                  <span class="text-sm font-medium text-slate-700">Print / Save PDF</span>
                </button>
                <button
                  class="flex items-center gap-2 px-4 py-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer"
                  @click="info.showInfo = true; open = false"
                >
                  <UIcon name="i-lucide-help-circle" class="size-4 text-blue-600" />
                  <span class="text-sm font-medium text-slate-700">Help Guide</span>
                </button>
                <button
                  class="flex items-center gap-2 px-4 py-3 rounded-lg border border-slate-200 hover:border-green-300 hover:bg-green-50/50 transition-all cursor-pointer"
                  @click="exportData"
                >
                  <UIcon name="i-lucide-download" class="size-4 text-green-600" />
                  <span class="text-sm font-medium text-slate-700">Export JSON</span>
                </button>
                <button
                  class="flex items-center gap-2 px-4 py-3 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all cursor-pointer"
                  @click="importData"
                >
                  <UIcon name="i-lucide-upload" class="size-4 text-amber-600" />
                  <span class="text-sm font-medium text-slate-700">Import JSON</span>
                </button>
                <button
                  class="flex items-center gap-2 px-4 py-3 rounded-lg border border-slate-200 hover:border-red-300 hover:bg-red-50/50 transition-all cursor-pointer"
                  @click="confirmReset"
                >
                  <UIcon name="i-lucide-rotate-ccw" class="size-4 text-red-500" />
                  <span class="text-sm font-medium text-slate-700">Reset Data</span>
                </button>
              </div>
            </div>
          </div>
        </template>
      </USlideover>
    </div>
  </div>
</template>

<style scoped>
.fab-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.fab-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.setting-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.setting-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
}
</style>
