import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

import { ManagePostsComponent } from './manage-posts.component';
import { BlogService } from '../../blog-home/services/blog.service';

const blogServiceStub = {
  getAllPosts: () => of([]),
  deletePost: () => of({}),
};

describe('ManagePostsComponent', () => {
  let component: ManagePostsComponent;
  let fixture: ComponentFixture<ManagePostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagePostsComponent],
      providers: [
        provideRouter([]),
        { provide: BlogService, useValue: blogServiceStub },
      ],
    }).compileComponents();

    (window as unknown as { confirm: () => boolean }).confirm = () => true;

    fixture = TestBed.createComponent(ManagePostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
