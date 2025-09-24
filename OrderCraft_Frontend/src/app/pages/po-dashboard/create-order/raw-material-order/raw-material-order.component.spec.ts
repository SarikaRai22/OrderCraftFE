import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialOrderComponent } from './raw-material-order.component';

describe('RawMaterialOrderComponent', () => {
  let component: RawMaterialOrderComponent;
  let fixture: ComponentFixture<RawMaterialOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawMaterialOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RawMaterialOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
