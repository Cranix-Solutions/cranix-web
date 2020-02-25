import { TestBed } from '@angular/core/testing';

import { GenericObjectService } from './generic-object.service';

describe('GenericObjectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GenericObjectService = TestBed.get(GenericObjectService);
    expect(service).toBeTruthy();
  });
});
