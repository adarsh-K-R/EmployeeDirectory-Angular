import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastComponent } from '../toast/toast.component';
import { EmployeeService } from '../../../Services/employee.service';
import { Observer } from 'rxjs';
import { Employee } from '../../../Models/Employee';
import { DepartmentService } from '../../../Services/department.service';
import { ProjectService } from '../../../Services/project.service';
import { Department } from '../../../Models/Department';
import { Project } from '../../../Models/Project';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../../Services/role.service';
import { Role } from '../../../Models/Role';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastComponent, CommonModule, FormsModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css',
})

export class AddEmployeeComponent implements OnInit {
  @ViewChild('addEmployeeForm') addEmployeeForm: any;
  @ViewChild('profileImage') profilePhoto: any;
  @ViewChild('dateOfBirth') dateOfBirth: any;
  @ViewChild('empError') empError: any;
  @ViewChild('firstNameError') firstNameError: any;
  @ViewChild('lastNameError') lastNameError: any;
  @ViewChild('emailError') emailError: any;
  @ViewChild('mobileNoError') mobileNoError: any;
  @ViewChild('joinDateError') joinDateError: any;
  @ViewChild('locationError') locationError: any;
  @ViewChild('departmentError') departmentError: any;
  @ViewChild('projectError') projectError: any;
  @ViewChild('roleError') roleError: any;
  toastMessage: string = '';
  toastType: string = 'info';
  toastDuration: number = 5000;
  showToast: boolean = false;
  departments: Department[] = [];
  projects: Project[] = [];

  empNo: string = '';
  firstName: string = '';
  lastName: string = '';
  dob: string = '';
  email: string = '';
  mobileNo: string = '';
  joinDate: string = '';
  location: string = '';
  roleId: string = '';
  departmentId: string = '';
  manager: string = '';
  projectId: string = '';

  constructor(
    private empService: EmployeeService, 
    private roleService: RoleService,
    private departmentService: DepartmentService,
    private projectService: ProjectService,
    private renderer: Renderer2
    ) {}

  ngOnInit(): void {
    this.initialiseForm();
    this.departmentService.get().subscribe((data) => this.departments = data);
    this.projectService.get().subscribe((data) => this.projects = data);
  }

  private async initialiseForm() {
    let today = new Date();
    let maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    let minDate = new Date(today.getFullYear() - 70, today.getMonth(), today.getDate());
    let formattedMaxDate = maxDate.toISOString().split('T')[0];
    let formattedMinDate = minDate.toISOString().split('T')[0];

    if (this.dateOfBirth.nativeElement) {
      this.renderer.setAttribute(this.dateOfBirth.nativeElement, 'max', formattedMaxDate);
      this.renderer.setAttribute(this.dateOfBirth.nativeElement, 'min', formattedMinDate);
    } else {
      setTimeout(() => {
        this.renderer.setAttribute(this.dateOfBirth.nativeElement, 'max', formattedMaxDate);
        this.renderer.setAttribute(this.dateOfBirth.nativeElement, 'min', formattedMinDate);
      });
  }
}

  async updatePreviewImage(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const preview = this.profilePhoto.nativeElement;
    let reader;

    if (input && preview && input.files && input.files[0]) {
        reader = new FileReader();
        reader.onload = function (e) {
            if (e.target) {
                preview.setAttribute('src', e.target.result as string);
            }
        }
        reader.readAsDataURL(input.files[0]);
    }
  }

  validateInput(event: Event): void {
    let input = event.target as HTMLInputElement | HTMLSelectElement;
    let errorElement = input.nextElementSibling as HTMLSpanElement;
    if (!input.value.trim()) {
        errorElement.style.display = "block";
    } else {
        errorElement.style.display = "none";
    }
  }

  async validateEmpNo(): Promise<boolean> {
    const empNoInput = this.empNo;
    const empError = this.empError.nativeElement;
    const empNoRegex = /^TZ\d{4}$/;
    let isEmpNo = empNoRegex.test(empNoInput.trim());

    if (!empNoInput.trim()) {
        empError.style.display = "block";
        empError.innerHTML = "&#9888; This is a required field.";
        return false;
    } else if(!isEmpNo) {
        empError.style.display = "block";
        empError.innerHTML = "&#9888; Please enter empNo in required format (TZ1234).";
        return false;
    } else {        
        this.empService.getById(empNoInput.trim()).subscribe(employee => {
          if (employee) {
            empError.style.display = "block";
            empError.innerHTML = "&#9888; Please enter unique empNo.";
          } else {
            empError.style.display = "none";
          }
        });
    }
    return true;
  }

  validateFirstName(): boolean {
    const firstNameInput = this.firstName;
    const firstNameError = this.firstNameError.nativeElement;
    const firstNameRegex = /^[a-zA-Z ]+$/;
    let isfirstName = firstNameRegex.test(firstNameInput.trim());
    if(!firstNameInput.trim()) {
        firstNameError.style.display = "block";
        firstNameError.innerHTML = "&#9888; This is a required field.";
        return false;
    }
    else if(!isfirstName) {
        firstNameError.style.display = "block";
        firstNameError.innerHTML = "&#9888; Please enter alphabets only.";
        return false;
    }
    else {
        firstNameError.style.display = "none";
        return true; 
    }
  }

  validateLastName(): boolean {
    const lastNameInput = this.lastName;
    const lastNameError = this.lastNameError.nativeElement;
    const lastNameRegex = /^[a-zA-Z]+$/;
    let islastName = lastNameRegex.test(lastNameInput.trim());
    if(!lastNameInput.trim()) {
        lastNameError.style.display = "block";
        lastNameError.innerHTML = "&#9888; This is a required field.";
        return false;
    }
    else if(!islastName) {
        lastNameError.style.display = "block";
        lastNameError.innerHTML = "&#9888; Please enter alphabets only.";
        return false;
    }
    else {
        lastNameError.style.display = "none";
        return true; 
    }
  }

