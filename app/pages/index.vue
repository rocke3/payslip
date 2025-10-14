<script setup lang="ts">
import { ref, reactive, computed } from "vue";

interface Earning {
  name: string;
  hours?: number;
  value: number;
}

const data = reactive({
  company: {
    logo: "",
    name: "Enter Company Name",
    address: "Enter Company Address",
    email: "Enter Company Email",
  },
  payslip: {
    title: "Payslip",
    date: "Enter Issue Date",
    pay: {
      title: "Pay Date",
      date: "Enter Pay Date",
    },
    period: {
      title: "Pay Period",
      start: "Enter Start Date",
      end: "Enter End Date",
    },
    net: {
      title: "Net Pay",
    },
  },
  employee: {
    title: "Employee Information",
    name: "Enter Employee Name",
    address: "Enter Employee Address",
    phone: "+880 1723 xxx xxx",
  },
  bank: {
    title: "Bank Details",
    name: "Enter Bank Name",
    account: "Enter Bank Account Number",
  },
  earning: {
    title: "Earnings Breakdown",
    col1: "Earnings",
    col2: "Hours",
    col3: "Amount",
    total: "Total Earnings",
  },
  earnings: <Earning[]>[
    { name: "Base Salary", value: 1750 },
    { name: "On-Call Weekends", hours: 0, value: 0 },
    { name: "Over Time", hours: 0, value: 0 },
    { name: "Bug Warranty", hours: 0, value: 0 },
    { name: "Bonus", value: 0 },
  ],
  note: {
    title: "Note",
    content: "Base Salary: $3,500 (USD) per month, paid bi-weekly at $1,750.",
  },
  issuedBy: {
    title: "Issued By",
    name: "Enter Issued By",
    email: "Enter Email",
  },
  footer: {
    title:
      "This is an electronically generated Payslip. No signature or stamp is required.",
    copyRight: "Copyright © 2025",
  },
});

const addEarningRow = () => {
  data.earnings.push({ name: "New Earning", hours: 0, value: 0 });
};

const removeEarningRow = (index: number) => {
  if (index >= 0 && index < data.earnings.length) {
    data.earnings.splice(index, 1);
  }
};
const primaryColor = ref("#2563eb");
const secondaryColor = ref("#f9f3f4");
const border = ref("#f9f3f4");

const totalEarnings = computed(() => {
  return data.earnings.reduce((acc, item) => acc + Number(item.value || 0), 0);
});

const cssVars = computed(() => ({
  "--theme-primary": primaryColor.value,
  "--theme-secondary": secondaryColor.value,
  "--theme-border": border.value,
}));

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount
  );

const open = ref(false);
defineShortcuts({ o: () => (open.value = !open.value) });
const print = () => {
  window.print();
};
</script>

