import { Routes } from '@angular/router';
import { ViewEmployeesComponent } from './Components/View Employees/view-employees/view-employees.component';
import { ViewRolesComponent } from './Components/View Roles/view-roles/view-roles.component';
import { AddEmployeeComponent } from './Components/Add Employee/add-employee/add-employee.component';
import { AddRoleComponent } from './Components/Add Role/add-role/add-role.component';
import { RoleDetailsComponent } from './Components/Role Details/role-details/role-details.component';
import { LoginComponent } from './Components/Login/login/login.component';

export const routes: Routes = [

    {
        path: "",
        component: LoginComponent,
    },
    {
        path: "employees",
        component: ViewEmployeesComponent,
    },
    {
        path:"roles",
        component: ViewRolesComponent
    },
    {
        path: "employees/add-employee",
        component: AddEmployeeComponent
    },
    {
        path: "roles/add-role",
        component: AddRoleComponent
    },
    {
        path: "roles/:id",
        component: RoleDetailsComponent
    }
];
