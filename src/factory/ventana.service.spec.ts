import { TestBed } from '@angular/core/testing';

import { VentanaService } from './ventana.service';

describe('VentanaService', () => {
  let service: VentanaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VentanaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