<template>
  <div>
    <div class="no-print">
      <div class="flex flex-col gap-2 fixed bottom-5 right-5">
        <div
          class="block size-12 rounded-lg overflow-hidden cursor-pointer hover:scale-110 transition-all duration-200 border border-purple-400 shadow-xl"
        >
          <Tooltip text="Primary Color">
            <input
              type="color"
              v-model="primaryColor"
              class="size-14 scale-110 -mt-1 -ml-1"
            />
          </Tooltip>
        </div>
        <div
          class="block size-12 rounded-lg overflow-hidden cursor-pointer hover:scale-110 transition-all duration-200 border border-purple-400 shadow-xl"
        >
          <Tooltip text="Secondary Color">
            <input
              type="color"
              v-model="secondaryColor"
              class="size-14 scale-110 -mt-1 -ml-1"
            />
          </Tooltip>
        </div>
        <div
          class="block size-12 rounded-lg overflow-hidden cursor-pointer hover:scale-110 transition-all duration-200 border border-purple-400 shadow-xl"
        >
          <Tooltip text="Border Color">
            <input
              type="color"
              v-model="border"
              class="size-14 scale-110 -mt-1 -ml-1"
            />
          </Tooltip>
        </div>

        <div
          @click="print"
          class="size-12 shadow-xl z-10 rounded-lg hover:scale-110 cursor-pointer transition-all duration-200 bg-purple-400 p-2"
        >
          <UIcon name="i-lucide-printer" class="size-8 text-white" />
        </div>

        <div
          @click="open = true"
          class="size-12 shadow-xl z-10 rounded-lg hover:scale-110 cursor-pointer transition-all duration-200 bg-purple-400 p-2"
        >
          <UIcon name="i-lucide-settings" class="size-8 text-white" />
        </div>
      </div>
      <USlideover v-model:open="open" title="Settings" :overlay="false">
        <template #body>
          <div class="flex justify-between items-center gap-4 no-print">
            <UFormField label="Primary Color">
              <label
                for="primaryColor"
                class="block cursor-pointer rounded-xl border overflow-hidden w-20 h-8 m-auto"
              >
                <input
                  type="color"
                  v-model="primaryColor"
                  class="w-20 h-10 scale-110 -mt-1"
                />
              </label>
            </UFormField>
            <UFormField label="Secondary Color">
              <label
                for="secondaryColor"
                class="block cursor-pointer rounded-xl border overflow-hidden w-20 h-8 m-auto"
              >
                <input
                  type="color"
                  v-model="secondaryColor"
                  class="w-20 h-10 scale-110 -mt-1"
                />
              </label>
            </UFormField>
            <UFormField label="Border Color">
              <label
                for="borderColor"
                class="block cursor-pointer rounded-xl border overflow-hidden w-20 h-8 m-auto"
              >
                <input
                  type="color"
                  v-model="border"
                  class="w-20 h-10 scale-110 -mt-1"
                />
              </label>
            </UFormField>
          </div>
          <div class="space-y-2 mt-3">
            <UFormField label="Company Name">
              <UInput v-model="data.company.name" class="w-full" />
            </UFormField>
            <UFormField label="Company Address">
              <UInput v-model="data.company.address" class="w-full" />
            </UFormField>
            <UFormField label="Company Email">
              <UInput v-model="data.company.email" class="w-full" />
            </UFormField>
            <UFormField label="Payslip Title">
              <UInput v-model="data.payslip.title" class="w-full" />
            </UFormField>
            <UFormField label="Issue Date">
              <UInput v-model="data.payslip.date" class="w-full" />
            </UFormField>
            <UFormField label="Pay Date">
              <UInput v-model="data.payslip.pay.date" class="w-full" />
            </UFormField>
            <UFormField label="Pay Period Start">
              <UInput v-model="data.payslip.period.start" class="w-full" />
            </UFormField>
            <UFormField label="Pay Period End">
              <UInput v-model="data.payslip.period.end" class="w-full" />
            </UFormField>
            <UFormField label="Employee Name">
              <UInput v-model="data.employee.name" class="w-full" />
            </UFormField>
            <UFormField label="Employee Address">
              <UInput v-model="data.employee.address" class="w-full" />
            </UFormField>
            <UFormField label="Employee Phone">
              <UInput v-model="data.employee.phone" class="w-full" />
            </UFormField>
            <UFormField label="Employee Bank Name">
              <UInput v-model="data.bank.name" class="w-full" />
            </UFormField>
            <UFormField label="Employee Bank Account">
              <UInput v-model="data.bank.account" class="w-full" />
            </UFormField>
            <UFormField label="Note Content">
              <UInput v-model="data.note.content" class="w-full" />
            </UFormField>
            <UFormField label="Issued By Name">
              <UInput v-model="data.issuedBy.name" class="w-full" />
            </UFormField>
            <UFormField label="Issued By Email">
              <UInput v-model="data.issuedBy.email" class="w-full" />
            </UFormField>
            <UFormField label="Footer Title">
              <UInput v-model="data.footer.title" class="w-full" />
            </UFormField>
            <UFormField label="Footer Copyright">
              <UInput v-model="data.footer.copyRight" class="w-full" />
            </UFormField>
          </div>
        </template>
      </USlideover>
    </div>

    <div class="font-roboto" :style="cssVars" id="print-area">
      <div>
        <header
          class="flex justify-between items-start p-8 pb-6 border-b theme-border"
        >
          <div>
            <Editable
              as="h1"
              v-model="data.company.name"
              class="text-3xl font-bold text-slate-800 mb-2"
            />
            <div class="text-slate-600 leading-5">
              <Editable
                as="div"
                v-model="data.company.address"
                class="whitespace-pre-wrap"
              />
              <Editable v-model="data.company.email" />
            </div>
          </div>
          <div class="text-right relative">
            <div class="cursor-pointer group mb-2">
              <ClientOnly>
                <ImageCropper v-model="data.company.logo" />
              </ClientOnly>
            </div>
            <Editable
              as="h2"
              v-model="data.payslip.title"
              class="text-3xl font-semibold text-slate-500 tracking-widest uppercase mb-1"
            />
            <Editable
              v-model="data.payslip.date"
              class="text-slate-500 absolute -bottom-5 right-0"
            />
          </div>
        </header>

        <div
          class="bg-secondary rounded-xl m-6 p-2 ps-4 flex flex-row justify-between items-center border theme-border"
        >
          <div>
            <div class="text-slate-500 mb-1">
              <Editable v-model="data.payslip.pay.title" />
            </div>
            <div class="text-lg font-medium text-slate-800">
              <Editable
                v-model="data.payslip.pay.date"
                class="text-lg font-medium text-slate-800"
              />
            </div>
          </div>
          <div>
            <div class="text-slate-500">
              <Editable v-model="data.payslip.period.title" />
            </div>
            <div
              class="text-lg font-medium text-slate-800 flex items-center gap-2"
            >
              <Editable
                v-model="data.payslip.period.start"
                class="text-lg font-medium text-slate-800"
              />
              -
              <Editable
                v-model="data.payslip.period.end"
                class="inline-block"
              />
            </div>
          </div>

          <div
            class="bg-primary text-white rounded-lg px-6 pt-3 pb-3 transition-colors"
            id="netPay"
          >
            <Editable v-model="data.payslip.net.title" />
            <div class="text-lg font-bold">
              {{ formatCurrency(totalEarnings) }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-8 px-8 align-top">
          <div>
            <Editable
              v-model="data.employee.title"
              as="h3"
              class="font-semibold text-slate-500 uppercase tracking-wider border-b pb-1 mb-1 theme-border rounded-none"
            />
            <div class="text-slate-700 space-y-1">
              <Editable
                v-model="data.employee.name"
                class="font-bold text-slate-800 text-base"
              /><Editable
                as="div"
                v-model="data.employee.address"
                class="whitespace-pre-wrap"
              /><Editable v-model="data.employee.phone" />
            </div>
          </div>
          <div>
            <Editable
              v-model="data.bank.title"
              as="h3"
              class="font-semibold text-slate-500 uppercase tracking-wider border-b pb-1 mb-1 theme-border rounded-none"
            />
            <div class="text-slate-700 space-y-1">
              <Editable
                v-model="data.bank.name"
                as="p"
                class="font-semibold text-slate-800"
              />
              <Editable v-model="data.bank.account" />
            </div>
          </div>
        </div>

        <div class="px-8 mt-8">
          <Editable
            v-model="data.earning.title"
            as="h3"
            class="text-lg font-semibold text-slate-800 mb-4"
          />
          <div class="overflow-x-auto border theme-border rounded-lg">
            <table class="w-full text-sm text-left text-slate-500">
              <thead class="text-sm text-slate-700 uppercase bg-secondary">
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
                <tr
                  v-for="(item, index) in data.earnings"
                  :key="index"
                  class="bg-white border-b last:border-b-0 hover:bg-secondary group theme-border"
                >
                  <td class="tblCol">
                    <Editable
                      v-model="item.name"
                      class="font-medium text-slate-900 whitespace-nowrap w-full"
                    />
                  </td>
                  <td class="tblCol">
                    <Editable
                      v-model="item.hours"
                      type="number"
                      class="w-full text-right"
                    />
                  </td>
                  <td class="tblCol text-right">
                    <Editable
                      v-model="item.value"
                      type="number"
                      class="w-full text-right"
                    />
                  </td>
                  <td class="tblCol text-right no-print">
                    <UButton
                      @click="removeEarningRow(index)"
                      variant="ghost"
                      icon="heroicons-solid:trash"
                      size="lg"
                      class="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    />
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="font-semibold text-slate-900 bg-secondary">
                  <th
                    scope="row"
                    colspan="2"
                    class="tblCol text-base text-right"
                  >
                    <Editable v-model="data.earning.total" />
                  </th>
                  <td class="tblCol text-base text-right">
                    {{ formatCurrency(totalEarnings) }}
                  </td>
                  <td class="no-print"></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div class="no-print text-end mt-2">
            <UButton
              @click="addEarningRow"
              color="primary"
              icon="heroicons-solid:plus"
              label="Add Earning Row"
              class="cursor-pointer"
            />
          </div>
        </div>

        <div class="mt-6 pt-6 px-8 grid grid-cols-5 gap-16">
          <div class="col-span-3">
            <Editable
              v-model="data.note.title"
              as="h3"
              class="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-1 mb-1 theme-border rounded-none"
            />
            <Editable
              v-model="data.note.content"
              as="div"
              class="text-sm whitespace-pre-wrap"
            />
          </div>
          <div class="col-span-2">
            <Editable
              v-model="data.issuedBy.title"
              as="h3"
              class="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-1 mb-1 theme-border rounded-none"
            />
            <div class="text-slate-700 text-sm">
              <div class="font-bold text-slate-800 text-base">
                <Editable as="span" v-model="data.issuedBy.name" />
              </div>
              <p>{{ data.company.name }}</p>
              <Editable v-model="data.issuedBy.email" />
            </div>
          </div>
        </div>

        <footer>
          <div class="text-center py-6 px-8 mt-10 bg-secondary">
            <Editable
              v-model="data.footer.title"
              as="p"
              class="text-sm text-slate-500"
            />
            <Editable
              v-model="data.footer.copyRight"
              as="p"
              class="text-sm text-slate-500 mt-1"
            />
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
@media print {
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
    margin: 20mm;
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
