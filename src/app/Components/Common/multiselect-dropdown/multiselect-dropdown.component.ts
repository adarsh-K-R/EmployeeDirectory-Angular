import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-multiselect-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multiselect-dropdown.component.html',
  styleUrl: './multiselect-dropdown.component.css'
})
export class MultiselectDropdownComponent {
  @Input() options: string[] = [];
  @Input() dropdownType: string = "";
  @Output() selectedOptions = new EventEmitter<string[]>();
  @Input() dropdownLabel: string[] = [];
  selectedProperties: string[] = [];

  toggleDropdown(event: Event): void {
    (event.currentTarget as HTMLDivElement).children[1].classList.toggle("show");
  }

  updateSelectedOptions(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const selectedPropertyOption = inputElement.value;

    if (inputElement.checked) 
    {
      this.selectedProperties.push(selectedPropertyOption);
    } else 
    {
      const index = this.selectedProperties.indexOf(selectedPropertyOption);
      if (index !== -1) {
          this.selectedProperties.splice(index, 1);
      }
    }
    this.selectedOptions.emit(this.selectedProperties);
  }
}
