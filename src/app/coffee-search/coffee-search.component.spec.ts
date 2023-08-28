import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoffeeSearchComponent } from './coffee-search.component';

describe('CoffeeSearchComponent', () => {
  let component: CoffeeSearchComponent;
  let fixture: ComponentFixture<CoffeeSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoffeeSearchComponent]
    });
    fixture = TestBed.createComponent(CoffeeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
