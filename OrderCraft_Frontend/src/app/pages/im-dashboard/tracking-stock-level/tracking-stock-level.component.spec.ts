import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingStockLevelComponent } from './tracking-stock-level.component';

describe('TrackingStockLevelComponent', () => {
  let component: TrackingStockLevelComponent;
  let fixture: ComponentFixture<TrackingStockLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackingStockLevelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrackingStockLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
