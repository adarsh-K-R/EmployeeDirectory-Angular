import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../Models/Employee';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './employee-table.component.html',
  styleUrl: './employee-table.component.css'
})
export class EmployeeTableComponent implements OnInit {
  @Input() employees: Employee[] = [];
  @Output() sortData = new EventEmitter<{ columnIdentifier: keyof Employee, sortDirection: 'asc' | 'desc' | 'none' }>();
  @Output() employeesToDelete = new EventEmitter<string[]>();
  @ViewChild('ellipse') ellipse!: ElementRef;

  currentSort: 'asc' | 'desc' | 'none' = 'none';
  columnIdentifier: keyof Employee = 'firstName';
  selectedEmployees: string[] = [];

  constructor() {}

  ngOnInit(): void {
    document.addEventListener("click", (event) => {
      this.hideDropdowns(event);
    });
  }

  sort(columnIdentifier: keyof Employee) {
    this.columnIdentifier = columnIdentifier;
    switch (this.currentSort) {
      case 'asc':
        this.currentSort = 'desc';
        break;
      case 'desc':
        this.currentSort = 'none';
        break;
      case 'none':
        this.currentSort = 'asc';
        break;
      default:
        this.currentSort = 'none';
        break;
    }
    this.sortData.emit({ columnIdentifier: this.columnIdentifier, sortDirection: this.currentSort });
  }

  getArrowImage(column: keyof Employee, direction: 'up' | 'down'): string {
    if (column !== this.columnIdentifier) {
      return '../../../../assets/images/interface/down-arrow-black.svg'; // Default image
    }

    if (direction === 'up' && this.currentSort === 'asc') {
      return '../../../../assets/images/interface/down-arrow-red.svg'; // Ascending sort image
    }

    if (direction === 'down' && this.currentSort === 'desc') {
      return '../../../../assets/images/interface/down-arrow-red.svg'; // Descending sort image
    }

    return '../../../../assets/images/interface/down-arrow-black.svg'; // Default image
  }

  toggleAllCheckbox(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedEmployees = this.employees.map(employee => employee.empNo);
    } else {
      this.selectedEmployees = [];
    }    
  }

  handleSelectedEmployee(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const id = checkbox.id;

    if (checkbox.checked) {
        if (!this.selectedEmployees.includes(id)) {
            this.selectedEmployees.push(id);
        }
    } else {
        this.selectedEmployees = this.selectedEmployees.filter(empId => empId !== id);
    }    
  }

  deleteSelectedRows() {
    this.employeesToDelete.emit(this.selectedEmployees);
    this.selectedEmployees = [];
  }

  toggleEmployeeActionsPopup(event: MouseEvent): void {
    
    // const span = event.target as HTMLSpanElement;
    // const div = span.nextElementSibling as HTMLDivElement;
    // div.classList.toggle('active');
    
    
    let activeActionsPopup = document.querySelector(".ellipses-popup.active");
    if(activeActionsPopup){
        activeActionsPopup.classList.remove("active");
        (activeActionsPopup as HTMLDivElement).style.display = "none";

        if(activeActionsPopup !== (event.target as HTMLElement).nextElementSibling) {
            ((event.target as HTMLElement).nextElementSibling as HTMLElement).classList.add("active");
            ((event.target as HTMLElement).nextElementSibling as HTMLElement).style.display = 'block';
        } 
    } 
    else {
        ((event.target as HTMLElement).nextElementSibling as HTMLElement).classList.add("active");
        ((event.target as HTMLElement).nextElementSibling as HTMLElement).style.display = 'block';
    }
  }

  hideDropdowns(event: MouseEvent): void {
    const ellipsesDropdown = document.querySelector('.ellipses-popup.active');

    if((event.target) &&  !(event.target as HTMLElement).classList.contains('ellipses-span')){
        if(ellipsesDropdown) {
            ellipsesDropdown.classList.remove("active");
            (ellipsesDropdown as HTMLDivElement).style.display = "none";
        }
    }

    const multiselectDropdown = document.querySelectorAll('.multiselect');
    multiselectDropdown.forEach(dropdown => {
        if((event.target) && !(event.target as HTMLDivElement).classList.contains('multiselect') && !(event.target as HTMLElement).classList.contains('selected-options')){
            dropdown.children[1].classList.remove('show');
        }
    })
  }
}