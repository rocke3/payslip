
export interface EarningItem {
  name: string;
  hours?: number | string;
  value: number;
}

export interface PayslipData {
  companyName: string;
  companyAddress: string[];
  companyEmail: string;
  payslipTitle: string;
  issueDate: string;
  payDate: string;
  employee: {
    name: string;
    address: string[];
    phone: string;
    bankAccount: string;
  };
  payPeriod: {
    startDate: string;
    endDate: string;
  };
  earnings: EarningItem[];
  notes: string[];
  issuedBy: {
    name: string;
    title: string;
    company: string;
    email: string;
  };
}
