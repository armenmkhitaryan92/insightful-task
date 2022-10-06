import {cloneObject} from '../../common/helpers';
import {Employee} from '../../common/interfaces';
import {MatDialog} from '@angular/material/dialog';
import {EmployeeService} from '../../common/services';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import {EmployeesInfoComponent} from '../employees-info/employees-info.component';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges} from '@angular/core';

interface Totals {
  totalWorkedTime: number;
  paidHours: number;
  overTImePaidHours: number;
}

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeesListComponent implements OnChanges {

  @Input() public employees: Employee[] = [];
  public totals: Totals = {
    totalWorkedTime: 0,
    paidHours: 0,
    overTImePaidHours: 0
  };

  public displayedColumns = ['select', 'name', 'email', 'totalWorkedTime', 'totalPaidRate', 'totalOverTimePaid'];
  private dataSource = new MatTableDataSource<Employee>(this.employees);
  public selection = new SelectionModel<Employee>(true, []);

  constructor(
    private matDialog: MatDialog,
    private employeeService: EmployeeService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['employees']?.currentValue) {
      this.dataSource = new MatTableDataSource<Employee>(this.employees);
      this.setTotals();
    }
  }

  private setTotals(): void {
    this.employees.forEach((employee: Employee) => {
      this.totals.paidHours += employee.total.totalPaidRate;
      this.totals.overTImePaidHours += employee.total.totalOverTimePaid;
      this.totals.totalWorkedTime += employee.total.totalWorkedTime;
    });
  }

  private resetTotals(): void {
    Object.keys(this.totals).forEach((key: string) => this.totals[key as keyof Totals] = 0);
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
        this.resetTotals();
        this.setTotals();
        this.employees = cloneObject(this.employees);
        this.dataSource = new MatTableDataSource<Employee>(this.employees);
        this.selection.clear();
        this.changeDetectorRef.markForCheck();
      });
  }

}
