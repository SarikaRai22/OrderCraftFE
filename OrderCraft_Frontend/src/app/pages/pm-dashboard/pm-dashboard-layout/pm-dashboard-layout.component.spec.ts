import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmDashboardLayoutComponent } from './pm-dashboard-layout.component';

describe('PmDashboardLayoutComponent', () => {
  let component: PmDashboardLayoutComponent;
  let fixture: ComponentFixture<PmDashboardLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PmDashboardLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PmDashboardLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
