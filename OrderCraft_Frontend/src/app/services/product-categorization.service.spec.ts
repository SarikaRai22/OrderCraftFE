import { TestBed } from '@angular/core/testing';

import { ProductCategorizationService } from './product-categorization.service';

describe('ProductCategorizationService', () => {
  let service: ProductCategorizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductCategorizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
