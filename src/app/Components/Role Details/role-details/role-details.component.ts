import { Component, OnInit } from '@angular/core';
import { EmployeeCardComponent } from '../employee-card/employee-card.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../../Services/employee.service';
import { Employee } from '../../../Models/Employee';

@Component({
  selector: 'app-role-details',
  standalone: true,
  imports: [EmployeeCardComponent, CommonModule],
  templateUrl: './role-details.component.html',
  styleUrl: './role-details.component.css'
})
export class RoleDetailsComponent implements OnInit {

  employees: Employee[] = [];

  filteredEmployees: Employee[] = [];

  constructor(
    private route: ActivatedRoute,
    private empService: EmployeeService) { }

  ngOnInit(): void {
    this.empService.get().subscribe((data) => {
      this.employees = data;      

      this.route.params.subscribe(params => {
        const roleId:string = params['id'];
        this.filteredEmployees = this.employees.filter(employee => employee['role'].id!.toString() === roleId);      
      });      
    });
  }
  
}