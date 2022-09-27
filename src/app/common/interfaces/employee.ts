export interface Employee {
  id: number;
  name: string;
  email: string;
  hourlyRate: number;
  overtimeRate: number;
  total: EmployeeTotals;
  shifts: EmployeeShift[];
}

export interface EmployeeShift {
  id: number;
  employeeId: number;
  clockIn: string;
  clockOut: string;
}

export interface EmployeeTotals {
  totalPaidRate: number;
  totalWorkedTime: number;
  totalOverTimePaid: number;
}

