import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MultiselectDropdownComponent } from '../multiselect-dropdown/multiselect-dropdown.component';
import { CommonModule } from '@angular/common';
import { DepartmentService } from '../../../Services/department.service';
import { Department } from '../../../Models/Department';

@Component({
  selector: 'app-property-filters',
  standalone: true,
  imports: [MultiselectDropdownComponent, CommonModule],
  templateUrl: './property-filters.component.html',
  styleUrl: './property-filters.component.css'
})

export class PropertyFiltersComponent implements OnInit {
  @Output() properties = new EventEmitter<string[]>();
  @Output() resetFilters = new EventEmitter<void>();
  @Input() isStatus = true;
  statusOptions = ['Active', 'Inactive'];
  locationOptions = ['Hyderabad', 'Bangalore', 'Delhi'];
  departmentOptions: string[] = [];
  
  selectedProperties: string[] = [];
  selectedStatuses: string[] = [];
  selectedLocations: string[] = [];
  selectedDepartments: string[] = [];

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.departmentService.get().subscribe((data: Department[]) => {
      this.departmentOptions = data.map(department => department.name);
    });
  }

  handleStatuses(options: string[]) {
    this.selectedStatuses = options;
  }

  handleLocations(options: string[]) {
    this.selectedLocations = options;
  }

  handleDepartments(options: string[]) {
    this.selectedDepartments = options;
  }

  apply(): void {
    this.selectedProperties = this.selectedStatuses.concat(this.selectedLocations, this.selectedDepartments);
    this.properties.emit(this.selectedProperties);
  }

  reset(): void {
    this.selectedProperties = [];
    this.selectedStatuses = [];
    this.selectedLocations = [];
    this.selectedDepartments = [];
    this.resetFilters.emit();
  }
}
