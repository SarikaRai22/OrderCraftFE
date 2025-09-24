import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoDashboardLayoutComponent } from './po-dashboard-layout.component';

describe('PoDashboardLayoutComponent', () => {
  let component: PoDashboardLayoutComponent;
  let fixture: ComponentFixture<PoDashboardLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoDashboardLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoDashboardLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
