import {Employee, EmployeeShift} from '../../common/interfaces';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {getTImeDiffByHours, getTImeDiffByHours2} from '../../common/helpers';
import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-employees-info',
  templateUrl: './employees-info.component.html',
  styleUrls: ['./employees-info.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeesInfoComponent implements OnInit {

  public employeesForm = this.formBuilder.group({
    employees: this.formBuilder.array([])
  });
  @Output() submit$ = new EventEmitter<Employee[]>();

  public displayedColumns = ['shift', 'clockIn', 'clockOut', 'totalTime'];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EmployeesInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employees: Employee[] },
  ) {
  }

  ngOnInit(): void {
    this.initFormArr();
  }

  /* TODO It is not best practise call method on template (change this later) */
  public getTImeDiffByHours(time1: string, time2: string) {
    return getTImeDiffByHours(time1, time2);
  }

  public getTImeDiffByHours2(time1: string, time2: string) {
    return getTImeDiffByHours2(time1, time2);
  }

  private initFormArr(): void {
    this.data.employees.forEach((item: Employee) => {

      const arr = this.formBuilder.array([]);

      item.shifts.forEach((i: EmployeeShift, shiftIndex: number) => {
        const group = this.formBuilder.group({
          id: this.formBuilder.control(i.id),
          clockIn: this.formBuilder.control(i.clockIn, [Validators.required]),
          clockOut: this.formBuilder.control(i.clockOut, [Validators.required]),
          today: this.formBuilder.control(getTImeDiffByHours2(i.clockIn, i.clockOut).today),
          tomorrow: this.formBuilder.control(getTImeDiffByHours2(i.clockIn, i.clockOut).tomorrow),
        });
        (arr as FormArray).push(group);
      });

      const formGroup = this.formBuilder.group({
        id: this.formBuilder.control(item.id),
        email: this.formBuilder.control(item.email),
        name: this.formBuilder.control(item.name, [Validators.required]),
        hourlyRate: this.formBuilder.control(item.hourlyRate, [Validators.required]),
        overtimeRate: this.formBuilder.control(item.overtimeRate, [Validators.required]),
        shifts: arr
      });

      (this.employeesForm.get('employees') as FormArray).push(formGroup);
    });
  }

  public get employeeFormGroups(): FormArray {
    return this.employeesForm.get('employees') as FormArray;
  }

  public employeeFormShiftGroups(i: number): FormArray {
    return this.employeeFormGroups.controls[i].get('shifts') as FormArray;
  }

  public onSubmit(): void {

    console.log(this.employeesForm.value.employees);

    this.submit$.emit(this.employeesForm.value.employees as Employee[]);
    this.onClose();
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  public onTimeChange(e: Event, employeeIndex: number, shiftIndex: number): void {
    console.log((e.target as HTMLInputElement).value);
  }

}


