import { Component, EventEmitter, Output } from '@angular/core';
import { AlphabeticalFilterComponent } from '../alphabetical-filter/alphabetical-filter.component';
import { PropertyFiltersComponent } from '../../Common/property-filters/property-filters.component';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [AlphabeticalFilterComponent, PropertyFiltersComponent],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent {

  @Output() selectedAlphabet = new EventEmitter<string>();
  @Output() selectedOptions = new EventEmitter<string[]>();
  @Output() resetFilters = new EventEmitter<void>();

  onAlphabetSelected(selectedAlphabet: string) {
    this.selectedAlphabet.emit(selectedAlphabet);
  }

  properties(options: string[]) {
    this.selectedOptions.emit(options);
  }

  reset() {
    this.resetFilters.emit();
  }
}