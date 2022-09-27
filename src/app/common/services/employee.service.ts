import {Injectable} from '@angular/core';
import {getTImeDiffByHours} from '../helpers';
import {HttpClient} from '@angular/common/http';
import {Employee, EmployeeShift} from '../interfaces';
import {delay, map, Observable, switchMap, tap} from 'rxjs';

interface JoinedEmployeeData {
  employees: Employee[];
  shifts: EmployeeShift[];
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(
    private http: HttpClient
  ) {
  }

  public getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>('assets/data/employees.json')
      .pipe(
        delay(300),
        switchMap((employees: Employee[]) =>
          this.getEmployeesShifts().pipe(map((shifts: EmployeeShift[]) => ({shifts, employees})))
        ),
        map((joinedEmployeeData: JoinedEmployeeData) => this.joinShiftsToEmployees(joinedEmployeeData)),
        tap((employees: Employee[]) => this.setTotalInfoToEmployee(employees))
      );
  }

  public getEmployeesShifts(): Observable<EmployeeShift[]> {
    return this.http.get<EmployeeShift[]>('assets/data/employee-shifts.json')
      .pipe(delay(500));
  }

  private joinShiftsToEmployees(joinedEmployeeData: JoinedEmployeeData): Employee[] {
    const employees = joinedEmployeeData.employees;
    const shifts = joinedEmployeeData.shifts;

    return employees.map((employee: Employee) => {
      employee.shifts = shifts.filter((shift: EmployeeShift) => shift.employeeId === employee.id);
      return employee;
    });
  }

  public setTotalInfoToEmployee(employees: Employee[]): void {
    employees.forEach((employee: Employee) => {
      const total = this.getTotalAndOverTimeHoursPrices(employee.shifts, employee.hourlyRate, employee.overtimeRate);
      employee.total = {
        totalWorkedTime: this.getShiftsTImeTotalHours(employee.shifts),
        totalOverTimePaid: total.totalOvertimePrice,
        totalPaidRate: total.totalPrice
      };
    });
  }

  private getShiftsTImeTotalHours(shifts: EmployeeShift[]): number {
    let totalHours = 0;
    shifts.forEach((shift: EmployeeShift) => totalHours += getTImeDiffByHours(shift.clockIn, shift.clockOut));
    return totalHours;
  }

  private getTotalAndOverTimeHoursPrices(shifts: EmployeeShift[], hourlyPrice: number, overtimeHourlyPrice: number) {
    let totalPrice = 0;
    let totalOvertimePrice = 0;

    let totalWorkedHours = 0;
    let totalOvertimeHours = 0;

    shifts.forEach((shift: EmployeeShift) => {
      const hours = getTImeDiffByHours(shift.clockIn, shift.clockOut);

      totalWorkedHours += hours;

      if (hours > 8) {
        totalOvertimeHours += (hours - 8);
      }
    });

    totalPrice = hourlyPrice * (totalWorkedHours - totalOvertimeHours);
    totalOvertimePrice = overtimeHourlyPrice * totalOvertimeHours;

    return {totalPrice, totalOvertimePrice};
  }

}
