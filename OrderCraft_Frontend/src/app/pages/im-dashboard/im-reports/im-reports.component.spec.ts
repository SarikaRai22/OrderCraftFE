import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImReportsComponent } from './im-reports.component';

describe('ImReportsComponent', () => {
  let component: ImReportsComponent;
  let fixture: ComponentFixture<ImReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
