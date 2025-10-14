import { TestBed } from '@angular/core/testing';

import { ProductionTimelineService } from './production.service';

describe('ProductionService', () => {
  let service: ProductionTimelineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionTimelineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
