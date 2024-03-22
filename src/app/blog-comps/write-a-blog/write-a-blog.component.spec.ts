import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteABlogComponent } from './write-a-blog.component';

describe('WriteABlogComponent', () => {
  let component: WriteABlogComponent;
  let fixture: ComponentFixture<WriteABlogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WriteABlogComponent]
    });
    fixture = TestBed.createComponent(WriteABlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
