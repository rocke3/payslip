<script setup lang="ts">
import { useHead } from "nuxt/app";
import {
  usePayslipData,
  useSetting,
  useInfo,
} from "../composables/usePayslipData";
import { computed } from "vue";
const data = usePayslipData();
const setting = useSetting();
const title = computed(() => {
  const period = data.value?.payslip?.period;
  if (!period) return "Payslip";

  const months: Record<string, string> = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
    Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
  };
  const [startDay, startMonth, year] = period.start.split(" ");
  const [endDay, endMonth] = period.end.split(" ");
  const yy = year.slice(-2);
  const mm = months[startMonth] || "01";
  const half = parseInt(startDay, 10) === 1 ? "1" : "2";

  return `Payslip ${yy}${mm}${half} (${startDay.padStart(2, "0")} ${startMonth} - ${endDay} ${endMonth}, ${year})`;
});

useHead(() => ({ title: title.value }));

const addEarningRow = () => {
  data.value.earnings.push({ name: "New Earning", hours: 0, value: 0 });
};

const removeEarningRow = (index: number) => {
  if (index >= 0 && index < data.value.earnings.length) {
    data.value.earnings.splice(index, 1);
  }
};

const addDeductionRow = () => {
  data.value.deductions.push({ name: "New Deduction", value: 0 });
};

const removeDeductionRow = (index: number) => {
  if (index >= 0 && index < data.value.deductions.length) {
    data.value.deductions.splice(index, 1);
  }
};

const earning = computed(() => {
  return data.value.earnings.reduce(
    (acc, item) => acc + Number(item.value || 0),
    0
  );
});

const deduction = computed(() => {
  return data.value.deductions.reduce(
    (acc, item) => acc + Number(item.value || 0),
    0
  );
});

const netPay = computed(() => {
  return earning.value - deduction.value;
});

const cssVars = computed(() => ({
  "--theme-primary": setting.value.primaryColor,
  "--theme-secondary": setting.value.secondaryColor,
  "--theme-border": setting.value.border,
}));

