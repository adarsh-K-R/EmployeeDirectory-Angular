import { Component } from '@angular/core';
import { ViewEmployeesComponent } from '../../View Employees/view-employees/view-employees.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { ViewRolesComponent } from '../../View Roles/view-roles/view-roles.component';
import { RouterOutlet } from '@angular/router';
import { AddEmployeeComponent } from '../../Add Employee/add-employee/add-employee.component';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    ViewEmployeesComponent, 
    SearchBarComponent, 
    ViewRolesComponent, 
    AddEmployeeComponent,
    RouterOutlet
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {

}
