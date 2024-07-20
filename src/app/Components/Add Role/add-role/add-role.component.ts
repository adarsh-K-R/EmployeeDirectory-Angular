import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { EmployeeService } from '../../../Services/employee.service';
import { Employee } from '../../../Models/Employee';
import { DepartmentService } from '../../../Services/department.service';
import { Department } from '../../../Models/Department';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Role } from '../../../Models/Role';
import { Observer } from 'rxjs';
import { RoleService } from '../../../Services/role.service';

@Component({
  selector: 'app-add-role',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CommonModule, FormsModule],
  templateUrl: './add-role.component.html',
  styleUrl: './add-role.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AddRoleComponent implements OnInit {
  constructor(
    private empService: EmployeeService,
    private departmentService: DepartmentService,
    private roleService: RoleService
    ){}

  @ViewChild('addRoleForm') roleForm: any;
  @ViewChild('employeeDropdown') employeeDropdown: any;
  @ViewChild('employeeList') employeeList: any;
  @ViewChild('toggleDropdownArrow') toggleDropdownArrow: any;
  @ViewChild('searchWrapper') searchWrapper: any;

  employees: Employee[] = [];
  departments: Department[] = [];
  lastKeyPressed: string | null = null;

  name: string = '';;
  departmentId: string = '';
  description: string = '';
  location: string = '';
  empSearch: string = '';

  ngOnInit(): void {
    this.empService.get().subscribe(data => this.employees = data);
    this.departmentService.get().subscribe(data => this.departments = data);
    document.addEventListener('click', (event) => {
      let withinEmployeeDropdown = (event.target as HTMLElement).closest('.assign-employee');
      if (!withinEmployeeDropdown) {
          this.closeEmployeeDropdown();
      }
  }, true);
  }

  async validate(): Promise<boolean> {
    let flag = true;
    
    const validations = [
        { inputId: 'role-name' },
        { inputId: 'role-department' },
        { inputId: 'role-location' },
        { inputId: 'role-description' }
    ];

    validations.forEach(function (validation) {
        const input = document.getElementById(validation.inputId) as HTMLSelectElement | HTMLInputElement;
        const error = input.nextElementSibling as HTMLSpanElement;
        if (input && error) {
            if (!input.value.trim()) {
                error.style.display = "block";
                flag = false;
            } else {
                error.style.display = "none";
            }
        }
    });

    // flag = await this.validateRoleUniqueness() && flag;

    return flag;
}

  async submitRoleForm(event: SubmitEvent): Promise<boolean | void> {
    event.preventDefault();        

    if (!await this.validate()) {
        return false;
    }

    this.addRoleData();

    this.roleForm.nativeElement.reset();
    const tokens = document.querySelectorAll(".token");
    for (let i = 0; i < tokens.length; i++) {
        this.removeLastToken();
    }
  }

  async addRoleData(): Promise<void> {
    const tokens = document.querySelectorAll(".token");
    const selectedEmployees: string[] = [];
    tokens.forEach(token => {
        selectedEmployees.push(String(token.getAttribute("data-empNo")));
    });

    var department: Department = this.departments.find(department => department.id == this.departmentId)!;

    let roleData: Role = {
        name: this.name,
        description: this.description,
        department: department,
        location: this.location
    }

    const observer: Observer<Role> = {
      next: (response) => {
        selectedEmployees.forEach(async (emp) => {
          this.empService.getById(emp).subscribe(employee => {
            if (employee) {
              employee.role = response;
              this.empService.update(emp, employee).subscribe(response => {
                console.log('Employee updated successfully:', response);
              });
            }
          });
        })
      },
      error: (error) => {
        console.error('Error adding role', error);
      },
      complete: () => {}
    };    

    this.roleService.post(roleData).subscribe(observer);
  }

  validateInput(event: Event): void {
    let input = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    let errorElement = input.nextElementSibling as HTMLSpanElement;
    if (!input.value.trim()) {
        errorElement.style.display = "block";
    } else {
        errorElement.style.display = "none";
    }
  }

  toggleEmployeeDropdown(event: MouseEvent): void {
    event.stopPropagation();
    let employeeDropdownContainer = this.employeeDropdown.nativeElement;
    let toggleState = employeeDropdownContainer.dataset['toggleState'];
    if (toggleState === "expanded") {
        this.closeEmployeeDropdown();
        employeeDropdownContainer.dataset['toggleState'] = "collapsed";
    }
    else {
        this.openEmployeeDropdown();
        employeeDropdownContainer.dataset['toggleState'] = "expanded";
    }
  }

  openEmployeeDropdown(): void {
    this.toggleDropdownArrow.nativeElement.classList.add("expanded");
    this.employeeList.nativeElement.classList.add("show");
    this.showUpdatedEmployeeList();
  }

  closeEmployeeDropdown(): void {
    this.toggleDropdownArrow.nativeElement.classList.remove("expanded");
    this.employeeList.nativeElement.classList.remove("show");
  }

  async showUpdatedEmployeeList(): Promise<void> {    
    const inputValue = this.empSearch?.toLowerCase();
    const dropdownList = this.employeeList.nativeElement;
    const tokens = document.querySelectorAll(".token span");
    const tokenNames = Array.from(tokens).map(token => (token.textContent || '').trim().toLowerCase());
    const roleDepartmentId = this.departmentId;

    dropdownList.innerHTML = "";
    
    this.employees.forEach(emp => {
        let name = emp.firstName + " " + emp.lastName;
        let photo = emp.profilePicture;
        let department = emp.department.id;

        if ((inputValue === '' || name.toLowerCase().includes(inputValue))
            && (!tokenNames.includes(name.toLowerCase()))
            && (roleDepartmentId == department)) {
            const dropdownItem = document.createElement("div");
            dropdownItem.classList.add("dropdown-item");
            dropdownItem.setAttribute("attr.data-empNo", emp.empNo);
            dropdownItem.innerHTML =
                `<img class="emp-photo" src="${photo}" alt="${name}">
            <span>${name}</span>`;
            dropdownItem.addEventListener("click", () => this.addEmployeeToken(name, emp.empNo));
            dropdownList.appendChild(dropdownItem);
        }
    });
  }

  addEmployeeToken(name: string, empNo: string): void {
    const tokenContainer = this.searchWrapper.nativeElement;
    const token = document.createElement("div");
    token.classList.add("token");
    token.setAttribute("data-empNo", empNo);
    token.innerHTML =
    `<span>${name}</span>
    <button class="close-token">x</button>`;
    tokenContainer.insertBefore(token, document.querySelector("#employee-search"));

    const closeButton = token.querySelector(".close-token") as HTMLButtonElement;
    closeButton.addEventListener('click', (event) => this.removeEmployeeToken(event));

    this.removeEmployeeFromDropdown(name);
    this.empSearch = "";
    (document.querySelector("#employee-search") as HTMLInputElement).focus();
  }

  removeEmployeeFromDropdown(name: string): void {
    const dropdownItems = document.querySelectorAll(".employee-dropdown-list .dropdown-item");
    dropdownItems.forEach(item => {
        if (item.parentNode && (item.textContent || '').trim() === name) {
            item.parentNode.removeChild(item);
        }
    });
  }

  removeEmployeeToken(event: MouseEvent): void {
    event.stopPropagation();
    const token = (event.target as HTMLButtonElement).parentNode as HTMLDivElement;
    const tokenContainer = token.parentNode as HTMLDivElement;
    tokenContainer.removeChild(token);

    this.showUpdatedEmployeeList();
  }

  handleTokenDelete(event: KeyboardEvent): void {
    const key = event.key;
    const employeeSearch = this.empSearch;

    if (key === 'Backspace' || key === 'Delete') {
        if (employeeSearch == '') {
            if (this.lastKeyPressed === key) {
                this.removeLastToken();
                this.lastKeyPressed = null;
            }
            else {
                this.lastKeyPressed = key;
            }
        } else {
            this.lastKeyPressed = null;
        }
    } else {
        this.lastKeyPressed = null;
    }
  }

  removeLastToken(): void {
    const tokens = document.querySelectorAll(".token");
    const lastToken = tokens[tokens.length - 1];
    if (lastToken && lastToken.parentNode) {
        lastToken.parentNode.removeChild(lastToken);
        this.showUpdatedEmployeeList();
    }
  }
}
