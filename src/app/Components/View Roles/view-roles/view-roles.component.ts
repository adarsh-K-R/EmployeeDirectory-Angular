import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyFiltersComponent } from '../../Common/property-filters/property-filters.component';
import { RoleCardComponent } from '../role-card/role-card.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Role } from '../../../Models/Role';
import { RoleService } from '../../../Services/role.service';

@Component({
  selector: 'app-view-roles',
  standalone: true,
  imports: [ CommonModule, PropertyFiltersComponent, RoleCardComponent, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './view-roles.component.html',
  styleUrl: './view-roles.component.css'
})
export class ViewRolesComponent implements OnInit {
  roles: Role[]=[];
  allRoles: Role[] = [];
  selectedOptions: string[] = [];

  constructor(private service: RoleService) {}

  ngOnInit(): void {
    this.service.get().subscribe((data) => {
      this.roles = data;
      this.allRoles = [...this.roles];
    });
  }

  properties(options: string[]) {
    this.selectedOptions = options;
    this.applyFilters();
  }
  
  applyFilters(): void {
    this.roles = this.allRoles.filter(role => {
      const matchesProperties = this.selectedOptions.length
        ? this.selectedOptions.some(prop =>
            role.location === prop ||
            role.department.name === prop
          )
        : true;
      return matchesProperties;
    });
  }

  resetFilters(): void {
    this.selectedOptions = [];
    this.applyFilters();
  }
}