import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategorizationComponent } from './product-categorization.component';

describe('ProductCategorizationComponent', () => {
  let component: ProductCategorizationComponent;
  let fixture: ComponentFixture<ProductCategorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCategorizationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductCategorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
