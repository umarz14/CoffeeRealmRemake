import { TestBed } from '@angular/core/testing';

import { GoogleMapsJsApiService } from './google-maps-js-api.service';

describe('GoogleMapsJsApiService', () => {
  let service: GoogleMapsJsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleMapsJsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
