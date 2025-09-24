import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProductionTimelineComponent } from './view-production-timeline.component';

describe('ViewProductionTimelineComponent', () => {
  let component: ViewProductionTimelineComponent;
  let fixture: ComponentFixture<ViewProductionTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProductionTimelineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewProductionTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
