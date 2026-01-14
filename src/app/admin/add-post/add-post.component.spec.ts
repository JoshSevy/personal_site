import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AddPostComponent } from './add-post.component';
import { BlogService } from '../../blog-home/services/blog.service';

describe('AddPostComponent', () => {
  let component: AddPostComponent;
  let fixture: ComponentFixture<AddPostComponent>;

  const blogServiceStub = {
    createPost: (post: any) => of({}),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPostComponent],
      providers: [
        { provide: BlogService, useValue: blogServiceStub }
      ]
    })
    .compileComponents();

    // Prevent actual alert dialogs during tests
    // Avoid using Jasmine globals (spyOn) in TS compilation; stub directly instead
    (window as any).alert = () => {};

    fixture = TestBed.createComponent(AddPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
