import { TestBed } from '@angular/core/testing';

import { MLSService } from './mls.service';

describe('MLSService', () => {
  let service: MLSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MLSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
