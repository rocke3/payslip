<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import type { PayslipData } from "~/types/payslip";
import Editable from "~/components/Editable.vue";

// --- INITIAL DATA ---
const initialPayslipData: PayslipData = {
  companyName: "Enter Company Name",
  companyAddress: ["Enter Company Address", "Enter Company Address"],
  companyEmail: "Enter Company Email",
  payslipTitle: "Payslip",
  issueDate: "Enter Issue Date",
  payDate: "Enter Pay Date",
  employee: {
    name: "Enter Employee Name",
    address: ["Enter Employee Address", "Enter Employee Address"],
    phone: "+880 1723 xxx xxx",
    bankAccount: "Enter Bank Account",
  },
  payPeriod: {
    startDate: "Enter Start Date",
    endDate: "Enter End Date",
  },
  earnings: [
    { name: "Base Salary", value: 1750 },
    { name: "On-Call Weekends", hours: 0, value: 0 },
    { name: "Over Time", hours: 0, value: 0 },
    { name: "Bug Warranty", hours: 0, value: 0 },
    { name: "Bonus", value: 0 },
  ],
  notes: [
    "Work schedule: Monday–Friday, 8 hours/day",
    "Base Salary: $3,500 (USD) per month, paid bi-weekly at $1,750.",
  ],
  issuedBy: {
    name: "Enter Issued By",
    title: "Enter Title",
    company: "Enter Company",
    email: "Enter Email",
  },
};

// --- STATE & REFS ---
const data = reactive<PayslipData>(
  JSON.parse(JSON.stringify(initialPayslipData))
);
const logoUrl = ref<string | null>(null);
const themeColor = ref<string>("#2563eb");
const pdfSize = ref<"fit" | "a4" | "letter">("a4");
const payslipRef = ref<HTMLDivElement | null>(null);
const logoUploadRef = ref<HTMLInputElement | null>(null);

// --- COMPUTED PROPERTIES ---
const totalEarnings = computed(() => {
  return data.earnings.reduce((acc, item) => acc + Number(item.value || 0), 0);
});

// Computed property with getter/setter for multi-line text fields
const employeeAddress = computed({
  get: () =>
    Array.isArray(data.employee.address)
      ? data.employee.address.join("\n")
      : String(data.employee.address),
  set: (value) => {
    data.employee.address = value.split("\n");
  },
});
const companyAddress = computed({
  get: () => data.companyAddress.join("\n"),
  set: (value) => {
    data.companyAddress = value.split("\n");
  },
});
const notes = computed({
  get: () => data.notes.join("\n"),
  set: (value) => {
    data.notes = value.split("\n");
  },
});

const cssVars = computed(() => ({
  "--theme-primary": themeColor.value,
  "--theme-primary-light": hexToRgba(themeColor.value, 0.1),
  "--theme-primary-lighter": hexToRgba(themeColor.value, 0.2),
}));

// --- HELPER FUNCTIONS ---
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount
  );
const hexToRgba = (hex: string, alpha: number) => {
  if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) return "";
  let c = hex.substring(1).split("");
  if (c.length === 3) {
    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
  }
  const numerical = parseInt(`0x${c.join("")}`);
  return `rgba(${(numerical >> 16) & 255},${(numerical >> 8) & 255},${
    numerical & 255
  },${alpha})`;
};

// --- HANDLERS ---
const addEarningRow = () =>
  data.earnings.push({ name: "New Earning", hours: 0, value: 0 });
const removeEarningRow = (index: number) => data.earnings.splice(index, 1);
const handleLogoUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files?.[0]) {
    logoUrl.value = URL.createObjectURL(target.files[0]);
  }
};
const triggerLogoUpload = () => logoUploadRef.value?.click();