const formatCurrency = (amount: number) => {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${setting.value.currency} ${formatted}`;
};
const info = useInfo();

const toISODate = (dateStr: string): string => {
  const months: Record<string, string> = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
    Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
  };
  const parts = dateStr.trim().split(" ");
  if (parts.length !== 3) return "";
  const [day, month, year] = parts;
  return `${year}-${months[month] || "01"}-${day.padStart(2, "0")}`;
};

const fromISODate = (isoStr: string): string => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [year, month, day] = isoStr.split("-");
  return `${String(parseInt(day, 10)).padStart(2, "0")} ${months[parseInt(month, 10) - 1]} ${year}`;
};

const updatePayPeriod = (isoDate: string) => {
  const [yearStr, monthStr, dayStr] = isoDate.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // 0-indexed
  const day = parseInt(dayStr, 10);

  if (day >= 1 && day <= 14) {
    const lastMonth = month === 0 ? 11 : month - 1;
    const lastMonthYear = month === 0 ? year - 1 : year;
    const lastDay = new Date(lastMonthYear, lastMonth + 1, 0).getDate();
    data.value.payslip.period.start = fromISODate(`${lastMonthYear}-${String(lastMonth + 1).padStart(2, "0")}-15`);
    data.value.payslip.period.end = fromISODate(`${lastMonthYear}-${String(lastMonth + 1).padStart(2, "0")}-${lastDay}`);
  } else {
    data.value.payslip.period.start = fromISODate(`${year}-${String(month + 1).padStart(2, "0")}-01`);
    data.value.payslip.period.end = fromISODate(`${year}-${String(month + 1).padStart(2, "0")}-15`);
  }
};

const onPayDateChange = (e: Event) => {
  const val = (e.target as HTMLInputElement).value;
  if (val) {
    data.value.payslip.pay.date = fromISODate(val);
    updatePayPeriod(val);
  }
};

const onPeriodStartChange = (e: Event) => {
  const val = (e.target as HTMLInputElement).value;
  if (val) data.value.payslip.period.start = fromISODate(val);
};

const onPeriodEndChange = (e: Event) => {
  const val = (e.target as HTMLInputElement).value;
  if (val) data.value.payslip.period.end = fromISODate(val);
};
</script>

<template>
  <div class="text-slate-600">
    <div :class="setting.fontFamily">
      {{ title }}
      <Transition name="help-slide">
        <div v-if="info.showInfo" class="no-print fixed top-0 left-0 z-50 w-full p-3">
          <div
            class="max-w-3xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div class="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-lightbulb" class="size-5 text-blue-500" />
                <span class="font-semibold text-slate-700 text-sm tracking-wide">Quick Guide</span>
              </div>
              <button class="cursor-pointer rounded-lg p-1.5 hover:bg-slate-200 transition-colors"
                @click="info.showInfo = false">
                <UIcon name="i-lucide-x" class="size-4 text-slate-400" />
              </button>
            </div>
            <div class="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="flex items-start gap-3">
                <UIcon name="i-lucide-mouse-pointer-click" class="size-4 text-blue-500 mt-0.5 shrink-0" />
                <p class="text-sm text-slate-600">Click on any text to <strong class="text-slate-700">edit it
                    directly</strong></p>
              </div>
              <div class="flex items-start gap-3">
                <UIcon name="i-lucide-palette" class="size-4 text-blue-500 mt-0.5 shrink-0" />
                <p class="text-sm text-slate-600">Use the <strong class="text-slate-700">color pickers</strong> or
                  <strong class="text-slate-700">settings</strong> icon to change theme</p>
              </div>
              <div class="flex items-start gap-3">
                <UIcon name="i-lucide-type" class="size-4 text-blue-500 mt-0.5 shrink-0" />
                <p class="text-sm text-slate-600">Change <strong class="text-slate-700">font</strong> or <strong
                    class="text-slate-700">currency</strong> from settings</p>
              </div>
              <div class="flex items-start gap-3">
                <UIcon name="i-lucide-printer" class="size-4 text-blue-500 mt-0.5 shrink-0" />
                <p class="text-sm text-slate-600">Click the <strong class="text-slate-700">print</strong> icon to print
                  or download as PDF</p>
              </div>
              <div
                class="flex items-start gap-3 sm:col-span-2 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
                <UIcon name="i-lucide-info" class="size-4 text-amber-500 mt-0.5 shrink-0" />
                <p class="text-sm text-amber-700">For best print results, set page margins to <strong>None</strong> in
                  your browser's print settings</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      <div class="no-print">
        <Settings />
      </div>
      <div id="print-area" :style="cssVars">
        <div>
          <header class="flex justify-between items-start p-8 pb-6 border-b theme-border section mb-8">
            <div>
              <Editable v-model="data.company.name" as="h1" class="text-3xl font-bold text-slate-700 mb-2" />
              <div class="leading-5">
                <Editable v-model="data.company.address" as="div" class="whitespace-pre-wrap" />
              </div>
            </div>
            <div class="text-right relative text-slate-500">
              <div class="cursor-pointer group mb-2">
                <ClientOnly>
                  <ImageCropper v-model="data.company.logo" />
                </ClientOnly>
              </div>
              <Editable v-model="data.payslip.title" as="h2"
                class="text-3xl font-semibold tracking-widest uppercase mb-1" />
              <Editable v-model="data.payslip.pay.date" class="font-semibold absolute -bottom-6 right-0" />
            </div>
          </header>
          <main class="section">
            <div
              class="bg-secondary rounded-xl p-2 ps-4 flex flex-row justify-between items-center border theme-border mb-8">
              <div class="w-40">
                <div class="text-slate-500 mb-1 font-semibold">
                  <Editable v-model="data.payslip.pay.title" />
                </div>
                <div class="text-lg font-medium text-slate-800 flex items-center gap-1">
                  <Editable v-model="data.payslip.pay.date" class="text-lg font-medium text-slate-800" />
                  <input type="date" :value="toISODate(data.payslip.pay.date)" class="no-print date-picker"
                    @input="onPayDateChange">
                </div>
              </div>
              <div class="w-72">
                <div class="text-slate-500 font-semibold">
                  <Editable v-model="data.payslip.period.title" />
                </div>
                <div class="text-lg font-medium text-slate-800 flex items-center gap-1">
                  <Editable v-model="data.payslip.period.start" class="text-lg font-medium" />
                  <input type="date" :value="toISODate(data.payslip.period.start)" class="no-print date-picker"
                    @input="onPeriodStartChange">
                  <span class="mx-1">-</span>
                  <Editable v-model="data.payslip.period.end" class="inline-block" />
                  <input type="date" :value="toISODate(data.payslip.period.end)" class="no-print date-picker"
                    @input="onPeriodEndChange">
                </div>
              </div>

              <div id="netPay" class="bg-primary text-white rounded-lg px-6 pt-3 pb-3 transition-colors font-semibold">
                <Editable v-model="data.payslip.net.title" />
                <div class="text-lg font-bold">
                  {{ formatCurrency(netPay) }}
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-8 align-top mb-8">
              <div>
                <Editable v-model="data.employee.title" as="h3"
                  class="font-bold uppercase tracking-wider border-b pb-1 mb-1 theme-border" />
                <div>
                  <Editable v-model="data.employee.name" class="font-semibold" />
                  <Editable v-model="data.employee.address" as="div" class="whitespace-pre-wrap" />
                </div>
              </div>
              <div>
                <Editable v-model="data.bank.title" as="h3"
                  class="font-bold uppercase tracking-wider border-b pb-1 mb-1 theme-border" />
                <div v-for="(item, index) in data.bank.data" :key="index" class="flex">
                  <Editable :model-value="item.label" class="font-semibold text-slate-600/90" />:
                  <Editable :model-value="item.value" class="ms-2" />
                </div>
              </div>
            </div>

            <div class="mb-8 grid grid-cols-12 gap-8 align-top">
              <div class="col-span-7">
                <Editable v-model="data.earning.title" as="h3" class="font-bold uppercase tracking-wider mb-2" />
                <div class="overflow-x-auto border theme-border rounded-lg">
                  <table class="w-full text-sm text-left">
                    <thead class="text-sm uppercase bg-secondary">
                      <tr>
                        <th class="tblCol">
                          <Editable v-model="data.earning.col1" />
                        </th>
                        <th class="tblCol text-right">
                          <Editable v-model="data.earning.col2" />
                        </th>
                        <th class="tblCol text-right">
                          <Editable v-model="data.earning.col3" />
                        </th>
                        <th class="w-10 px-1 py-3 text-right no-print"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in data.earnings" :key="index"
                        class="bg-white border-b last:border-b-0 hover:bg-slate-50 group theme-border">
                        <td class="tblCol">
                          <Editable v-model="item.name" class="font-medium whitespace-nowrap w-full" />
                        </td>
                        <td class="tblCol">
                          <Editable v-model="item.hours" type="number" class="w-full text-right" />
                        </td>
                        <td class="tblCol text-right">
                          <Editable v-model="item.value" type="number" class="w-full text-right" />
                        </td>
                        <td class="tblCol text-right no-print">
                          <UButton variant="ghost" icon="heroicons-solid:trash" size="lg"
                            class="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer dark:text-slate-100"
                            @click="removeEarningRow(index)" />
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr class="font-semibold text-slate-700 bg-secondary">
                        <th scope="row" class="tblCol text-base">
                          <Editable v-model="data.earning.total" />
                        </th>
                        <td colspan="2" class="tblCol text-base text-right">
                          {{ formatCurrency(earning) }}
                        </td>
                        <td class="no-print"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div class="no-print text-end mt-2">
                  <UButton color="primary" icon="heroicons-solid:plus" label="Add Earning Row"
                    class="cursor-pointer dark:text-slate-100" @click="addEarningRow" />
                </div>
              </div>
              <div class="col-span-5">
                <Editable v-model="data.deduction.title" as="h3" class="font-bold uppercase tracking-wider mb-2" />
                <div class="overflow-x-auto border theme-border rounded-lg">
                  <table class="w-full text-sm text-left">
                    <thead class="text-sm uppercase bg-secondary">
                      <tr>
                        <th class="tblCol">
                          <Editable v-model="data.deduction.col1" />
                        </th>
                        <th class="tblCol text-right">
                          <Editable v-model="data.deduction.col2" />
                        </th>
                        <th class="w-10 px-1 py-3 text-right no-print"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in data.deductions" :key="index"
                        class="bg-white border-b last:border-b-0 hover:bg-slate-50 group theme-border">
                        <td class="tblCol">
                          <Editable v-model="item.name" class="font-medium whitespace-nowrap w-full" />
                        </td>
                        <td class="tblCol text-right">
                          <Editable v-model="item.value" type="number" class="w-full text-right" />
                        </td>
                        <td class="tblCol text-right no-print">
                          <UButton variant="ghost" icon="heroicons-solid:trash" size="lg"
                            class="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer dark:text-slate-100"
                            @click="removeDeductionRow(index)" />
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr class="font-semibold text-slate-700 bg-secondary">
                        <th scope="row" class="tblCol text-base">
                          <Editable v-model="data.deduction.total" />
                        </th>
                        <td colspan="2" class="tblCol text-base text-right">
                          {{ formatCurrency(deduction) }}
                        </td>
                        <td class="no-print"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div class="no-print text-end mt-2">
                  <UButton color="primary" icon="heroicons-solid:plus" label="Add Deduction Row"
                    class="cursor-pointer dark:text-slate-100" @click="addDeductionRow" />
                </div>
              </div>
            </div>

            <div class="mb-10 flex gap-12">
              <div class="min-w-[60%]">
                <Editable v-model="data.note.title" as="h3"
                  class="font-bold uppercase tracking-wider border-b pb-1 mb-1 theme-border" />
                <Editable v-model="data.note.content" as="div" class="text-sm whitespace-pre-wrap" />
              </div>
              <div class="min-w-48">
                <Editable v-model="data.issuedBy.title" as="h3"
                  class="font-bold uppercase tracking-wider border-b pb-1 mb-1 theme-border" />
                <div class="text-sm">
                  <div class="font-semibold text-base">
                    <Editable v-model="data.issuedBy.name" as="span" />
                  </div>
                  <p>{{ data.company.name }}</p>
                  <Editable v-model="data.issuedBy.email" />
                </div>
              </div>
            </div>
          </main>
          <footer class="section bg-secondary">
            <div class="text-center py-6 text-slate-500 text-sm">
              <Editable v-model="data.footer" as="div" class="mt-1 whitespace-pre-wrap" />
            </div>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.fontFamily {
  font-family: var(--font-family);
}

.fontRoboto {
  font-family: "Roboto", sans-serif;
}

.fontOpenSans {
  font-family: "Open Sans", sans-serif;
}

.fontPoppins {
  font-family: "Poppins", sans-serif;
}

.fontInter {
  font-family: "Inter", sans-serif;
}

.fontLato {
  font-family: "Lato", sans-serif;
}

.fontSpectral {
  font-family: "Spectral", serif;
}

.fontMerriweather {
  font-family: "Merriweather", serif;
}

.editable-field:hover {
  background-color: rgba(246, 255, 198, 0.5);
  outline: 1px solid rgba(241, 245, 249, 0.5);
}

.editable-field:focus {
  background-color: rgba(254, 249, 195, 0.5);
  outline: 1px solid rgba(250, 204, 21, 0.5);
}

.bg-primary {
  background-color: var(--theme-primary);
}

.text-primary {
  color: var(--theme-primary);
}

.bg-secondary {
  background-color: var(--theme-secondary);
}

.text-secondary {
  color: var(--theme-secondary);
}

.theme-border {
  border-color: var(--theme-border);
}

.hover:bg-primary-dark:hover {
  filter: brightness(0.9);
}

.help-slide-enter-active,
.help-slide-leave-active {
  transition: all 0.3s ease;
}

.help-slide-enter-from,
.help-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

.date-picker {
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: transparent;
  flex-shrink: 0;
}

.date-picker::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.4;
}

.date-picker::-webkit-calendar-picker-indicator:hover {
  opacity: 0.8;
}

#print-area {
  max-width: 850px;
  margin: 20px auto;
  border: 1px solid #ccc;
  overflow: hidden;
  box-shadow: 0 0 0px rgba(118, 118, 118, 0.1);
  background-color: #fff;
  border-radius: 20px;
}

.tblCol {
  padding: 0.5rem;
}

.section {
  padding-left: 45px;
  padding-right: 45px;
}

@media print {
  .section {
    padding-left: 45px;
    padding-right: 45px;
  }

  .tblCol {
    padding: 0.7rem 0.6rem;
  }

  .no-print {
    display: none !important;
  }

  #print-area {
    max-width: 100% !important;
    border: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    background-color: #fff !important;
  }

  @page {
    size: A4;
    margin: 0;
  }

  body {
    margin: 0;
  }

  footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
