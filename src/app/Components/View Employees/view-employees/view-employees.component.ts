import { Component, OnInit } from '@angular/core';
import { FiltersComponent } from '../filters/filters.component';
import { EmployeeTableComponent } from '../employee-table/employee-table.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { EmployeeService } from '../../../Services/employee.service';
import { Employee } from '../../../Models/Employee';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-employees',
  standalone: true,
  imports: [FiltersComponent, EmployeeTableComponent, RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './view-employees.component.html',
  styleUrl: './view-employees.component.css'
})
export class ViewEmployeesComponent implements OnInit {
  allEmployees: Employee[] = [];
  employees: Employee[] = [];
  originalSort: Employee[] = [];
  selectedAlphabet: string = "";
  selectedProperties: string[] = [];
  constructor(private employeeService: EmployeeService) { 
  }

  ngOnInit(): void {
    this.employeeService.get().subscribe((data) => {
      this.allEmployees = data;
      this.employees = [...this.allEmployees];
      this.originalSort = [...this.allEmployees];
    }); 
  }

  sort(event: { columnIdentifier: keyof Employee, sortDirection: 'asc' | 'desc' | 'none' }): void {
    const { columnIdentifier, sortDirection } = event;

    const compareEmployees = (emp1: Employee, emp2: Employee): number => {
      var value1, value2;

      if(columnIdentifier === 'department' || columnIdentifier === 'role') {
        value1 = emp1[columnIdentifier].name;
        value2 = emp2[columnIdentifier].name;
      }
      else{
        value1 = emp1[columnIdentifier]!;
        value2 = emp2[columnIdentifier]!;
      } 

        if (value1 < value2) return -1;
        if (value1 > value2) return 1;
        return 0;
    };

    if (sortDirection === 'asc') {
      this.employees.sort(compareEmployees);
    } else if (sortDirection === 'desc') {
      this.employees.sort((a, b) => compareEmployees(b, a));
    } else if (sortDirection === 'none') {
      this.employees = this.originalSort;
    }
  }

  handleSelectedAlphabet(alphabet: string) {
    this.selectedAlphabet = alphabet;     
    this.applyFilter();
  }

  handleSelectedProperties(options: string[]) {
    this.selectedProperties = options;
    this.applyFilter();
  }

  resetPropertyFilter() {
    this.selectedProperties = [];
    this.applyFilter();
  }

  applyFilter() {
    this.employees = this.allEmployees.filter(employee => {
      const matchesAlphabet = this.selectedAlphabet
        ? employee.firstName.startsWith(this.selectedAlphabet)
        : true;

      const matchesProperties = this.selectedProperties.length
        ? this.selectedProperties.some(prop =>
            employee.location === prop ||
            employee.department.name === prop ||
            employee.status === prop
          )
        : true;

      return matchesAlphabet && matchesProperties;
    });
    this.originalSort = [...this.employees];
  }

  delete(employeesToDelete: string[]) {
    employeesToDelete.forEach(id => {
      this.employeeService.deleteById(id).subscribe({
        next: () => {
          console.log('Employee deleted successfully');
          this.allEmployees = [...this.allEmployees.filter(emp => emp.empNo !== id)];
          this.employees = [...this.employees.filter(emp => emp.empNo !== id)];
          this.originalSort = [...this.originalSort.filter(emp => emp.empNo !== id)];
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
        }
      });
    });
  }
  
  // exportToCSV() {
  //   const employeeTable = document.querySelector('app-employee-table table');

  //   if (employeeTable) 
  //   {
  //     const rows = Array.from(employeeTable.querySelectorAll('tbody tr'));
  //     let csvContent = "";

  //     const header = Array.from(employeeTable.querySelectorAll('thead th'))
  //                         .slice(1, -2)
  //                         .map(th => {
  //                             if ((th.textContent || '').trim() === 'USER') 
  //                             {
  //                               return 'User Name,User Email';
  //                             } else 
  //                             {
  //                               return (th.textContent || '').trim();
  //                             }
  //                         });
  //     csvContent += header.join(",") + "\n";

  //     rows.forEach(row => {
  //       if ((row as HTMLTableRowElement).style.display !== 'none') 
  //       {
  //         const rowData = Array.from(row.children)
  //                               .slice(1, -2)
  //                               .map(cell => {
  //                                   const secondChild = cell.children[1];
  //                                   if (secondChild && secondChild.tagName.toLowerCase() === 'div') 
  //                                   {
  //                                     const name = ((cell.children[1].querySelector('p:nth-child(1)') as HTMLParagraphElement).textContent || '').trim();
  //                                     const email = ((cell.children[1].querySelector('p:nth-child(2)') as HTMLParagraphElement).textContent || '').trim();
  //                                     return `${name},${email}`;
  //                                   } else 
  //                                   {
  //                                     return (cell.textContent || '').trim();
  //                                   }
  //                               });
  //         csvContent += rowData.join(",") + "\n";
  //       }
  //     });

  //     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  //     const link = document.createElement('a');
  //     const url = URL.createObjectURL(blob);
  //     link.setAttribute('href', url);
  //     link.setAttribute('download', 'employees.csv');
  //     link.style.visibility = 'hidden';
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } else 
  //   {
  //     console.error('Employee table not found');
  //   }
  // }

  tableToCSV(): void {
    let employees: Employee[] = this.employees;
    let csvContent = this.arrayToCSV(employees);
    this.downloadCSVFile(csvContent);
  }
  
  arrayToCSV(objArray: Employee[]): string {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let headers: string[] = Object.keys(array[0]).filter(header => (header !== "profileImage" && header !== "mobileNo"))!;
    let str = '"ID","NAME","EMAIL","JOINING DATE","DEPARTMENT ID","DEPARTMENT NAME","ROLE ID","ROLE NAME","LOCATION NAME","STATUS","DOB","MANAGER","PROJECT ID","PROJECT NAME"\r\n';
    return array.reduce((str: string, next: Employee) => {
      str += `"${next.empNo}","${next.firstName} ${next.lastName}","${next.emailId}","${next.joinDate}","${next.department.id}","${next.department.name}","${next.role.id}","${next.role.name}","${next.location}","${next.status}","${next.dateOfBirth}","${next.manager}","${next.project.id}","${next.project.name}"\r\n`;
      return str;
    }, str);
  }

  downloadCSVFile(csv_data: string): void {
    let CSVFile = new Blob([csv_data], { type: "text/csv" });
    let temp_link = document.createElement('a');
    temp_link.download = "employeeTable.csv";
    let url = window.URL.createObjectURL(CSVFile);
    temp_link.href = url;
    temp_link.style.display = "none";
    document.body.appendChild(temp_link);
    temp_link.click();
    document.body.removeChild(temp_link);
  }
  
  
}
