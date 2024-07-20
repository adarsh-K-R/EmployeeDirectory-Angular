import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallUpdatesComponent } from './install-updates.component';

describe('InstallUpdatesComponent', () => {
  let component: InstallUpdatesComponent;
  let fixture: ComponentFixture<InstallUpdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstallUpdatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstallUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
