import { useState } from "nuxt/app";
import { watch, onMounted } from "vue";

const formatDate = (d: Date): string => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const formatToday = (): string => formatDate(new Date());

const getPayPeriod = (): { start: string; end: string } => {
  const today = new Date();
  const day = today.getDate();
  const year = today.getFullYear();
  const month = today.getMonth();

  if (day >= 1 && day <= 14) {
    // Start: 15th of last month, End: last day of last month
    const lastMonth = month === 0 ? 11 : month - 1;
    const lastMonthYear = month === 0 ? year - 1 : year;
    const lastDayOfLastMonth = new Date(lastMonthYear, lastMonth + 1, 0).getDate();
    return {
      start: formatDate(new Date(lastMonthYear, lastMonth, 15)),
      end: formatDate(new Date(lastMonthYear, lastMonth, lastDayOfLastMonth)),
    };
  } else {
    // Start: 1st of current month, End: 15th of current month
    return {
      start: formatDate(new Date(year, month, 1)),
      end: formatDate(new Date(year, month, 15)),
    };
  }
};

const STORAGE_KEYS = ["payslipData", "setting"] as const;

function usePersistedState<T>(key: string, defaultFn: () => T) {
  const state = useState(key, defaultFn);

  onMounted(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        state.value = JSON.parse(saved) as T;
      } catch {}
    }
    watch(
      state,
      (val) => {
        localStorage.setItem(key, JSON.stringify(val));
      },
      { deep: true },
    );
  });

  return state;
}

export const usePayslipData = () => {
  return usePersistedState("payslipData", () => ({
    company: {
      logo: "./logo.svg",
      name: "Acme Corporation",
      address: "123 Business Avenue, Suite #100\nNew York, NY 10001, USA\nhr@acmecorp.com",
    },
    payslip: {
      title: "PAYSLIP",
      pay: {
        title: "Pay Date",
        date: formatToday(),
      },
      period: {
        title: "Pay Period",
        start: getPayPeriod().start,
        end: getPayPeriod().end,
      },
      net: {
        title: "Net Pay",
      },
    },
    employee: {
      title: "Employee Information",
      name: "John Smith, Software Engineer",
      address: "456 Elm Street, Apt 7B\nBrooklyn, NY 11201, USA\n+1 (555) 123-4567",
    },
    bank: {
      title: "Bank Details",
      info: "Bank Name: First National Bank\nAccount Holder: JOHN SMITH\nAccount No: 9876543210\nBranch: Downtown",
      data: [
        {
          label: "Bank Name",
          value: "First National Bank",
        },
        {
          label: "Account Holder",
          value: "JOHN SMITH",
        },
        {
          label: "Account No",
          value: "9876543210",
        },
        {
          label: "Branch",
          value: "Downtown",
        },
      ],
    },
    earning: {
      title: "Earnings Breakdown",
      col1: "Earnings",
      col2: "Hours",
      col3: "Amount",
      total: "Total Earnings",
    },
    earnings: [
      { name: "Base Salary (Bi-Weekly)", value: 2500 },
      { name: "Over Time", hours: "", value: 0 },
      { name: "Bonus", value: 0 },
    ],
    deduction: {
      title: "Deductions Breakdown",
      col1: "Deductions",
      col2: "Amount",
      total: "Total Deductions",
    },
    deductions: [
      { name: "Health Insurance", value: 150 },
      { name: "Income Tax", value: 375 },
      { name: "Retirement Fund", value: 125 },
    ],
    note: {
      title: "Notes",
      content:
        "- Base Salary: USD 5,000 per month, paid bi-weekly at USD 2,500.\n- Employee is responsible for all applicable local and national taxes.\n- Health insurance premium is deducted at the company-subsidized rate.",
    },
    issuedBy: {
      title: "Issued By",
      name: "Jane Doe, HR Manager",
      email: "jane.doe@acmecorp.com",
    },
    footer:
      "This payslip is electronically generated and is valid without a physical signature or company seal.\nThis document contains confidential information and is intended solely for the employee named herein.",
  }));
};

export const useSetting = () => {
  return usePersistedState("setting", () => ({
    primaryColor: "#2563eb",
    secondaryColor: "#f1f1f1",
    border: "#f2f2f2",
    fontFamily: "fontRoboto",
    currency: "USD",
  }));
};

export const useInfo = () => {
  return useState("info", () => ({
    showInfo: false,
  }));
};

export const resetAllData = () => {
  for (const key of STORAGE_KEYS) {
    localStorage.removeItem(key);
  }
  window.location.reload();
};

export const exportData = () => {
  const data: Record<string, unknown> = {};
  for (const key of STORAGE_KEYS) {
    const val = localStorage.getItem(key);
    if (val) data[key] = JSON.parse(val);
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "payslip-data.json";
  a.click();
  URL.revokeObjectURL(url);
};

export const importData = (): Promise<void> => {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return resolve();
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          for (const key of STORAGE_KEYS) {
            if (data[key]) localStorage.setItem(key, JSON.stringify(data[key]));
          }
          window.location.reload();
        } catch {
          window.alert("Invalid JSON file.");
        }
        resolve();
      };
      reader.readAsText(file);
    };
    input.click();
  });
};