  validateEmail(): boolean {
    const emailInput = this.email;
    const emailError = this.emailError.nativeElement;
    const emailRegex = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
    let isEmail = emailRegex.test(emailInput.trim());
    if(!emailInput.trim()) {
        emailError.style.display = "block";
        emailError.innerHTML = "&#9888; This is a required field.";
        return false;
    }
    else if(!isEmail) {
        emailError.style.display = "block";
        emailError.innerHTML = "&#9888; Please enter proper email id.";
        return false;
    }
    else {
        emailError.style.display = "none";
        return true; 
    }
  }

  validateMobileNo(): boolean {
    const mobileNoInput = this.mobileNo;
    const mobileNoError = this.mobileNoError.nativeElement;
    const mobileNoRegex = /^\d{10}$|^$/;
    let isMobileNo = mobileNoRegex.test(mobileNoInput.trim());
    if(!isMobileNo){
        mobileNoError.style.display = "block";
        mobileNoError.innerHTML = "&#9888; Please enter proper mobile number."
        return false;
    }
    else{
        mobileNoError.style.display = "none";
        return true;
    }
  }

  async submitForm(event: SubmitEvent) {
    event.preventDefault();

    if (!await this.validate()) {
        return false;
    }

    return this.addEmployeeData();
  }

  async populateJobTitle(): Promise<void> {
    const jobTitleDropdown = document.getElementById("job-title") as HTMLSelectElement;
    const departmentId = this.departmentId;
    jobTitleDropdown.length = 1; // Remove all options except the first one
    let rolesInSelectedDepartment: Role[] = [];

    const rolesObserver: Observer<Role[]> = {
      next: (roles: Role[]) => {        
        rolesInSelectedDepartment = roles;        
        for (const element of rolesInSelectedDepartment) {
          jobTitleDropdown.options[jobTitleDropdown.options.length] = new Option(element.name, element.id);          
        }
      },
      error: (error: any) => {
        console.error('Error fetching roles for department ID', departmentId, ':', error);
      },
      complete: () => {}
    };

    this.roleService.getRolesByDepartmentId(departmentId).subscribe(rolesObserver);
  }

  async fetchDepartmentRole(roleId: string): Promise<Role> {
    return new Promise<Role>((resolve, reject) => {
        const observer: Observer<Role> = {
            next: (response) => {
                resolve(response);
            },
            error: (error) => {
                console.error('Error fetching role', error);
                reject(error);
            },
            complete: () => {}
        };

        this.roleService.getById(roleId).subscribe(observer);
    });
  }

  async addEmployeeData(): Promise<void> {
    let profilePicture = this.profilePhoto.nativeElement.currentSrc;
    const empNo = this.empNo.trim();
    const firstName = this.firstName.trim().replace(/\s+/g, ' ');
    const lastName = this.lastName.trim();
    const dob = this.dob;
    const email = this.email.trim();
    const mobileNo = this.mobileNo.trim();
    let joinDate = this.joinDate;
    const location = this.location;
    const roleId = this.roleId;
    const departmentId = this.departmentId;
    const assignManager = this.manager;
    const projectId = this.projectId;

    var department: Department = this.departments.find(department => department.id === departmentId)!;

    var role:Role = await this.fetchDepartmentRole(roleId);

    var project: Project = this.projects.find(project => project.id === projectId)!;

    const statusState = ["Active", "Inactive"];
    const status = statusState[Math.floor(Math.random() * statusState.length)];

    joinDate = this.formatDate(joinDate);

    let empData: Employee = {
      profilePicture: profilePicture,
      empNo: empNo,
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: dob,
      emailId: email,
      mobileNo: mobileNo,
      joinDate: joinDate,
      location: location,
      role: role,
      department: department,
      manager: assignManager,
      project: project,
      status: status
    };
    const observer: Observer<Employee> = {
      next: (response) => {},
      error: (error) => {
        console.error('Error adding employee', error);
      },
      complete: () => {}
    };

    this.empService.post(empData).subscribe(observer);

    this.addEmployeeForm.nativeElement.reset();
    this.profilePhoto.nativeElement.setAttribute("src", "/assets/images/interface/profile.png");

    this.showToastMessage("Employee Added Successfully", "success", 4000);
  }

  formatDate(dateString: string): string {
    let parts = dateString.split("-");
    let formattedDate = parts[2] + "-" + parts[1] + "-" + parts[0];
    return formattedDate;
  }

  async validate(): Promise<boolean> {
    let flag = true;

    flag = await this.validateEmpNo() && flag;
    flag = this.validateFirstName() && flag;
    flag = this.validateLastName() && flag;
    flag = this.validateEmail() && flag;
    flag = this.validateMobileNo() && flag;

    const validations = [
        { inputValue: this.joinDate, error: this.joinDateError.nativeElement },
        { inputValue: this.departmentId, error: this.departmentError.nativeElement },
        { inputValue: this.location, error: this.locationError.nativeElement },
        { inputValue: this.roleId, error: this.roleError.nativeElement },
        { inputValue: this.projectId, error: this.projectError.nativeElement }
    ];

    validations.forEach((validation) => {      
        const input = validation.inputValue;
        const error = validation.error;
        if (!input.trim()) {
            error.style.display = "block";
            flag = false;
        } else {
            error.style.display = "none";
        }
    });
    return flag;
  }

  showToastMessage(message: string, type: string, duration: number): void {
    this.toastMessage = message;
    this.toastType = type;
    this.toastDuration = duration;
    this.showToast = true;

    setTimeout(() => {
        this.showToast = false;
    }, duration);
  }
}
