import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopLocationComponent } from './shop-location.component';

describe('ShopLocationComponent', () => {
  let component: ShopLocationComponent;
  let fixture: ComponentFixture<ShopLocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShopLocationComponent]
    });
    fixture = TestBed.createComponent(ShopLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
