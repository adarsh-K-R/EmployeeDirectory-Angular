import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alphabetical-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alphabetical-filter.component.html',
  styleUrl: './alphabetical-filter.component.css'
})
export class AlphabeticalFilterComponent {
  alphabets: string[] = [];
  @Output() selectedAlphabet = new EventEmitter<string>();
  filterLogoSrc: string = '../../../../assets/images/interface/filter-black.svg';
  onSelectFilerLogoSrc: string = '../../../../assets/images/interface/filter.svg'

  constructor() {
    this.alphabets = this.generateAlphabets();
  }

  generateAlphabets(): string[] {
    const alphabets = [];
    for (let i = 65; i <= 90; i++) {
      alphabets.push(String.fromCharCode(i));
    }
    return alphabets;
  }
  
  onAlphabetChange(event: Event): void {
    const selectedAlphabet = (event.target as HTMLInputElement).value;
    this.filterLogoSrc = selectedAlphabet === "" ? '../../../../assets/images/interface/filter-black.svg' : this.onSelectFilerLogoSrc;
    this.selectedAlphabet.emit(selectedAlphabet);
  }
}
