import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphabeticalFilterComponent } from './alphabetical-filter.component';

describe('AlphabeticalFilterComponent', () => {
  let component: AlphabeticalFilterComponent;
  let fixture: ComponentFixture<AlphabeticalFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphabeticalFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlphabeticalFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
