import {Employee} from './common/interfaces';
import {Component, OnInit} from '@angular/core';
import {EmployeeService} from './common/services';
import {MatDialog} from '@angular/material/dialog';
import {EmployeesInfoComponent} from './components';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import {cloneObject} from './common/helpers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public employees: Employee[] = [];
  public totals = {
    totalWorkedTime: 0,
    paidHours: 0,
    overTImePaidHours: 0
  };

  public displayedColumns = ['select', 'name', 'email', 'totalWorkedTime', 'totalPaidRate', 'totalOverTimePaid'];
  private dataSource = new MatTableDataSource<Employee>(this.employees);
  public selection = new SelectionModel<Employee>(true, []);

  constructor(
    private matDialog: MatDialog,
    private employeeService: EmployeeService
  ) {
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  private getEmployees(): void {
    this.employeeService.getEmployees()
      .subscribe((res: Employee[]) => {
        this.employees = res;
        this.dataSource = new MatTableDataSource<Employee>(this.employees);
        this.setTotals();
      });
    return;
  }

  private setTotals(): void {
    this.employees.forEach((employee: Employee) => {
      this.totals.paidHours += employee.total.totalPaidRate;
      this.totals.overTImePaidHours += employee.total.totalOverTimePaid;
      this.totals.totalWorkedTime += employee.total.totalWorkedTime;
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  public isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  public masterToggle(): void {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  public onEditEmployees(): void {
    const dialogRef = this.matDialog.open(EmployeesInfoComponent, {
      data: {employees: this.selection.selected}
    });

    dialogRef.componentInstance
      .submit$
      .subscribe((res: Employee[]) => {
        this.employees.forEach((employee: Employee, index: number) => {
          res.forEach((item: Employee) => {
            if (item.id === employee.id) {
              this.employees[index] = item;
            }
          });
        });

        this.employeeService.setTotalInfoToEmployee(this.employees);
        this.setTotals();
        this.employees = cloneObject(this.employees);
        this.dataSource = new MatTableDataSource<Employee>(this.employees);
        this.selection.clear();
      });
  }

}
