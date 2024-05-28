import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Firestore } from '@angular/fire/firestore';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: jasmine.createSpyObj('UserService', ['getUserDisplayName', 'getUserImg']) },
        { provide: Firestore, useValue: jasmine.createSpyObj('Firestore', ['collection']) }
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});