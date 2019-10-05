import { TestBed } from '@angular/core/testing';

import { EntregaService } from './entrega.service';

describe('EntregaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EntregaService = TestBed.get(EntregaService);
    expect(service).toBeTruthy();
  });
});