const handleDownload = () => {
  const payslipElement = payslipRef.value;
  if (!payslipElement || typeof window === "undefined") return;
  const netPayElement = document.getElementById("netPay");
  if (netPayElement) {
    netPayElement.classList.remove("pb-5");
    netPayElement.classList.remove("pt-0");
    netPayElement.classList.add("pb-5");
    netPayElement.classList.add("pt-1");
  }

  const { html2canvas, jspdf } = window as any;

  html2canvas(payslipElement, { scale: 3, useCORS: true }).then(
    (canvas: any) => {
      const imgData = canvas.toDataURL("image/png");
      const { jsPDF } = jspdf;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      let pdf;
      if (pdfSize.value === "fit") {
        pdf = new jsPDF({
          orientation: "p",
          unit: "px",
          format: [canvasWidth, canvasHeight],
        });
        pdf.addImage(imgData, "PNG", 0, 0, canvasWidth, canvasHeight);
      } else {
        pdf = new jsPDF({
          orientation: "p",
          unit: "mm",
          format: pdfSize.value,
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasAspectRatio = canvasWidth / canvasHeight;

        const margin = 10; // 10mm margin
        const availableWidth = pdfWidth - margin * 2;
        const availableHeight = pdfHeight - margin * 2;

        let imgWidth = availableWidth;
        let imgHeight = imgWidth / canvasAspectRatio;

        if (imgHeight > availableHeight) {
          imgHeight = availableHeight;
          imgWidth = imgHeight * canvasAspectRatio;
        }

        const x = (pdfWidth - imgWidth) / 2;
        const y = margin;

        pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
      }
      pdf.save(
        `payslip-${data.employee.name.replace(" ", "-")}-${data.payDate}.pdf`
      );
      if (netPayElement) {
        netPayElement.classList.remove("pb-5");
        netPayElement.classList.remove("pt-0");
        netPayElement.classList.add("pb-3");
        netPayElement.classList.add("pt-3");
      }
    }
  );
};
</script>

<template>
  <div
    class="bg-slate-100 min-h-screen font-sans p-4 sm:p-6 md:p-8"
    :style="cssVars"
  >
    <div
      class="no-print max-w-5xl mx-auto mb-6 p-4 bg-white rounded-xl shadow-md sticky top-4 z-50"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          class="flex items-center justify-center md:justify-start space-x-2"
        >
          <button
            @click="addEarningRow"
            class="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary bg-primary-light rounded-lg hover:bg-primary-lighter transition-colors me-2"
          >
            <svg
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Add Earning Row</span>
          </button>
          Theme :
          <div class="w-16 h-8 rounded overflow-hidden cursor-pointer">
            <input
              class="scale-150 h-full w-full"
              type="color"
              v-model="themeColor"
            />
          </div>
        </div>
        <div class="flex items-center justify-center md:justify-end space-x-2">
          <button
            @click="handleDownload"
            class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-all"
          >
            <svg
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>Download PDF</span>
          </button>
        </div>
      </div>
      <input
        type="file"
        ref="logoUploadRef"
        @change="handleLogoUpload"
        class="hidden"
        accept="image/*"
      />
    </div>
    <div
      class="relative bg-white max-w-5xl mx-auto rounded-2xl shadow-lg overflow-hidden"
      ref="payslipRef"
    >
      <main>
        <div
          class="flex justify-between items-start p-8 md:p-10 border-b border-slate-200"
        >
          <div>
            <Editable
              as="h1"
              v-model="data.companyName"
              class="text-3xl font-bold text-slate-800"
            />
            <div class="mt-2 text-slate-600">
              <Editable
                as="div"
                v-model="companyAddress"
                class="whitespace-pre-wrap"
              />
              <Editable v-model="data.companyEmail" />
            </div>
          </div>
          <div class="text-right">
            <div @click="triggerLogoUpload" class="cursor-pointer group">
              <img
                v-if="logoUrl"
                :src="logoUrl"
                alt="Company Logo"
                class="max-w-32 max-h-20 object-contain mx-auto"
              />
              <div v-else class="flex items-center space-x-3 justify-end">
                <div
                  class="text-slate-500 cursor-pointer border rounded px-6 py-3 bg-slate-100"
                >
                  Upload Logo
                </div>
              </div>
            </div>
            <Editable
              as="h2"
              v-model="data.payslipTitle"
              class="text-3xl font-semibold text-slate-500 tracking-widest mt-3 uppercase"
            />
            <Editable v-model="data.issueDate" class="text-slate-500 mt-1" />
          </div>
        </div>

        <div
          class="bg-slate-50 rounded-xl m-10 p-4 flex flex-row justify-between items-center border"
        >
          <div>
            <div class="text-slate-500">Pay Date</div>
            <Editable
              v-model="data.payDate"
              class="text-xl font-medium text-slate-800"
            />
          </div>
          <div class="my-4 md:my-0">
            <div class="text-slate-500">Pay Period</div>
            <div class="text-xl font-medium text-slate-800">
              <Editable
                v-model="data.payPeriod.startDate"
                class="inline-block"
              />
              -
              <Editable v-model="data.payPeriod.endDate" class="inline-block" />
            </div>
          </div>
          <div
            class="bg-primary text-white rounded-lg px-6 pt-3 pb-3 transition-colors"
            id="netPay"
          >
            <span class="uppercase tracking-wider">Net Pay</span>
            <div class="text-2xl font-bold">
              {{ formatCurrency(totalEarnings) }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-8 px-10 align-top">
          <div>
            <h3
              class="font-semibold text-slate-500 uppercase tracking-wider border-b pb-2 mb-3"
            >
              Employee Information
            </h3>
            <div class="text-slate-700 space-y-1">
              <Editable
                v-model="data.employee.name"
                class="font-bold text-slate-800 text-base"
              /><Editable
                as="div"
                v-model="employeeAddress"
                class="whitespace-pre-wrap"
              /><Editable v-model="data.employee.phone" />
            </div>
          </div>
          <div>
            <h3
              class="font-semibold text-slate-500 uppercase tracking-wider border-b pb-2 mb-3"
            >
              Bank Details
            </h3>
            <div class="text-slate-700 space-y-1">
              <p class="font-semibold text-slate-800">Bank A/C No</p>
              <Editable v-model="data.employee.bankAccount" class="font-mono" />
            </div>
          </div>
        </div>

        <div class="px-8 md:px-10 mt-8">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">
            Earnings Breakdown
          </h3>
          <div class="overflow-x-auto border border-slate-200 rounded-lg">
            <table class="w-full text-sm text-left text-slate-500">
              <thead class="text-sm text-slate-700 uppercase bg-slate-100">
                <tr>
                  <th scope="col" class="px-6 py-3">Earnings</th>
                  <th scope="col" class="px-6 py-3 text-right">Hours</th>
                  <th scope="col" class="px-6 py-3 text-right">Value (USD)</th>
                  <th
                    scope="col"
                    class="w-10 px-1 py-3 text-right no-print"
                  ></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in data.earnings"
                  :key="index"
                  class="bg-white border-b last:border-b-0 hover:bg-slate-50 group"
                >
                  <td class="px-6 py-4">
                    <Editable
                      v-model="item.name"
                      class="font-medium text-slate-900 whitespace-nowrap w-full"
                    />
                  </td>
                  <td class="px-6 py-4 text-right">
                    <Editable
                      v-model="item.hours"
                      type="number"
                      class="w-full text-right"
                    />
                  </td>
                  <td class="px-6 py-4 text-right">
                    <Editable
                      v-model="item.value"
                      type="number"
                      :display-value="item.value.toFixed(2)"
                      class="w-full text-right"
                    />
                  </td>
                  <td class="px-1 py-4 text-right no-print">
                    <button
                      @click="removeEarningRow(index)"
                      class="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        class="w-4 h-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="font-semibold text-slate-900 bg-slate-100">
                  <th
                    scope="row"
                    colspan="2"
                    class="px-6 py-3 text-base text-right"
                  >
                    Total Earnings
                  </th>
                  <td class="px-6 py-3 text-base text-right">
                    {{ formatCurrency(totalEarnings) }}
                  </td>
                  <td class="no-print"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div
          class="mt-16 pt-6 px-8 md:px-10 border-slate-200 grid grid-cols-5 gap-8"
        >
          <div class="col-span-3">
            <h3
              class="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2 mb-3"
            >
              Notes
            </h3>
            <Editable
              v-model="notes"
              as="div"
              class="text-sm whitespace-pre-wrap"
            />
          </div>
          <div class="col-span-2">
            <h3
              class="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2 mb-3"
            >
              Issued By
            </h3>
            <div class="text-slate-700 space-y-1 text-sm">
              <div class="font-bold text-slate-800 text-base">
                <Editable as="span" v-model="data.issuedBy.name" /><span
                  >, </span
                ><Editable as="span" v-model="data.issuedBy.title" />
              </div>
              <Editable v-model="data.issuedBy.company" />
              <Editable v-model="data.issuedBy.email" />
            </div>
          </div>
        </div>
      </main>
      <footer>
        <div class="pt-16">
          <div class="text-center py-6 px-8 md:px-10 mt-16 bg-slate-50">
            <p class="text-sm text-slate-500">
              This is an electronically generated payslip. No signature or stamp
              is required.
            </p>
            <p class="text-sm text-slate-500 mt-1">
              &copy; {{ data.companyName }}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>
