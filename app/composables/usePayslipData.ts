import { useState } from "nuxt/app";

const formatDate = (d: Date): string => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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

export const usePayslipData = () => {
  return useState("payslipData", () => ({
    company: {
      logo: "./palmy.png",
      name: "Palmy Incorporated",
      address:
        "300 Lenora Street, Suite #6135, Seattle\nWA 98121, USA\nadmin@palmy.io",
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
      name: "Mamunur Rashid, Software Engineer",
      address:
        "Borshijura, Moulvibazar Sadar - 3200\nSylhet, Bangladesh\n+880 1723 920 167",
    },
    bank: {
      title: "Bank Details",
      info: "Bank Name: BRAC Bank PLC\nAccount Holder: MD. MAMUNUR RASHID \nAccount No: 1074946110001\nBranch: Moulvibazar",
      data: [
        {
          label: "Bank Name",
          value: "BRAC Bank PLC",
        },
        {
          label: "Account Holder",
          value: "MD. MAMUNUR RASHID",
        },
        {
          label: "Account No",
          value: "1074946110001",
        },
        {
          label: "Branch",
          value: "Moulvibazar",
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
      { name: "Base Salary (Bi-Weekly)", value: 1750 },
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
      { name: "Late Entries", value: 0 },
      { name: "Unpaid Leaves", value: 0 },
      { name: "Income Tax", value: 0 },
    ],
    note: {
      title: "Notes",
      content:
        "- Base Salary: USD 3,500 per month, paid bi-weekly at USD 1,750.\n- Employee is responsible for all applicable local and national taxes.\n- Bonus: USD 300 has been paid as a separate transaction.",
    },
    issuedBy: {
      title: "Issued By",
      name: "Cole Plouck, CEO",
      email: "cole@palmy.io",
    },
    footer:
      "This payslip is electronically generated and is valid without a physical signature or company seal.\nThis document contains confidential information and is intended solely for the employee named herein.",
  }));
};

export const useSetting = () => {
  return useState("setting", () => ({
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
