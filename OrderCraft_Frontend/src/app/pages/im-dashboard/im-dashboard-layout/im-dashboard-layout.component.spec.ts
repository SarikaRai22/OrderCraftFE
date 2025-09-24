import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImDashboardLayoutComponent } from './im-dashboard-layout.component';

describe('ImDashboardLayoutComponent', () => {
  let component: ImDashboardLayoutComponent;
  let fixture: ComponentFixture<ImDashboardLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImDashboardLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImDashboardLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
