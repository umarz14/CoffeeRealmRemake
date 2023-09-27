import { TestBed } from '@angular/core/testing';

import { GooglePlacesApiService } from './google-places-api.service';

describe('GooglePlacesApiService', () => {
  let service: GooglePlacesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GooglePlacesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
