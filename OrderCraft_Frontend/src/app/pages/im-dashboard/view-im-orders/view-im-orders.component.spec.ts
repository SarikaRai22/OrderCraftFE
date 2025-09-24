import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewImOrdersComponent } from './view-im-orders.component';

describe('ViewImOrdersComponent', () => {
  let component: ViewImOrdersComponent;
  let fixture: ComponentFixture<ViewImOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewImOrdersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewImOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
