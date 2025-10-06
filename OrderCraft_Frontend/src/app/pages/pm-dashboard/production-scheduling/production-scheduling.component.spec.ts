import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionSchedulingComponent } from './production-scheduling.component';

describe('ProductionSchedulingComponent', () => {
  let component: ProductionSchedulingComponent;
  let fixture: ComponentFixture<ProductionSchedulingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionSchedulingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductionSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
