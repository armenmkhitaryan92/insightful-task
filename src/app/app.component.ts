import {Observable} from 'rxjs';
import {Component} from '@angular/core';
import {Employee} from './common/interfaces';
import {EmployeeService} from './common/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent  {

  public employees: Observable<Employee[]> = this.employeeService.getEmployees();

  constructor(
    private employeeService: EmployeeService
  ) {
  }




}
